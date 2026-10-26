/**
 * Libro 3D flotante (three.js). Un solo canvas transparente cubre toda la
 * ventana (fijo, sin recibir clics) y el libro se dibuja encima de la página
 * siguiendo dos "huecos" del DOM: el del hero y el de «Sobre el libro».
 *
 *  - Al hacer scroll, el libro se queda flotando en pantalla mientras el hero
 *    pasa por debajo, da una vuelta y aterriza en el segundo hueco; desde ahí
 *    baja con la página como cualquier otro elemento.
 *  - Se puede arrastrar desde cualquiera de los dos huecos para girarlo.
 *  - Como el canvas es del tamaño de la ventana, la sombra nunca se
 *    cortan en un borde.
 *
 * Solo se importa en el navegador (ver components/sitio/LibroFlotante.tsx).
 */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type OpcionesLibro = {
  src: string;
  /** Los huecos, en orden de aparición en la página: [hero, sobre el libro]. */
  huecos: () => (HTMLElement | null)[];
  /** Vueltas que da el libro mientras viaja del primer hueco al segundo. */
  vueltas?: number;
  /** Velocidad del giro automático (radianes por segundo). */
  velocidad?: number;
  onReady?: () => void;
  onError?: (err: unknown) => void;
};

export type ControlLibro = {
  destruir: () => void;
};

const easeInOut = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2; // seno: arranca y frena sin tirones
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const TAU = Math.PI * 2;
/** Ángulo inicial en el hero: se ve el lomo. */
const INICIO = -0.45;
/** Ángulo "de frente" al aterrizar: la portada, con un asomo del lomo. */
const FRENTE = -0.22;

export function montarLibro(host: HTMLElement, o: OpcionesLibro): ControlLibro {
  const vueltas = o.vueltas ?? 0.75;
  const velocidad = o.velocidad ?? 0.35;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
    precision: "highp",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping; // respeta los colores de la portada
  renderer.toneMappingExposure = 0.95;
  renderer.setClearColor(0x000000, 0);
  Object.assign(renderer.domElement.style, { width: "100%", height: "100%", display: "block" });
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  // Luz pareja y suave: con más ambiente y menos reflejo, las portadas se leen
  // sin manchas de brillo (antes la contraportada casi no se entendía).
  scene.environmentIntensity = 0.45;
  scene.add(new THREE.HemisphereLight(0xfffaf0, 0xe8dcc4, 0.9));
  const key = new THREE.DirectionalLight(0xfff4e6, 0.7);
  key.position.set(-1.5, 2, 2.5);
  scene.add(key);
  // Relleno violeta muy suave desde atrás: le da al lomo el color de Camila.
  const relleno = new THREE.DirectionalLight(0xc79be3, 0.15);
  relleno.position.set(1.5, 0.5, -2);
  scene.add(relleno);

  // Cámara fija mirando al origen; el libro se mueve delante de ella.
  const DIST = 2;
  const camera = new THREE.PerspectiveCamera(28, 1, 1, 3.2);
  camera.position.set(0, 0, DIST);
  camera.lookAt(0, 0, 0);

  // Grupo del libro: el modelo centrado en el origen + su sombra.
  const grupo = new THREE.Group();
  grupo.rotation.x = 0.1; // se ve un poco desde arriba
  scene.add(grupo);

  // Sombra de contacto, suave y separada del libro para que parezca flotar.
  const sc = document.createElement("canvas");
  sc.width = sc.height = 128;
  const sg = sc.getContext("2d")!;
  const sgrd = sg.createRadialGradient(64, 64, 0, 64, 64, 64);
  sgrd.addColorStop(0, "rgba(31,58,68,0.22)");
  sgrd.addColorStop(0.6, "rgba(31,58,68,0.06)");
  sgrd.addColorStop(1, "rgba(31,58,68,0)");
  sg.fillStyle = sgrd;
  sg.fillRect(0, 0, 128, 128);
  const sombra = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }),
  );
  sombra.rotation.x = -Math.PI / 2;
  grupo.add(sombra);

  let H = 0.245; // alto del modelo en unidades del archivo
  let ancho = 0.17;
  let modelo: THREE.Group | null = null;
  let listo = false;
  new GLTFLoader().load(
    o.src,
    (gltf) => {
      const m = gltf.scene;
      const box = new THREE.Box3().setFromObject(m);
      const size = box.getSize(new THREE.Vector3());
      const ctr = box.getCenter(new THREE.Vector3());
      m.position.set(-ctr.x, -ctr.y, -ctr.z); // centrado en el origen del grupo
      // Portada mate: sin barniz (clearcoat) y con más rugosidad, para que el
      // reflejo no lave el texto de la portada ni de la contraportada.
      m.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const mat of mats) {
          if (mat instanceof THREE.MeshPhysicalMaterial) {
            mat.clearcoat = 0;
            mat.clearcoatRoughness = 1;
          }
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.roughness = Math.max(mat.roughness, 0.88);
            mat.metalness = 0;
            mat.envMapIntensity = 0.6;
            mat.needsUpdate = true;
          }
        }
      });
      grupo.add(m);
      modelo = m;
      H = size.y;
      ancho = size.x;
      sombra.scale.set(size.x * 1.15, size.z * 4 + size.x * 0.35, 1);
      sombra.position.y = -H / 2 - H * 0.08;
      listo = true;
      o.onReady?.();
    },
    undefined,
    (err) => o.onError?.(err),
  );

  // ---- Tamaño del canvas = ventana -------------------------------------
  let vw = 1;
  let vh = 1;
  function layout() {
    vw = host.clientWidth || window.innerWidth;
    vh = host.clientHeight || window.innerHeight;
    const anchoPx = Math.round(vw);
    const altoPx = Math.round(vh);
    const actual = renderer.getSize(new THREE.Vector2());
    if (actual.x !== anchoPx || actual.y !== altoPx) renderer.setSize(anchoPx, altoPx, false);
    camera.aspect = vw / vh;
    camera.updateProjectionMatrix();
    if (listo && colocar(performance.now())) renderer.render(scene, camera);
  }
  const ro = new ResizeObserver(layout);
  ro.observe(host);
  layout();

  // ---- Arrastrar para girar (desde los huecos) ---------------------------
  let giroArrastre = 0;
  let inclinacion = 0; // arrastre vertical: inclina el libro hacia adelante o atrás
  let arrastrando = false;
  let ultimaInteraccion = -1e9;
  let xPrev = 0;
  let yPrev = 0;
  const limpiezas: (() => void)[] = [];
  function conectarHueco(el: HTMLElement) {
    const down = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      if (e.pointerType === "mouse") e.preventDefault(); // sin selección de texto ni arrastre nativo
      arrastrando = true;
      xPrev = e.clientX;
      yPrev = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!arrastrando) return;
      giroArrastre += (e.clientX - xPrev) * 0.012;
      inclinacion = Math.max(-0.6, Math.min(0.6, inclinacion + (e.clientY - yPrev) * 0.008));
      xPrev = e.clientX;
      yPrev = e.clientY;
      ultimaInteraccion = performance.now();
    };
    const up = (e: PointerEvent) => {
      if (!arrastrando) return;
      arrastrando = false;
      ultimaInteraccion = performance.now();
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    };
    const sinArrastreNativo = (e: Event) => e.preventDefault();
    el.addEventListener("dragstart", sinArrastreNativo);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    limpiezas.push(() => {
      el.removeEventListener("dragstart", sinArrastreNativo);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    });
  }
  let huecosConectados: HTMLElement[] = [];
  function asegurarHuecos(): (HTMLElement | null)[] {
    const hs = o.huecos();
    for (const h of hs) {
      if (h && !huecosConectados.includes(h)) {
        conectarHueco(h);
        huecosConectados.push(h);
      }
    }
    return hs;
  }

  // ---- Posición en pantalla según el scroll ------------------------------
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const visibleH = 2 * DIST * Math.tan(vFov / 2); // alto del mundo visible a la distancia del libro
  let giroAuto = 0;
  let tPrev = performance.now();
  let visible = true;

  // Progreso del viaje suavizado en el tiempo: el libro persigue al scroll con
  // inercia en vez de pegarse a él, así una rueda rápida no lo hace saltar.
  // En los extremos (0 y 1) coincide exactamente con el hueco.
  let pSuave = 0;
  let primerCuadro = true;
  const SUAVIDAD = 4.5; // más alto = sigue al scroll más rápido

  function colocar(ahora: number) {
    const dt = Math.min(0.1, (ahora - tPrev) / 1000);
    tPrev = ahora;
    const [h1, h2] = asegurarHuecos();
    if (!h1) return false;
    const r1 = h1.getBoundingClientRect();
    const r2 = h2?.getBoundingClientRect() ?? r1;
    // El hueco 2 puede ser pegajoso (sticky); su posición "natural" la da el
    // envoltorio marcado con data-ancla, para que el avance no se mueva con él.
    const ancla = h2?.parentElement?.dataset.ancla != null ? h2.parentElement.getBoundingClientRect() : r2;
    const y = window.scrollY;
    let p: number;
    let left: number;
    let top: number;
    let w: number;
    let h: number;
    if (vw >= 1024 || !h2) {
      // Escritorio: el libro tiene su propia columna. Se queda flotando en
      // pantalla mientras el hero pasa por debajo y aterriza en el hueco 2.
      const recorrido = Math.max(1, ancla.top + y - (r1.top + y));
      p = suavizar(h2 ? clamp01(y / recorrido) : 0, dt);
      left = lerp(r1.left, r2.left, p);
      top = lerp(r1.top, r2.top, p);
      w = lerp(r1.width, r2.width, p);
      h = lerp(r1.height, r2.height, p);
    } else if (r1.bottom > -r1.height * 0.1) {
      // Móvil, primera parte: el libro se va con el hero (si se quedara fijo
      // taparía el título, que en móvil va debajo de él).
      p = suavizar(0, dt);
      left = r1.left;
      top = r1.top;
      w = r1.width;
      h = r1.height;
    } else {
      // Móvil, segunda parte: cuando se acerca el hueco 2, el libro baja desde
      // arriba de la pantalla dando la vuelta y se posa en él.
      p = suavizar(clamp01((vh * 0.95 - r2.top) / (vh * 0.7)), dt);
      left = r2.left;
      top = lerp(-r2.height * 1.1, r2.top, p);
      w = r2.width;
      h = r2.height;
    }
    const cx = left + w / 2;
    const cy = top + h / 2;

    // Fuera de pantalla (ya pasó «Sobre el libro»): no se dibuja.
    visible = cy + h > -40 && cy - h < vh + 40;
    if (!visible) return false;

    const wx = (cx / vw - 0.5) * visibleH * camera.aspect;
    const wy = (0.5 - cy / vh) * visibleH;
    grupo.position.set(wx, wy, 0);
    // Alto del libro dentro de su hueco: más en escritorio; en celular crece
    // al llegar a «Sobre el libro», donde hay más espacio.
    const factor = vw >= 1024 ? 0.84 : lerp(0.72, 0.86, p);
    const s = ((h * factor) / vh) * visibleH / H;
    grupo.scale.setScalar(s);

    // Giro. En el hero gira solo (se pausa 2 s después de arrastrar). Al viajar
    // hacia «Sobre el libro» da su vuelta y llega DE FRENTE: el ángulo de
    // llegada es el frente más cercano a "ángulo actual + vueltas". Ya posado,
    // se mece suave alrededor del frente en vez de seguir girando.
    const quieto = ahora - ultimaInteraccion > 2000;
    if (!reduceMotion && !arrastrando && quieto && p < 0.001) giroAuto += velocidad * dt;
    const anguloHero = INICIO + giroAuto;
    const k = Math.round((anguloHero + vueltas * TAU - FRENTE) / TAU);
    const llegada = FRENTE + k * TAU;
    const mecer = reduceMotion ? 0 : 0.16 * Math.sin(ahora / 1700) * p;
    // Fuera del hero, lo que el visitante giró a mano vuelve solo al frente.
    if (p > 0.02 && !arrastrando && ahora - ultimaInteraccion > 2500) {
      const resto = giroArrastre - Math.round(giroArrastre / TAU) * TAU;
      giroArrastre -= resto * (1 - Math.exp(-2.2 * dt));
    }
    if (!arrastrando) inclinacion *= Math.exp(-3 * dt); // la inclinación siempre vuelve
    grupo.rotation.y = lerp(anguloHero, llegada, p) + mecer + giroArrastre;
    grupo.rotation.x = 0.1 + inclinacion;

    return true;
  }

  /** Acerca pSuave al objetivo con decaimiento exponencial y devuelve la curva. */
  function suavizar(objetivo: number, dt: number): number {
    if (primerCuadro || reduceMotion) {
      pSuave = objetivo;
      primerCuadro = false;
    } else {
      pSuave += (objetivo - pSuave) * (1 - Math.exp(-SUAVIDAD * dt));
      if (Math.abs(objetivo - pSuave) < 0.0005) pSuave = objetivo;
    }
    return easeInOut(pSuave);
  }

  // ---- Bucle --------------------------------------------------------------
  let raf = 0;
  let corriendo = false;
  function frame(ahora: number) {
    if (!corriendo) return;
    if (listo && colocar(ahora)) {
      renderer.domElement.style.visibility = "";
      renderer.render(scene, camera);
    } else {
      renderer.domElement.style.visibility = "hidden";
    }
    raf = requestAnimationFrame(frame);
  }
  function arrancar() {
    if (corriendo) return;
    corriendo = true;
    tPrev = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function parar() {
    corriendo = false;
    cancelAnimationFrame(raf);
  }
  function sincronizar() {
    if (document.hidden) parar();
    else arrancar();
  }
  document.addEventListener("visibilitychange", sincronizar);
  sincronizar();

  return {
    destruir() {
      parar();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sincronizar);
      for (const l of limpiezas) l();
      if (modelo) {
        modelo.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          const mats = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
          for (const mat of mats) {
            for (const v of Object.values(mat)) if (v instanceof THREE.Texture) v.dispose();
            mat.dispose();
          }
        });
      }
      sombra.geometry.dispose();
      (sombra.material as THREE.MeshBasicMaterial).map?.dispose();
      (sombra.material as THREE.MeshBasicMaterial).dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    },
  };
}

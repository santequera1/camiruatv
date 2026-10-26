/**
 * Visor 3D del libro (three.js). Gira solo y el visitante puede arrastrarlo
 * para verlo por todos lados. Solo se importa en el navegador (ver
 * components/sitio/Libro3D.tsx): este módulo nunca corre en el SSR.
 */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type OpcionesLibro = {
  src: string;
  /** Giro automático (se apaga solo con prefers-reduced-motion). */
  autoRotate?: boolean;
  /** Velocidad del giro automático (unidades de OrbitControls). */
  speed?: number;
  /** Arrastrar para girar. */
  interactive?: boolean;
  /** Alto del libro como fracción del alto del contenedor. */
  fill?: number;
  /** Ángulo inicial en radianes: negativo muestra el lomo. */
  startAngle?: number;
  onReady?: () => void;
  onError?: (err: unknown) => void;
};

export type ControlLibro = {
  /** Pausa o reanuda el bucle de render (p. ej. cuando el hero sale de pantalla). */
  setActivo: (activo: boolean) => void;
  destruir: () => void;
};

export function montarLibro(container: HTMLElement, opciones: OpcionesLibro): ControlLibro {
  const o = {
    autoRotate: true,
    speed: 1.4,
    interactive: true,
    fill: 0.7, // el contenedor es un 20 % más grande que el hueco visible (ver Libro3D.tsx)
    startAngle: -0.45,
    ...opciones,
  };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping; // respeta los colores de la portada
  renderer.toneMappingExposure = 1.0;
  renderer.setClearColor(0x000000, 0);
  Object.assign(renderer.domElement.style, {
    width: "100%",
    height: "100%",
    display: "block",
    touchAction: "pan-y",
  });
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.8;
  const key = new THREE.DirectionalLight(0xfff4e6, 1.4);
  key.position.set(-1.5, 2, 2.5);
  scene.add(key);
  // Luz de relleno violeta muy suave desde atrás: le da al lomo el color de Camila.
  const relleno = new THREE.DirectionalLight(0xb79bd0, 0.35);
  relleno.position.set(1.5, 0.5, -2);
  scene.add(relleno);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 20);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.enabled = o.interactive;
  controls.autoRotate = o.autoRotate && !reduceMotion;
  controls.autoRotateSpeed = o.speed;
  controls.minPolarAngle = Math.PI * 0.3;
  controls.maxPolarAngle = Math.PI * 0.62; // no deja voltearlo de cabeza

  // Sombra suave de contacto
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(31,58,68,0.30)");
  grd.addColorStop(1, "rgba(31,58,68,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  scene.add(shadow);

  let H = 0.245;
  let modelo: THREE.Group | null = null;
  new GLTFLoader().load(
    o.src,
    (gltf) => {
      const m = gltf.scene;
      const box = new THREE.Box3().setFromObject(m);
      const size = box.getSize(new THREE.Vector3());
      const ctr = box.getCenter(new THREE.Vector3());
      m.position.set(-ctr.x, -box.min.y, -ctr.z); // apoyado en el piso, centrado en el eje de giro
      m.rotation.y = o.startAngle;
      scene.add(m);
      modelo = m;
      H = size.y;
      shadow.scale.set(size.x * 1.6, size.z * 6 + size.x * 0.6, 1);
      shadow.position.y = 0.0005;
      controls.target.set(0, H / 2, 0);
      layout();
      o.onReady?.();
    },
    undefined,
    (err) => o.onError?.(err),
  );

  function layout() {
    const w = container.clientWidth || 300;
    const h = container.clientHeight || 300;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const dist = H / o.fill / (2 * Math.tan(vFov / 2)) / Math.min(1, camera.aspect * 1.4);
    const dir = new THREE.Vector3(0, 0.28, 1).normalize();
    camera.position.copy(dir.multiplyScalar(dist)).add(new THREE.Vector3(0, H / 2, 0));
    controls.target.set(0, H / 2, 0);
    controls.update();
  }
  const ro = new ResizeObserver(layout);
  ro.observe(container);

  let raf = 0;
  let corriendo = false;
  let activo = true;
  function frame() {
    if (!corriendo) return;
    controls.update();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  function arrancar() {
    if (corriendo) return;
    corriendo = true;
    raf = requestAnimationFrame(frame);
  }
  function parar() {
    corriendo = false;
    cancelAnimationFrame(raf);
  }
  function sincronizar() {
    if (activo && !document.hidden) arrancar();
    else parar();
  }
  document.addEventListener("visibilitychange", sincronizar);
  sincronizar();

  return {
    setActivo(v) {
      activo = v;
      sincronizar();
    },
    destruir() {
      parar();
      ro.disconnect();
      controls.dispose();
      document.removeEventListener("visibilitychange", sincronizar);
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
      shadow.geometry.dispose();
      (shadow.material as THREE.MeshBasicMaterial).map?.dispose();
      (shadow.material as THREE.MeshBasicMaterial).dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    },
  };
}

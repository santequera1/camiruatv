import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import type { Articulo } from "@/lib/contenido";

/**
 * Lista de textos con imagen flotante al pasar el mouse (patrón "Hover Image
 * Links", portado de Psicomorfosis: psicomorfosis/docs/hover-image-links-guide.md).
 *
 * - Un solo hover en la fila dispara todo por propagación de variantes.
 * - La imagen entra girando de -10° a +6° con resorte y se mueve un poco en
 *   sentido contrario al mouse; al pasar de fila, una se encoge mientras la
 *   otra crece y por un instante se ven las dos.
 * - Las letras del título hacen una ola y entra una flecha por la derecha.
 * - Clic en la imagen: la abre en grande.
 * En táctil no hay hover: cada fila muestra su miniatura fija a la izquierda.
 */
export function EscrituraLista({ escritos }: { escritos: Articulo[] }) {
  const [ampliada, setAmpliada] = useState<Articulo | null>(null);

  return (
    <>
      <ul className="border-t border-violeta/20">
        {escritos.map((a, i) => (
          <li key={a.slug}>
            <Fila articulo={a} indice={i} onAmpliar={() => setAmpliada(a)} />
          </li>
        ))}
      </ul>
      <AnimatePresence>{ampliada && <Ampliada articulo={ampliada} onClose={() => setAmpliada(null)} />}</AnimatePresence>
    </>
  );
}

const RESORTE = { type: "spring", stiffness: 260, damping: 24 } as const;

function Fila({ articulo: a, indice, onAmpliar }: { articulo: Articulo; indice: number; onAmpliar: () => void }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reducir = useReducedMotion();
  const navigate = useNavigate();

  // La imagen persigue al mouse con inercia, en contrapeso (rango invertido).
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xs = useSpring(x);
  const ys = useSpring(y);
  const top = useTransform(ys, [0.5, -0.5], ["35%", "65%"]);
  const left = useTransform(xs, [0.5, -0.5], ["68%", "52%"]);

  function mover(e: React.MouseEvent) {
    const r = ref.current?.getBoundingClientRect();
    if (!r || reducir) return;
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  }

  const interno = Boolean(a.cuerpo);
  const destino = interno ? undefined : a.urlExterna;
  const meta = `${a.medio}${a.edicion ? ` · ${a.edicion}` : ""} · ${a.anio}`;

  const imagenVariantes: Variants = reducir
    ? { initial: { opacity: 0, scale: 1 }, whileHover: { opacity: 1, scale: 1 } }
    : { initial: { scale: 0, rotate: -10, opacity: 0 }, whileHover: { scale: 1, rotate: 6, opacity: 1 } };

  const contenido = (
    <>
      {/* Miniatura fija en táctil / pantallas angostas */}
      {a.imagen && (
        <img
          src={a.imagen}
          alt=""
          width={96}
          height={96}
          loading="lazy"
          decoding="async"
          className="size-16 shrink-0 rounded-sm object-cover shadow-soft sm:size-20 md:hidden"
        />
      )}

      <div className="relative z-10 min-w-0 flex-1">
        <p className="etiqueta text-violeta/70 transition-colors duration-500 group-hover:text-violeta">{meta}</p>
        <OlaDeLetras texto={a.titulo} reducir={!!reducir} />
        <p className="mt-2 max-w-2xl font-sans text-sm text-violeta-900/60 transition-colors duration-500 group-hover:text-violeta-900/85 sm:text-base">
          {a.resumen}
        </p>
      </div>

      {a.imagen && (
        <motion.img
          src={a.imagen}
          alt={`Imagen de «${a.titulo}»`}
          title="Ver en grande"
          loading="eager"
          decoding="async"
          style={{ top, left, translateX: "-10%", translateY: "-50%" }}
          variants={imagenVariantes}
          transition={RESORTE}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAmpliar();
          }}
          className="absolute z-20 hidden h-56 w-44 cursor-zoom-in rounded-md border border-violeta/15 bg-hoja object-cover object-top shadow-modal md:block lg:h-72 lg:w-56"
        />
      )}

      <div className="hidden shrink-0 overflow-hidden md:block" aria-hidden="true">
        <motion.div
          variants={{ initial: { x: "100%", opacity: 0 }, whileHover: { x: "0%", opacity: 1 } }}
          transition={{ type: "spring" }}
          className="relative z-10 p-3"
        >
          {interno ? <ArrowRight className="size-9 text-violeta" /> : <ArrowUpRight className="size-9 text-violeta" />}
        </motion.div>
      </div>
    </>
  );

  const clases =
    "group relative flex items-center gap-4 border-b border-violeta/20 py-6 outline-none transition-colors duration-500 hover:border-violeta focus-visible:border-violeta focus-visible:bg-violeta-50 md:gap-6 md:py-8";

  // La fila entera es el enlace (y la que escucha hover y foco). El texto del
  // sofoco abre su página aquí mismo; los demás, el medio en otra pestaña.
  return (
    <motion.a
      ref={ref}
      href={interno ? `/${a.slug}` : destino}
      {...(interno ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      onClick={(e) => {
        if (!interno || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate({ to: "/$slug", params: { slug: a.slug } });
      }}
      onMouseMove={mover}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      initial="initial"
      whileHover="whileHover"
      whileFocus="whileHover"
      aria-label={`${a.titulo}. ${meta}${interno ? "" : `. Se abre en ${a.medio}`}`}
      data-indice={indice}
      className={clases}
    >
      {contenido}
    </motion.a>
  );
}

/** Toda la frase se corre a la derecha y cada letra vuelve una tras otra
 *  (al revés que en Psicomorfosis: hacia la izquierda se recortaba la primera letra). */
function OlaDeLetras({ texto, reducir }: { texto: string; reducir: boolean }) {
  const palabras = texto.split(" ");
  let indice = 0;
  // Títulos largos: la ola va más rápido para que no se haga eterna.
  const paso = Math.min(0.03, 1.2 / texto.length);

  return (
    <motion.span
      aria-hidden="true"
      variants={reducir ? undefined : { initial: { x: 0 }, whileHover: { x: 14 } }}
      transition={{ type: "spring" }}
      className="mt-2 block font-serif text-[clamp(1.5rem,2.6vw,2.4rem)] font-semibold leading-[1.12] text-violeta/80 transition-colors duration-500 group-hover:text-violeta"
    >
      {palabras.map((palabra, pi) => (
        // Cada palabra es un bloque sin cortes: así el título envuelve por palabras.
        <span key={pi} className="inline-block whitespace-nowrap">
          {palabra.split("").map((letra) => {
            const i = indice++;
            return (
              <motion.span
                key={i}
                className="inline-block"
                variants={
                  reducir
                    ? undefined
                    : {
                        initial: { x: 0, transition: { type: "spring" } },
                        whileHover: { x: -14, transition: { type: "spring", delay: 0.15 + i * paso } },
                      }
                }
              >
                {letra}
              </motion.span>
            );
          })}
          {pi < palabras.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  );
}

function Ampliada({ articulo: a, onClose }: { articulo: Articulo; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={a.titulo}
      className="fixed inset-0 z-[70] flex cursor-zoom-out items-center justify-center bg-violeta-900/80 p-4 backdrop-blur-md sm:p-8"
    >
      <motion.figure
        initial={{ opacity: 0, scale: 0.88, y: 24, filter: "blur(8px)" }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.94, y: 12, filter: "blur(6px)" }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg cursor-default"
      >
        <img src={a.imagen} alt={`Imagen de «${a.titulo}»`} className="max-h-[75vh] w-full rounded-md bg-hoja object-contain shadow-modal" />
        <figcaption className="mt-4 text-center">
          <p className="font-serif text-xl text-hoja">{a.titulo}</p>
          <p className="mt-1 font-sans text-sm text-hoja/70">
            {a.medio} · {a.anio}
          </p>
        </figcaption>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute -right-3 -top-3 flex size-10 items-center justify-center rounded-full bg-hoja text-violeta shadow-modal transition-transform hover:scale-105"
        >
          <X className="size-5" />
        </button>
      </motion.figure>
    </motion.div>
  );
}

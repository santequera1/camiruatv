import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

/**
 * Un nombre de Brújula. Si tiene imagen, al pasar el mouse aparece encima
 * girando con resorte y se mueve un poco con el cursor (el mismo gesto de
 * Escritura, más pequeño). En táctil la imagen va como miniatura al lado.
 */
export function BrujulaNombre({ nombre, imagen }: { nombre: string; imagen?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducir = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xs = useSpring(x, { stiffness: 200, damping: 22 });
  const ys = useSpring(y, { stiffness: 200, damping: 22 });
  const left = useTransform(xs, [-0.5, 0.5], ["30%", "70%"]);
  const rotar = useTransform(xs, [-0.5, 0.5], [-4, 4]);

  if (!imagen) return <span className="block">{nombre}</span>;

  return (
    <motion.span
      ref={ref}
      tabIndex={0}
      initial="initial"
      whileHover="activo"
      whileFocus="activo"
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r || reducir) return;
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="group relative flex w-fit cursor-default items-center gap-3 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-oro"
    >
      {/* Miniatura fija en táctil */}
      <img
        src={imagen}
        alt=""
        width={72}
        height={72}
        loading="lazy"
        decoding="async"
        className="size-11 shrink-0 rounded-full border-2 border-hoja/70 object-cover md:hidden"
      />
      <span className="decoration-oro/70 underline-offset-[6px] transition-colors group-hover:underline">{nombre}</span>

      {/* Imagen flotante en escritorio */}
      <motion.img
        src={imagen}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        style={{ left, rotate: reducir ? 0 : rotar, translateX: "-50%" }}
        variants={
          reducir
            ? { initial: { opacity: 0 }, activo: { opacity: 1 } }
            : {
                initial: { opacity: 0, scale: 0.4, y: 12, rotate: -10 },
                activo: { opacity: 1, scale: 1, y: 0, rotate: 4 },
              }
        }
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] z-30 hidden max-h-60 w-44 rounded-md border-4 border-hoja bg-hoja object-cover shadow-modal md:block lg:w-52"
      />
    </motion.span>
  );
}

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  texto: string;
  /** Milisegundos por letra. */
  velocidad?: number;
  className?: string;
  /** Se llama cuando termina de escribir (para revelar lo que sigue). */
  alTerminar?: () => void;
};

/**
 * Escribe el texto letra por letra, como en una máquina de escribir, cuando
 * entra en pantalla. En el SSR y sin JS se ve completo; el lector de pantalla
 * siempre recibe el texto entero.
 */
export function Maquina({ texto, velocidad = 85, className, alTerminar }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(texto.length);
  const [escribiendo, setEscribiendo] = useState(false);
  const fin = useRef(alTerminar);
  fin.current = alTerminar;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      fin.current?.();
      return;
    }
    setN(0);
    let timer = 0;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        setEscribiendo(true);
        let i = 0;
        const paso = () => {
          i += 1;
          setN(i);
          if (i < texto.length) {
            // Pequeñas pausas irregulares: se siente tecleado a mano.
            timer = window.setTimeout(paso, velocidad * (0.6 + Math.random() * 0.8));
          } else {
            timer = window.setTimeout(() => {
              setEscribiendo(false);
              fin.current?.();
            }, 900);
          }
        };
        timer = window.setTimeout(paso, 250);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      window.clearTimeout(timer);
    };
  }, [texto, velocidad]);

  return (
    <span ref={ref} className={cn("relative", className)} aria-label={texto}>
      <span aria-hidden="true">
        {texto.slice(0, n)}
        {escribiendo && <span className="cursor-maquina" />}
        {/* Reserva el ancho del texto completo para que nada se mueva al escribir */}
        <span className="invisible">{texto.slice(n)}</span>
      </span>
    </span>
  );
}

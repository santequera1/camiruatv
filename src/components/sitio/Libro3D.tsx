import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ControlLibro } from "@/lib/libro-3d";

type Props = {
  src: string;
  /** Imagen fija por si WebGL no está disponible o mientras carga el modelo. */
  fallbackSrc: string;
  alt: string;
  className?: string;
};

type Estado = "cargando" | "listo" | "error";

/**
 * El libro en 3D. three.js se importa solo en el navegador y solo cuando el
 * componente se monta, así el SSR y el primer HTML no cargan nada pesado.
 */
export function Libro3D({ src, fallbackSrc, alt, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<Estado>("cargando");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let control: ControlLibro | null = null;
    let cancelado = false;
    let observer: IntersectionObserver | null = null;

    import("@/lib/libro-3d")
      .then(({ montarLibro }) => {
        if (cancelado) return;
        const papel = getComputedStyle(document.documentElement).getPropertyValue("--papel").trim();
        control = montarLibro(el, {
          src,
          fondo: papel || undefined,
          onReady: () => setEstado("listo"),
          onError: (err) => {
            console.error("[libro-3d]", err);
            setEstado("error");
          },
        });
        // Sin pintar cuando el hero sale de pantalla: ahorra batería al leer.
        if ("IntersectionObserver" in window) {
          observer = new IntersectionObserver(([entry]) => control?.setActivo(entry.isIntersecting), { threshold: 0 });
          observer.observe(el);
        }
      })
      .catch((err) => {
        console.error("[libro-3d] no se pudo iniciar WebGL", err);
        setEstado("error");
      });

    return () => {
      cancelado = true;
      observer?.disconnect();
      control?.destruir();
    };
  }, [src]);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={ref}
        role="img"
        aria-label={alt}
        className={cn(
          "absolute inset-0 cursor-grab active:cursor-grabbing transition-opacity duration-700",
          estado === "listo" ? "opacity-100" : "opacity-0",
        )}
      />
      {estado !== "listo" && (
        <img
          src={fallbackSrc}
          alt={alt}
          width={800}
          height={800}
          loading="eager"
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full object-contain transition-opacity duration-700",
            estado === "cargando" && "animate-pulse",
          )}
        />
      )}
    </div>
  );
}

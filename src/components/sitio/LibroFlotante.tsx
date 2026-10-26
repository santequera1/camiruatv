import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { ControlLibro } from "@/lib/libro-3d";

/**
 * Canvas fijo a pantalla completa donde vive el libro 3D. three.js se importa
 * solo en el navegador y solo cuando el componente se monta. El libro se
 * dibuja sobre los huecos `<LibroHueco>` de la página (ver lib/libro-3d.ts).
 *
 * Estado en <html>: `libro-3d-listo` cuando el modelo cargó, `libro-3d-error`
 * si WebGL falla (los huecos muestran entonces la imagen de respaldo).
 */
export function LibroFlotante({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let control: ControlLibro | null = null;
    let cancelado = false;
    const html = document.documentElement;

    import("@/lib/libro-3d")
      .then(({ montarLibro }) => {
        if (cancelado) return;
        control = montarLibro(host, {
          src,
          huecos: () => [document.getElementById("libro-hueco-hero"), document.getElementById("libro-hueco-libro")],
          onReady: () => html.classList.add("libro-3d-listo"),
          onError: (err) => {
            console.error("[libro-3d]", err);
            html.classList.add("libro-3d-error");
          },
        });
      })
      .catch((err) => {
        console.error("[libro-3d] no se pudo iniciar WebGL", err);
        html.classList.add("libro-3d-error");
      });

    return () => {
      cancelado = true;
      control?.destruir();
      html.classList.remove("libro-3d-listo", "libro-3d-error");
    };
  }, [src]);

  return <div ref={ref} className="pointer-events-none fixed inset-0 z-30" aria-hidden="true" />;
}

type HuecoProps = {
  id: "hero" | "libro";
  alt: string;
  /** Imagen fija mientras carga el modelo o si WebGL no está disponible. */
  fallbackSrc?: string;
  className?: string;
};

/** Un hueco de la página por donde pasa el libro. Se puede arrastrar para girarlo. */
export function LibroHueco({ id, alt, fallbackSrc, className }: HuecoProps) {
  return (
    <div
      id={`libro-hueco-${id}`}
      role="img"
      aria-label={alt}
      className={cn(
        "relative touch-pan-y select-none cursor-grab [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] active:cursor-grabbing",
        className,
      )}
    >
      {fallbackSrc && (
        // Imagen previa mientras carga el 3D. Ojo, dos trampas que en iPhone
        // dibujaban un recuadro gris alrededor del libro:
        //  - width/height deben tener la proporción REAL de la imagen
        //    (500×820); con 800×800 la caja era cuadrada y el libro quedaba
        //    centrado dentro de ella.
        //  - nada de `filter: drop-shadow`: Safari lo pinta según la caja, no
        //    según la silueta. La sombra es un óvalo aparte, sin filtros.
        <span
          aria-hidden="true"
          className={cn("libro-respaldo pointer-events-none absolute inset-0", id !== "hero" && "libro-respaldo-secundario")}
        >
          <span className="absolute bottom-[10%] left-1/2 h-[6%] w-[46%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(31_58_68/0.2),rgb(31_58_68/0))] lg:bottom-[6%]" />
          <img
            src={fallbackSrc}
            alt=""
            width={500}
            height={820}
            loading={id === "hero" ? "eager" : "lazy"}
            fetchPriority={id === "hero" ? "high" : "auto"}
            decoding="async"
            draggable={false}
            // Mismo alto que el libro 3D (72 % del hueco; 84 % en escritorio) para que el cambio no se note.
            className="absolute inset-0 m-auto h-[72%] w-auto max-w-full lg:h-[84%]"
          />
        </span>
      )}
    </div>
  );
}

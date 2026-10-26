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
      className={cn("relative touch-pan-y select-none cursor-grab active:cursor-grabbing", className)}
    >
      {fallbackSrc && (
        <img
          src={fallbackSrc}
          alt=""
          width={800}
          height={800}
          loading={id === "hero" ? "eager" : "lazy"}
          decoding="async"
          className={cn(
            "libro-respaldo absolute inset-0 h-full w-full object-contain",
            id !== "hero" && "libro-respaldo-secundario",
          )}
        />
      )}
    </div>
  );
}

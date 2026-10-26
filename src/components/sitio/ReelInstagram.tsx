import { useEffect, useRef, useState } from "react";
import { Instagram, Play } from "lucide-react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

let script: Promise<void> | null = null;
/** Carga embed.js de Instagram una sola vez, y solo cuando hace falta. */
function cargarEmbedJs(): Promise<void> {
  if (window.instgrm) return Promise.resolve();
  script ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://www.instagram.com/embed.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("embed.js no cargó"));
    document.body.appendChild(s);
  });
  return script;
}

/**
 * Reel de Instagram con el código de inserción oficial, cargado de forma
 * diferida: embed.js (script de terceros, ~100 KB) solo se pide cuando el reel
 * está por entrar en pantalla. Antes se ve una tarjeta propia con enlace al
 * reel, que también es lo que queda si Instagram no carga (bloqueadores,
 * sin conexión).
 *
 * Va SIN `data-instgrm-captioned`: con él, Instagram incrusta el texto completo
 * del reel (en varios idiomas) y la tarjeta mide ~1400 px. El texto ya está en
 * la página, junto al video (REELS en contenido.ts).
 *
 * El blockquote se inserta con innerHTML en un contenedor que React no toca:
 * embed.js lo reemplaza por un iframe y React no debe intentar reconciliarlo.
 */
export function ReelInstagram({ url, autor, className }: { url: string; autor: string; className?: string }) {
  const caja = useRef<HTMLDivElement>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    let cancelado = false;
    const montar = () => {
      el.innerHTML = `<blockquote class="instagram-media" data-instgrm-permalink="${url}?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style="background:#FFF;border:0;border-radius:12px;margin:0;max-width:540px;min-width:280px;padding:0;width:100%;"><a href="${url}" target="_blank" rel="noopener noreferrer">Ver este reel en Instagram</a></blockquote>`;
      cargarEmbedJs()
        .then(() => {
          if (cancelado) return;
          window.instgrm?.Embeds.process();
          setListo(true);
        })
        .catch(() => {
          el.innerHTML = "";
        });
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        montar();
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => {
      cancelado = true;
      io.disconnect();
    };
  }, [url]);

  return (
    <div className={cn("relative mx-auto w-full max-w-[400px]", className)}>
      {/* Tarjeta propia: se ve mientras carga Instagram o si no carga */}
      {!listo && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex aspect-[9/14] w-full flex-col items-center justify-center gap-4 rounded-xl border border-violeta/20 bg-violeta-50 p-6 text-center text-violeta transition-colors hover:bg-violeta-100"
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-violeta text-hoja">
            <Play className="ml-1 size-7" aria-hidden="true" />
          </span>
          <span className="font-serif text-xl">Ver el reel en Instagram</span>
          <span className="inline-flex items-center gap-1.5 font-sans text-sm text-violeta/70">
            <Instagram className="size-4" aria-hidden="true" />@{autor}
          </span>
        </a>
      )}
      <div ref={caja} className={cn(!listo && "absolute inset-0 overflow-hidden opacity-0")} />
    </div>
  );
}

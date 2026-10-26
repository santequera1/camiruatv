import { Link, useRouterState } from "@tanstack/react-router";
import { Instagram, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CAMILA } from "@/lib/contenido";
import { cn } from "@/lib/utils";

const SECCIONES = [
  { href: "#libro", label: "El libro" },
  { href: "#camila", label: "Camila" },
  { href: "#escritura", label: "Escritura" },
  { href: "#brujula", label: "Brújula" },
];

export function SiteHeader() {
  const [abierto, setAbierto] = useState(false);
  const [conFondo, setConFondo] = useState(false);
  const ruta = useRouterState({ select: (s) => s.location.pathname });
  const enInicio = ruta === "/";

  useEffect(() => {
    const onScroll = () => setConFondo(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setAbierto(false), [ruta]);

  const enlace = (href: string) => (enInicio ? href : `/${href}`);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300",
        conFondo || abierto
          ? "border-b border-border/70 bg-papel/85 shadow-xs backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-baseline gap-2 rounded-sm" aria-label="Inicio">
          <span className="font-serif text-xl font-semibold tracking-tight text-tinta">{CAMILA.nombreCorto}</span>
          <span className="hidden font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:inline">
            @{CAMILA.usuario}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Secciones">
          {SECCIONES.map((s) => (
            <a
              key={s.href}
              href={enlace(s.href)}
              className="etiqueta text-tinta/80 transition-colors hover:text-violeta-700"
            >
              {s.label}
            </a>
          ))}
          <a
            href={CAMILA.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 font-sans text-sm font-medium text-primary-foreground transition-colors hover:bg-tinta-700"
          >
            <Instagram className="size-4" aria-hidden="true" />
            Instagram
          </a>
        </nav>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md text-tinta transition-colors hover:bg-accent md:hidden"
          aria-expanded={abierto}
          aria-controls="menu-movil"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setAbierto((v) => !v)}
        >
          {abierto ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {abierto && (
        <nav id="menu-movil" className="border-t border-border/70 px-4 pb-5 pt-3 md:hidden" aria-label="Secciones">
          <ul className="flex flex-col">
            {SECCIONES.map((s) => (
              <li key={s.href}>
                <a
                  href={enlace(s.href)}
                  onClick={() => setAbierto(false)}
                  className="block py-3 font-serif text-2xl text-tinta transition-colors hover:text-violeta-700"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={CAMILA.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 font-sans text-sm font-medium text-primary-foreground"
          >
            <Instagram className="size-4" aria-hidden="true" />
            Seguir en Instagram
          </a>
        </nav>
      )}
    </header>
  );
}

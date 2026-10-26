import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, Instagram } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CAMILA, LIBRO } from "@/lib/contenido";
import { cn } from "@/lib/utils";

const SECCIONES = [
  { href: "#libro", label: "El libro", num: "01" },
  { href: "#sobre-mi", label: "Sobre mí", num: "02" },
  { href: "#escritura", label: "Escritura", num: "03" },
  { href: "#brujula", label: "Brújula", num: "04" },
];

type Estado = "cerrado" | "abierto" | "cerrando";

export function SiteHeader() {
  const [estado, setEstado] = useState<Estado>("cerrado");
  const [conFondo, setConFondo] = useState(false);
  const ruta = useRouterState({ select: (s) => s.location.pathname });
  const enInicio = ruta === "/";
  const abierto = estado === "abierto";

  useEffect(() => {
    const onScroll = () => setConFondo(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cerrar = useCallback(() => setEstado((e) => (e === "abierto" ? "cerrando" : e)), []);
  const abrir = () => setEstado("abierto");

  // Bloquea el scroll mientras el menú cubre la pantalla y cierra con Escape.
  useEffect(() => {
    if (estado === "cerrado") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [estado, cerrar]);

  useEffect(() => cerrar(), [ruta, cerrar]);

  const enlace = (href: string) => (enInicio ? href : `/${href}`);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300",
          conFondo
            ? "border-b border-violeta/10 bg-hoja/90 shadow-xs backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-baseline gap-2 rounded-sm" aria-label="Inicio">
            <span className="font-serif text-xl font-semibold tracking-tight text-tinta">{CAMILA.nombreCorto}</span>
            <span className="hidden font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:inline">
              @{CAMILA.usuario}
            </span>
          </Link>

          <button
            type="button"
            onClick={abierto ? cerrar : abrir}
            aria-expanded={abierto}
            aria-controls="menu-pantalla"
            className="group relative z-[60] inline-flex h-10 items-center gap-3 rounded-full border border-violeta bg-violeta px-4 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-hoja shadow-soft transition-colors hover:border-violeta-700 hover:bg-violeta-700"
          >
            <span className="relative block h-3 w-3.5" aria-hidden="true">
              <span className="absolute inset-x-0 top-0 h-px bg-current transition-transform duration-300" />
              <span className="absolute inset-x-0 top-1/2 h-px bg-current transition-opacity duration-300" />
              <span className="absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-300" />
            </span>
            Menú
          </button>
        </div>
      </header>

      {estado !== "cerrado" && (
        <div
          id="menu-pantalla"
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
          className={cn("menu-pantalla fixed inset-0 z-50 bg-violeta text-hoja", estado === "cerrando" && "menu-sale")}
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget && estado === "cerrando") setEstado("cerrado");
          }}
        >
          <div className="marco-punteado pointer-events-none absolute inset-4 rounded-sm opacity-40 sm:inset-6" aria-hidden="true" />
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <span className="menu-item font-serif text-xl font-semibold tracking-tight text-papel" style={{ "--i": 0 } as React.CSSProperties}>
              {CAMILA.nombreCorto}
            </span>
            <button
              type="button"
              onClick={cerrar}
              className="menu-item inline-flex h-10 items-center gap-3 rounded-full border border-papel/40 px-4 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-papel transition-colors hover:border-oro hover:text-oro"
              style={{ "--i": 0 } as React.CSSProperties}
            >
              <span className="relative block h-3 w-3.5" aria-hidden="true">
                <span className="absolute inset-x-0 top-1/2 h-px rotate-45 bg-current" />
                <span className="absolute inset-x-0 top-1/2 h-px -rotate-45 bg-current" />
              </span>
              Cerrar
            </button>
          </div>

          <div className="mx-auto flex h-[calc(100%-4rem)] max-w-7xl flex-col justify-between px-6 pb-10 pt-6 sm:px-10 lg:flex-row lg:items-end lg:px-16 lg:pb-16">
            <nav aria-label="Secciones">
              <ul className="flex flex-col gap-1 sm:gap-2">
                {SECCIONES.map((s, i) => (
                  <li key={s.href} className="menu-item" style={{ "--i": i + 1 } as React.CSSProperties}>
                    <a
                      href={enlace(s.href)}
                      onClick={cerrar}
                      className="group flex items-baseline gap-4 py-1 font-serif text-[clamp(2.6rem,8vw,6rem)] font-semibold leading-[1.02] text-papel transition-colors hover:text-oro"
                    >
                      <span className="font-sans text-xs font-semibold tracking-[0.2em] text-oro/80 transition-transform duration-300 group-hover:translate-x-1">
                        {s.num}
                      </span>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="menu-item mt-10 flex flex-col gap-4 lg:mt-0 lg:items-end lg:text-right" style={{ "--i": 5 } as React.CSSProperties}>
              {/* La flor de Factedá: solo en el menú del celular */}
              <img src="/flor.webp" alt="" width={400} height={400} decoding="async" className="flor-mece size-24 self-start drop-shadow-[0_12px_20px_rgb(0_0_0/0.3)] lg:hidden" />
              <p className="max-w-xs font-serif text-lg leading-snug text-papel/80">
                {LIBRO.titulo}. {LIBRO.subtitulo}
              </p>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <a
                  href={CAMILA.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-md bg-oro px-5 font-sans text-sm font-medium text-tinta-900 transition-colors hover:bg-oro-600"
                >
                  <Instagram className="size-4" aria-hidden="true" />
                  Instagram
                </a>
                <a
                  href={CAMILA.linktree}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-md border border-papel/40 px-5 font-sans text-sm font-medium text-papel transition-colors hover:border-oro hover:text-oro"
                >
                  Todos los enlaces <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

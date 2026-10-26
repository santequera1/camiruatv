import { ArrowUpRight, Instagram, Mail } from "lucide-react";
import { CAMILA, LIBRO } from "@/lib/contenido";

export function SiteFooter() {
  const anio = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border bg-papel-2/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-serif text-3xl font-semibold text-tinta">{CAMILA.nombreCorto}</p>
          <p className="mt-2 max-w-md text-muted-foreground">{CAMILA.rol}. {CAMILA.lema}.</p>
          <p className="mt-6 etiqueta text-tinta/70">Aprender y escuchar</p>
        </div>

        <div>
          <p className="etiqueta text-tinta/70">Redes</p>
          <ul className="mt-4 space-y-3 font-sans text-sm">
            <li>
              <a
                href={CAMILA.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-violeta-700"
              >
                <Instagram className="size-4" aria-hidden="true" />
                @{CAMILA.usuario}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CAMILA.correo}`}
                className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-violeta-700"
              >
                <Mail className="size-4" aria-hidden="true" />
                {CAMILA.correo}
              </a>
            </li>
            <li>
              <a
                href={CAMILA.linktree}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-violeta-700"
              >
                <ArrowUpRight className="size-4" aria-hidden="true" />
                Todos los enlaces
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="etiqueta text-tinta/70">El libro</p>
          <p className="mt-4 font-serif text-lg leading-snug text-foreground">{LIBRO.titulo}</p>
          <p className="mt-1 text-sm text-muted-foreground">{LIBRO.editorial}</p>
          <p className="text-sm text-muted-foreground">{LIBRO.apoyo}</p>
        </div>
      </div>
      <div className="border-t border-border/70">
        <p className="mx-auto max-w-7xl px-4 py-5 font-sans text-xs text-muted-foreground sm:px-6 lg:px-8">
          © {anio} {CAMILA.nombre}. Los textos son de su autoría; los publicados en otros medios se enlazan a su fuente.
        </p>
      </div>
    </footer>
  );
}

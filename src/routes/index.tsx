import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, BookOpen, Instagram } from "lucide-react";
import { Libro3D } from "@/components/sitio/Libro3D";
import { ARTICULOS, CAMILA, FAVORITOS, LIBRO } from "@/lib/contenido";
import { metaPagina, titulo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: metaPagina({
      titulo: titulo(),
      descripcion: `${CAMILA.nombre}, ${CAMILA.rol.toLowerCase()}. Autora de «${LIBRO.titulo}»: ${LIBRO.subtitulo}.`,
      ruta: "/",
    }),
  }),
  component: Inicio,
});

function Inicio() {
  return (
    <>
      <Hero />
      <CintaLomo />
      <SobreElLibro />
      <SobreCamila />
      <Escritura />
      <Brujula />
      <Cierre />
    </>
  );
}

/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="titulo-libro">
      {/* Marco punteado de la cubierta, como fondo discreto del hero */}
      <div
        className="marco-punteado pointer-events-none absolute inset-x-4 top-4 bottom-4 rounded-sm sm:inset-x-8 lg:inset-x-12"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl grid-cols-1 items-center gap-6 px-6 pb-12 pt-6 sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-16 lg:pb-16 lg:pt-10">
        {/* El libro va primero en móvil: es el gancho */}
        <div className="order-1 lg:order-2">
          <Libro3D
            src="/libro-desvistiendo.glb"
            fallbackSrc="/libro-portada.webp"
            alt={`Portada del libro ${LIBRO.titulo}, de ${CAMILA.nombre}`}
            className="mx-auto aspect-square w-full max-w-[min(88vw,560px)] lg:max-w-none lg:aspect-[4/5] lg:h-[min(78vh,720px)]"
          />
          <p className="mt-2 text-center font-sans text-xs text-muted-foreground lg:mt-0">Arrástralo para verlo por todos lados</p>
        </div>

        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-sm bg-oro px-3 py-1 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-tinta-900">
            <BookOpen className="size-3.5" aria-hidden="true" />
            Libro · {LIBRO.estado}
          </p>
          <h1
            id="titulo-libro"
            className="mt-5 font-serif text-[clamp(2.9rem,7vw,5.6rem)] font-bold leading-[0.98] text-tinta"
          >
            Desvistiendo
            <br />
            otros estilos
          </h1>
          <p className="mx-auto mt-5 max-w-[32ch] border-l-0 font-serif text-[clamp(1.2rem,2vw,1.6rem)] leading-snug text-foreground lg:mx-0 lg:border-l-[3px] lg:border-tinta lg:pl-4">
            {LIBRO.subtitulo}
          </p>
          <p className="mt-5 font-sans text-sm text-muted-foreground">
            <span className="font-semibold text-tinta">Camila Andrea</span> Rua Tovio · {LIBRO.editorial}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <a
              href="#libro"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 font-sans text-sm font-medium text-primary-foreground transition-colors hover:bg-tinta-700"
            >
              Leer la sinopsis
              <ArrowDown className="size-4" aria-hidden="true" />
            </a>
            <a
              href={CAMILA.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-tinta/30 bg-card/60 px-6 font-sans text-sm font-medium text-tinta transition-colors hover:border-violeta hover:bg-accent hover:text-violeta-700"
            >
              <Instagram className="size-4" aria-hidden="true" />
              Enterarme del lanzamiento
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** El lomo del libro repite el título en vertical; aquí corre en horizontal. */
function CintaLomo() {
  const frase = `${LIBRO.titulo.toUpperCase()} — `;
  const repetida = Array.from({ length: 12 }, () => frase).join("");
  return (
    <div className="overflow-hidden border-y border-tinta/15 bg-tinta py-3 text-papel" aria-hidden="true">
      <div className="lomo-marquee flex w-max whitespace-nowrap font-serif text-sm tracking-[0.3em]">
        <span>{repetida}</span>
        <span>{repetida}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Encabezado({ num, titulo: t, id }: { num: string; titulo: string; id?: string }) {
  return (
    <div className="aparece flex items-baseline gap-4">
      <span className="font-sans text-xs font-semibold tracking-[0.2em] text-oro-600">{num}</span>
      <h2 id={id} className="font-serif text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight text-tinta">
        {t}
      </h2>
    </div>
  );
}

function SobreElLibro() {
  return (
    <section id="libro" className="scroll-mt-20 py-20 lg:py-28" aria-labelledby="h-libro">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Encabezado num="01" titulo="Sobre el libro" id="h-libro" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div className="aparece prosa">
            <p className="capitular">{LIBRO.sinopsis[0]}</p>
            <p>{LIBRO.sinopsis[1]}</p>
          </div>
          <aside className="aparece">
            <div className="marco-punteado rounded-sm bg-card p-7 shadow-soft">
              <p className="etiqueta text-tinta/70">Ficha</p>
              <dl className="mt-4 space-y-4 font-sans text-sm">
                <div>
                  <dt className="text-muted-foreground">Título</dt>
                  <dd className="font-serif text-lg leading-snug text-foreground">{LIBRO.titulo}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Subtítulo</dt>
                  <dd className="font-serif text-base leading-snug text-foreground">{LIBRO.subtitulo}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Autora</dt>
                  <dd className="text-foreground">{CAMILA.nombre}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Editorial</dt>
                  <dd className="text-foreground">{LIBRO.editorial}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Con el apoyo de</dt>
                  <dd className="text-foreground">{LIBRO.apoyo}</dd>
                </div>
              </dl>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Temas">
                {LIBRO.temas.map((t) => (
                  <li key={t} className="rounded-sm bg-accent px-2.5 py-1 font-sans text-xs font-medium text-accent-foreground">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function SobreCamila() {
  return (
    <section id="camila" className="scroll-mt-20 bg-papel-2/50 py-20 lg:py-28" aria-labelledby="h-camila">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Encabezado num="02" titulo="Camila" id="h-camila" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-16">
          <figure className="aparece relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="absolute -inset-3 rounded-sm bg-violeta-100" aria-hidden="true" />
            <div className="absolute -inset-3 translate-x-3 translate-y-3 rounded-sm border border-dashed border-tinta/40" aria-hidden="true" />
            <img
              src="/camila.webp"
              alt={`Retrato de ${CAMILA.nombre}`}
              width={900}
              height={1350}
              loading="lazy"
              decoding="async"
              className="relative aspect-[2/3] w-full rounded-sm object-cover shadow-card"
            />
            <figcaption className="relative mt-5 font-sans text-xs text-muted-foreground">
              {CAMILA.lema}. Aprender y escuchar.
            </figcaption>
          </figure>

          <div>
            <div className="aparece prosa">
              <p className="font-serif text-[clamp(1.4rem,2.4vw,2rem)] font-medium leading-snug text-tinta">
                Soy {CAMILA.nombre}, {CAMILA.rol.toLowerCase()}.
              </p>
              <p className="mt-5">{CAMILA.presentacion[0].replace(/^Soy periodista e investigadora de las modas y el vestir\. /, "")}</p>
              <p>{CAMILA.presentacion[1]}</p>
            </div>

            <ol className="aparece mt-10 grid gap-x-8 gap-y-5 border-t border-border pt-8 sm:grid-cols-2">
              {CAMILA.trayectoria.map((t) => (
                <li key={t.titulo} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-oro-600" aria-hidden="true" />
                  <div>
                    <p className="font-serif text-lg font-medium leading-snug text-foreground">{t.titulo}</p>
                    <p className="mt-0.5 font-sans text-sm text-muted-foreground">{t.detalle}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="aparece mt-8 font-sans text-sm text-muted-foreground">
              Ha colaborado con{" "}
              {CAMILA.medios.map((m, i) => (
                <span key={m}>
                  <span className="font-medium text-foreground">{m}</span>
                  {i < CAMILA.medios.length - 2 ? ", " : i === CAMILA.medios.length - 2 ? " y " : "."}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Escritura() {
  return (
    <section id="escritura" className="scroll-mt-20 py-20 lg:py-28" aria-labelledby="h-escritura">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Encabezado num="03" titulo="Escritura" id="h-escritura" />
        <p className="aparece mt-4 max-w-2xl text-muted-foreground">
          Textos publicados en otros medios. Esta sección crece a medida que Camila los comparte.
        </p>
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {ARTICULOS.map((a) => (
            <li key={a.slug} className="aparece">
              <article className="group relative flex h-full flex-col rounded-sm border border-border bg-card p-7 shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-card">
                <p className="etiqueta text-violeta-700">
                  {a.medio}
                  {a.edicion ? ` · ${a.edicion}` : ""} · {a.anio}
                </p>
                <h3 className="mt-3 font-serif text-[clamp(1.6rem,2.4vw,2.1rem)] font-semibold leading-tight text-tinta">
                  {a.cuerpo ? (
                    <Link to="/$slug" params={{ slug: a.slug }} className="after:absolute after:inset-0">
                      {a.titulo}
                    </Link>
                  ) : (
                    a.titulo
                  )}
                </h3>
                <p className="mt-3 text-foreground/90">{a.resumen}</p>
                <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6 font-sans text-sm">
                  {a.cuerpo && (
                    <span className="inline-flex items-center gap-1.5 font-medium text-tinta transition-colors group-hover:text-violeta-700">
                      Leer aquí <ArrowDown className="size-4 -rotate-90" aria-hidden="true" />
                    </span>
                  )}
                  {a.urlExterna && (
                    <a
                      href={a.urlExterna}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-violeta-700"
                    >
                      Ver en {a.medio} <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
            </li>
          ))}
          <li className="aparece">
            <div className="flex h-full flex-col justify-between rounded-sm border border-dashed border-tinta/40 p-7">
              <div>
                <p className="etiqueta text-tinta/70">Medios y organizaciones</p>
                <ul className="mt-4 space-y-2 font-serif text-xl text-foreground">
                  {CAMILA.medios.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
              <a
                href={CAMILA.linktree}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-tinta transition-colors hover:text-violeta-700"
              >
                Más enlaces <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Brujula() {
  return (
    <section id="brujula" className="scroll-mt-20 bg-tinta py-20 text-papel lg:py-28" aria-labelledby="h-brujula">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="aparece flex items-baseline gap-4">
          <span className="font-sans text-xs font-semibold tracking-[0.2em] text-oro">04</span>
          <h2 id="h-brujula" className="font-serif text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight text-papel">
            Brújula
          </h2>
        </div>
        <p className="aparece mt-4 max-w-2xl text-papel/75">Nombres, objetos y lugares que orientan su mirada.</p>
        <dl className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {FAVORITOS.map((f) => (
            <div key={f.etiqueta} className="aparece border-t border-papel/25 pt-5">
              <dt className="etiqueta text-oro">{f.etiqueta}</dt>
              <dd className="mt-3 font-serif text-[clamp(1.4rem,2vw,1.8rem)] leading-snug text-papel">
                {f.valor.map((v, i) => (
                  <span key={v} className="block">
                    {v}
                    {i < f.valor.length - 1 ? "" : ""}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Cierre() {
  return (
    <section className="py-20 lg:py-28" aria-labelledby="h-cierre">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="aparece etiqueta text-violeta-700">Conversemos</p>
        <h2 id="h-cierre" className="aparece mt-4 font-serif text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-tight text-tinta">
          Moda, archivo y pensamiento crítico cultural
        </h2>
        <p className="aparece mt-4 text-muted-foreground">
          Para prensa, charlas, colaboraciones o saber cuándo sale el libro, el camino más corto es Instagram.
        </p>
        <div className="aparece mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={CAMILA.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 font-sans text-sm font-medium text-primary-foreground transition-colors hover:bg-tinta-700"
          >
            <Instagram className="size-4" aria-hidden="true" />
            @{CAMILA.usuario}
          </a>
          <a
            href={CAMILA.linktree}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-md border border-tinta/30 px-6 font-sans text-sm font-medium text-tinta transition-colors hover:border-violeta hover:bg-accent hover:text-violeta-700"
          >
            Todos los enlaces <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, BookOpen, Instagram, Mail } from "lucide-react";
import { EscrituraLista } from "@/components/sitio/EscrituraLista";
import { LibroFlotante, LibroHueco } from "@/components/sitio/LibroFlotante";
import { Maquina } from "@/components/sitio/Maquina";
import { CAMILA, ESCRITOS, FAVORITOS, LIBRO } from "@/lib/contenido";
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

const ALT_LIBRO = `Portada del libro ${LIBRO.titulo}, de ${CAMILA.nombre}`;

function Inicio() {
  return (
    <>
      {/* El libro 3D vive en un canvas fijo y viaja del hero a «Sobre el libro». */}
      <LibroFlotante src="/libro-desvistiendo.glb" />
      <Hero />
      <CintaLomo />
      <SobreElLibro />
      <SobreMi />
      <Escritura />
      <Brujula />
      <Cierre />
    </>
  );
}

/** Estilo inline para el orden de entrada escalonada (ver styles.css, `.escalona`). */
const orden = (i: number) => ({ "--i": i }) as React.CSSProperties;

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
          <LibroHueco
            id="hero"
            alt={ALT_LIBRO}
            fallbackSrc="/libro-portada.webp"
            className="mx-auto aspect-square w-full max-w-[min(76vw,400px)] lg:max-w-none lg:aspect-[4/5] lg:h-[min(74vh,680px)]"
          />
          <p className="mt-2 text-center font-sans text-xs text-muted-foreground lg:mt-0">
            Arrástralo para verlo por todos lados · baja para seguirlo
          </p>
        </div>

        <div className="escalona visible order-2 text-center lg:order-1 lg:text-left">
          <p
            className="inline-flex items-center gap-2 rounded-sm bg-oro px-3 py-1 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-tinta-900"
            style={orden(0)}
          >
            <BookOpen className="size-3.5" aria-hidden="true" />
            Libro · {LIBRO.estado}
          </p>
          <h1
            id="titulo-libro"
            className="mt-5 font-serif text-[clamp(2.9rem,7vw,5.6rem)] font-bold leading-[0.98] text-tinta"
            style={orden(1)}
          >
            Desvistiendo
            <br />
            otros estilos
          </h1>
          <p
            className="mx-auto mt-5 max-w-[32ch] border-l-0 font-serif text-[clamp(1.2rem,2vw,1.6rem)] leading-snug text-foreground lg:mx-0 lg:border-l-[3px] lg:border-tinta lg:pl-4"
            style={orden(2)}
          >
            {LIBRO.subtitulo}
          </p>
          <p className="mt-5 font-sans text-sm text-muted-foreground" style={orden(3)}>
            <span className="font-semibold text-tinta">Camila Andrea</span> Rua Tovio · {LIBRO.editorial}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start" style={orden(4)}>
            <a
              href="#libro"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-violeta px-6 font-sans text-sm font-medium text-hoja shadow-soft transition-colors hover:bg-violeta-700"
            >
              Leer la sinopsis
              <ArrowDown className="size-4" aria-hidden="true" />
            </a>
            <a
              href={CAMILA.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-violeta/20 bg-hoja px-6 font-sans text-sm font-medium text-violeta shadow-soft transition-colors hover:border-violeta hover:bg-violeta-50"
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
      <div className="lomo-marquee flex w-max whitespace-nowrap font-serif text-sm tracking-[0.2em]">
        <span>{repetida}</span>
        <span>{repetida}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const TONOS = {
  tinta: { num: "text-oro-600", titulo: "text-tinta" },
  claro: { num: "text-oro", titulo: "text-hoja" },
};

function Encabezado({ num, titulo: t, id, tono = "tinta" }: { num: string; titulo: string; id?: string; tono?: keyof typeof TONOS }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className={`aparece font-sans text-xs font-semibold tracking-[0.2em] ${TONOS[tono].num}`}>{num}</span>
      <h2 id={id} className={`aparece-titulo font-serif text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight ${TONOS[tono].titulo}`}>
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
          {/* Segundo hueco del libro: aquí aterriza al bajar desde el hero. En
              móvil va antes del texto; en escritorio, a la derecha y pegajoso
              mientras se lee la sinopsis. `data-ancla` marca la posición natural. */}
          <div className="order-first lg:order-last" data-ancla>
            <LibroHueco
              id="libro"
              alt={ALT_LIBRO}
              fallbackSrc="/libro-portada.webp"
              className="mx-auto aspect-[4/5] w-full max-w-[280px] lg:sticky lg:top-24 lg:max-w-[490px]"
            />
          </div>

          <div>
            <div className="aparece prosa">
              <p className="capitular">{LIBRO.sinopsis[0]}</p>
              <p>{LIBRO.sinopsis[1]}</p>
            </div>
            <dl className="escalona mt-10 grid gap-x-8 gap-y-5 border-t border-border pt-8 font-sans text-sm sm:grid-cols-2">
              <div style={orden(0)}>
                <dt className="etiqueta text-tinta/70">Editorial</dt>
                <dd className="mt-1 font-serif text-lg text-foreground">{LIBRO.editorial}</dd>
              </div>
              <div style={orden(1)}>
                <dt className="etiqueta text-tinta/70">Con el apoyo de</dt>
                <dd className="mt-1 font-serif text-lg text-foreground">{LIBRO.apoyo}</dd>
              </div>
              <div className="sm:col-span-2" style={orden(2)}>
                <dt className="sr-only">Temas</dt>
                <dd>
                  <ul className="flex flex-wrap gap-2">
                    {LIBRO.temas.map((t) => (
                      <li key={t} className="rounded-sm bg-accent px-2.5 py-1 font-sans text-xs font-medium text-accent-foreground">
                        {t}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function SobreMi() {
  return (
    <section id="sobre-mi" className="scroll-mt-20 bg-papel-2/50 py-20 lg:py-28" aria-labelledby="h-sobre-mi">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Encabezado num="02" titulo="Sobre mí" id="h-sobre-mi" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-16">
          <figure className="relative mx-auto w-full max-w-sm self-start lg:sticky lg:top-24 lg:max-w-none">
            <div className="aparece absolute -inset-3 rounded-sm bg-violeta-100" aria-hidden="true" />
            <div className="aparece absolute -inset-3 translate-x-3 translate-y-3 rounded-sm border border-dashed border-tinta/40" aria-hidden="true" />
            <div className="aparece-foto relative overflow-hidden rounded-sm shadow-card">
              <img
                src="/camila.webp"
                alt={`Retrato de ${CAMILA.nombre}`}
                width={900}
                height={1350}
                loading="lazy"
                decoding="async"
                className="aspect-[2/3] w-full object-cover"
              />
            </div>
            <figcaption className="aparece relative mt-5 font-sans text-xs text-muted-foreground">
              {CAMILA.lema}. Aprender y escuchar.
            </figcaption>
          </figure>

          <div>
            <div className="escalona prosa">
              <p className="font-serif text-[clamp(1.4rem,2.4vw,2rem)] font-medium leading-snug text-tinta" style={orden(0)}>
                Soy {CAMILA.nombre}, {CAMILA.rol.toLowerCase()}.
              </p>
              <p className="mt-5" style={orden(1)}>
                {CAMILA.presentacion[0].replace(/^Soy periodista e investigadora de las modas y el vestir\. /, "")}
              </p>
              <p style={orden(2)}>{CAMILA.presentacion[1]}</p>
            </div>

            <ol className="escalona mt-10 grid gap-x-8 gap-y-5 border-t border-border pt-8 sm:grid-cols-2">
              {CAMILA.trayectoria.map((t, i) => (
                <li key={t.titulo} className="flex gap-3" style={orden(i)}>
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-oro-600" aria-hidden="true" />
                  <div>
                    <p className="font-serif text-lg font-medium leading-snug text-foreground">{t.titulo}</p>
                    <p className="mt-0.5 font-sans text-sm text-muted-foreground">{t.detalle}</p>
                  </div>
                </li>
              ))}
            </ol>

            <Facteda />

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
    <section id="escritura" className="scroll-mt-20 bg-hoja py-20 text-violeta lg:py-28" aria-labelledby="h-escritura">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline gap-4">
          <span className="aparece font-sans text-xs font-semibold tracking-[0.2em] text-violeta/60">03</span>
          <h2 id="h-escritura" className="font-serif text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-tight text-violeta">
            <Maquina texto="Escritura" />
          </h2>
        </div>
        <p className="aparece mt-4 max-w-2xl text-violeta-900/70">
          Textos publicados en revistas y medios digitales sobre moda, vestir, trabajo y sostenibilidad. Pasa el cursor por
          cada uno para ver su imagen.
        </p>

        <div className="aparece mt-12">
          <EscrituraLista escritos={ESCRITOS} />
        </div>

        <div className="aparece mt-10 flex flex-wrap items-center justify-between gap-4 font-sans text-sm text-violeta-900/70">
          <p>
            También en{" "}
            {CAMILA.medios.map((m, i) => (
              <span key={m}>
                <span className="font-medium text-violeta">{m}</span>
                {i < CAMILA.medios.length - 2 ? ", " : i === CAMILA.medios.length - 2 ? " y " : "."}
              </span>
            ))}
          </p>
          <a
            href={CAMILA.linktree}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-violeta transition-colors hover:text-violeta-700"
          >
            Todos los enlaces <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

/** Factedá: su proyecto de divulgación, con la flor de su Linktree. */
function Facteda() {
  const f = CAMILA.facteda;
  return (
    <div className="aparece mt-10 flex items-center gap-5 rounded-sm bg-violeta p-5 text-hoja sm:p-6">
      <img src="/flor.webp" alt="" width={240} height={240} loading="lazy" decoding="async" className="size-16 shrink-0 sm:size-20" />
      <div className="min-w-0">
        <p className="font-serif text-xl font-semibold">{f.nombre} por Camila Rua</p>
        <p className="mt-0.5 font-sans text-sm text-hoja/80">{f.lema}.</p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-sans text-sm font-medium">
          <li>
            <a href={f.instagram} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
              Instagram
            </a>
          </li>
          <li>
            <a href={f.tiktok} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
              TikTok
            </a>
          </li>
          <li>
            <a href={f.pinterest} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
              Pinterest
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Brujula() {
  return (
    <section id="brujula" className="scroll-mt-20 bg-violeta py-20 text-hoja lg:py-28" aria-labelledby="h-brujula">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Encabezado num="04" titulo="Brújula" id="h-brujula" tono="claro" />
        <p className="aparece mt-4 max-w-2xl text-hoja/75">Nombres, objetos y lugares que orientan su mirada.</p>
        <dl className="escalona mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {FAVORITOS.map((f, i) => (
            <div key={f.etiqueta} className="border-t border-hoja/25 pt-5" style={orden(i)}>
              <dt className="etiqueta text-oro">{f.etiqueta}</dt>
              <dd className="mt-3 font-serif text-[clamp(1.4rem,2vw,1.8rem)] leading-snug text-hoja">
                {f.valor.map((v) => (
                  <span key={v} className="block">
                    {v}
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
        <h2 id="h-cierre" className="aparece-titulo mt-4 font-serif text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-tight text-tinta">
          Moda, archivo y pensamiento crítico cultural
        </h2>
        <p className="aparece mt-4 text-muted-foreground">
          Para prensa, charlas, colaboraciones o saber cuándo sale el libro, escríbele por correo o por Instagram.
        </p>
        <div className="aparece mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={`mailto:${CAMILA.correo}`}
            className="inline-flex h-12 items-center gap-2 rounded-md bg-violeta px-6 font-sans text-sm font-medium text-hoja transition-colors hover:bg-violeta-700"
          >
            <Mail className="size-4" aria-hidden="true" />
            {CAMILA.correo}
          </a>
          <a
            href={CAMILA.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-md border border-violeta/20 bg-hoja px-6 font-sans text-sm font-medium text-violeta shadow-soft transition-colors hover:border-violeta hover:bg-violeta-50"
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

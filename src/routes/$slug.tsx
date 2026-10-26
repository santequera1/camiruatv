import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ARTICULOS, buscarArticulo, CAMILA } from "@/lib/contenido";
import { metaPagina, titulo } from "@/lib/seo";

export const Route = createFileRoute("/$slug")({
  loader: ({ params }) => {
    const articulo = buscarArticulo(params.slug);
    if (!articulo || !articulo.cuerpo) throw notFound();
    return { articulo };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? metaPagina({
          titulo: titulo(loaderData.articulo.titulo),
          descripcion: loaderData.articulo.resumen,
          ruta: `/${loaderData.articulo.slug}`,
          tipo: "article",
        })
      : [],
  }),
  component: PaginaArticulo,
});

function PaginaArticulo() {
  const { articulo } = Route.useLoaderData();
  const otros = ARTICULOS.filter((a) => a.slug !== articulo.slug && a.cuerpo);

  return (
    <article className="pb-10">
      <header className="relative overflow-hidden border-b border-border bg-papel-2/50">
        <div className="mx-auto max-w-3xl px-4 pb-14 pt-10 sm:px-6 lg:pt-16">
          <Link
            to="/"
            hash="escritura"
            className="inline-flex items-center gap-1.5 font-sans text-sm text-muted-foreground transition-colors hover:text-violeta-700"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Volver
          </Link>
          <p className="mt-8 etiqueta text-violeta-700">
            {articulo.medio}
            {articulo.edicion ? ` · ${articulo.edicion}` : ""} · {articulo.anio}
          </p>
          <h1 className="mt-4 font-serif text-[clamp(2.4rem,6vw,4.4rem)] font-bold leading-[1.02] text-tinta">
            {articulo.titulo}
          </h1>
          <p className="mt-5 font-serif text-xl text-foreground/90">{articulo.resumen}</p>
          <p className="mt-6 font-sans text-sm text-muted-foreground">
            Por <span className="font-medium text-foreground">{CAMILA.nombre}</span>
            {articulo.creditos ? ` · ${articulo.creditos}` : ""}
          </p>
        </div>
      </header>

      <div className="prosa mx-auto max-w-3xl px-4 pt-12 sm:px-6">
        {articulo.cuerpo!.map((p, i) =>
          p.startsWith("> ") ? (
            <blockquote key={i}>{p.slice(2)}</blockquote>
          ) : (
            <p key={i} className={i === 0 ? "capitular" : undefined}>
              {p}
            </p>
          ),
        )}
        {articulo.nota && <p className="nota">{articulo.nota}</p>}

        {articulo.urlExterna && (
          <p className="mt-10 rounded-sm border border-dashed border-tinta/40 p-5 font-sans text-sm text-muted-foreground">
            Publicado originalmente en {articulo.medio}
            {articulo.edicion ? `, ${articulo.edicion}` : ""}.{" "}
            <a href={articulo.urlExterna} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium">
              Ver la edición completa <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </p>
        )}
      </div>

      {otros.length > 0 && (
        <aside className="mx-auto mt-16 max-w-3xl px-4 sm:px-6">
          <p className="etiqueta text-tinta/70">Más textos</p>
          <ul className="mt-4 space-y-3">
            {otros.map((a) => (
              <li key={a.slug}>
                <Link to="/$slug" params={{ slug: a.slug }} className="font-serif text-xl text-tinta hover:text-violeta-700">
                  {a.titulo}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  );
}

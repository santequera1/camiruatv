import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Lanzamiento } from "@/components/sitio/Lanzamiento";
import { CAMILA, LANZAMIENTO as L, LIBRO } from "@/lib/contenido";
import { metaPagina, SITE_URL, titulo } from "@/lib/seo";

/**
 * Página propia de la invitación, para compartir el enlace directo
 * (camiruatv.com/lanzamiento) por WhatsApp e Instagram. Lleva la pieza
 * promocional como imagen de vista previa y datos de evento para Google.
 */
export const Route = createFileRoute("/lanzamiento")({
  head: () => ({
    meta: metaPagina({
      titulo: titulo("Lanzamiento del libro · 13 de noviembre"),
      descripcion: `Lanzamiento virtual de «${LIBRO.titulo}», de ${CAMILA.nombre}. ${L.fechaTexto}, ${L.horaTexto} (hora de Colombia), por Google Meet. Entrada libre.`,
      ruta: "/lanzamiento",
      imagen: `${SITE_URL}${L.poster}`,
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Event",
          name: L.nombreEvento,
          startDate: L.inicio,
          endDate: L.fin,
          eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          location: { "@type": "VirtualLocation", url: L.enlace },
          image: `${SITE_URL}${L.poster}`,
          description: L.invitacion.join(" "),
          organizer: { "@type": "Person", name: CAMILA.nombre, url: SITE_URL },
          performer: [
            { "@type": "Person", name: CAMILA.nombre },
            { "@type": "Person", name: L.invitada },
          ],
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "COP", url: `${SITE_URL}/lanzamiento`, availability: "https://schema.org/InStock" },
        }),
      },
    ],
  }),
  component: PaginaLanzamiento,
});

function PaginaLanzamiento() {
  return (
    <article className="bg-hoja pb-20">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-1.5 font-sans text-sm text-muted-foreground transition-colors hover:text-violeta-700">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver al inicio
        </Link>
        <p className="mt-8 font-serif text-lg text-muted-foreground">
          {LIBRO.titulo}. {LIBRO.subtitulo}
        </p>
        <Lanzamiento completa className="mt-6" />
        <p className="mt-14 border-t border-border pt-6 font-sans text-xs text-muted-foreground">
          {LIBRO.editorial} · con el apoyo del {LIBRO.apoyo}.
        </p>
      </div>
    </article>
  );
}

export const SITE_NAME = "Camila Rua Tovio";
export const SITE_URL = "https://camiruatv.com";
export const OG_IMAGE = `${SITE_URL}/og-libro.jpg`;

export function titulo(pagina?: string): string {
  return pagina
    ? `${pagina} · ${SITE_NAME}`
    : `${SITE_NAME} · Periodista e investigadora de las modas y el vestir`;
}

/** Meta tags de una página: title, description y Open Graph. */
export function metaPagina(opts: {
  titulo: string;
  descripcion: string;
  ruta: string;
  tipo?: "website" | "article";
  imagen?: string;
}) {
  const url = `${SITE_URL}${opts.ruta}`;
  const imagen = opts.imagen ?? OG_IMAGE;
  return [
    { title: opts.titulo },
    { name: "description", content: opts.descripcion },
    { property: "og:type", content: opts.tipo ?? "website" },
    { property: "og:url", content: url },
    { property: "og:title", content: opts.titulo },
    { property: "og:description", content: opts.descripcion },
    { property: "og:image", content: imagen },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: opts.titulo },
    { name: "twitter:description", content: opts.descripcion },
    { name: "twitter:image", content: imagen },
  ];
}

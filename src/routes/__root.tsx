import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteHeader } from "@/components/sitio/SiteHeader";
import { SiteFooter } from "@/components/sitio/SiteFooter";
import { Aparecer } from "@/components/sitio/Aparecer";
import { CAMILA } from "@/lib/contenido";
import { OG_IMAGE, SITE_NAME, SITE_URL, titulo } from "@/lib/seo";

import appCss from "../styles.css?url";

const DESCRIPCION = `${CAMILA.nombre}: ${CAMILA.rol.toLowerCase()}. Autora de «Desvistiendo otros estilos», sobre género, hipismo, moda y vestir en Medellín (1967–1975).`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <p className="font-serif text-7xl font-semibold text-tinta">404</p>
        <h1 className="mt-6 text-2xl font-semibold">Esta página no existe</h1>
        <p className="mt-2 text-muted-foreground">Puede que el enlace tenga un error o que el texto ya no esté aquí.</p>
        <Link
          to="/"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 font-sans text-sm font-medium text-primary-foreground transition-colors hover:bg-tinta-700"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#f3ecd9" },
      { title: titulo() },
      { name: "description", content: DESCRIPCION },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "es_CO" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:title", content: titulo() },
      { property: "og:description", content: DESCRIPCION },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@400;500;600&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "canonical", href: `${SITE_URL}/` },
    ],
    // Marca que hay JS antes de pintar: así `.aparece` solo se oculta cuando
    // de verdad va a aparecer (ver styles.css).
    scripts: [{ children: "document.documentElement.classList.add('js')" }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 5_000, retry: 1 } } }));

  return (
    <QueryClientProvider client={client}>
      <TooltipProvider delayDuration={300} skipDelayDuration={150}>
        <a
          href="#contenido"
          className="sr-only z-50 rounded-md bg-oro px-4 py-2 font-sans font-medium text-tinta-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Saltar al contenido
        </a>
        <SiteHeader />
        <main id="contenido">
          <Outlet />
        </main>
        <SiteFooter />
        <Aparecer />
      </TooltipProvider>
      <Toaster position="bottom-center" toastOptions={{ className: "font-sans" }} />
    </QueryClientProvider>
  );
}

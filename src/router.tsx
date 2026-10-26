import { createRouter, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { routeTree } from "./routeTree.gen";

function DefaultErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    console.error("[boundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold text-tinta">Algo salió mal</h1>
        <p className="mt-2 text-muted-foreground">Prueba de nuevo. Si sigue igual, vuelve al inicio.</p>
        {error?.message && (
          <pre className="mt-4 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-md bg-muted p-3 text-left font-mono text-[11px] text-destructive">
            {error.name}: {error.message}
          </pre>
        )}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 font-sans text-sm font-medium text-primary-foreground transition-colors hover:bg-tinta-700"
          >
            Reintentar
          </button>
          <a
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-card px-5 font-sans text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Ir al inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export const getRouter = () => {
  // Tras cada deploy los chunks cambian de nombre. Un navegador con el HTML
  // viejo en caché pide chunks que ya no existen: recargamos UNA vez.
  if (typeof window !== "undefined") {
    const KEY = "crt.reload-after-preload-error";
    window.addEventListener("vite:preloadError", (event) => {
      try {
        if (sessionStorage.getItem(KEY) === "1") return;
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* noop */
      }
      event.preventDefault();
      window.location.reload();
    });
    window.addEventListener("load", () => {
      try {
        sessionStorage.removeItem(KEY);
      } catch {
        /* noop */
      }
    });
  }

  return createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent,
  });
};

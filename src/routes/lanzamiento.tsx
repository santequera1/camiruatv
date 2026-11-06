import { createFileRoute, redirect } from "@tanstack/react-router";

/** El enlace corto para compartir (camiruatv.com/lanzamiento) lleva a la
 *  sección de la invitación en el inicio. */
export const Route = createFileRoute("/lanzamiento")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "lanzamiento" });
  },
});

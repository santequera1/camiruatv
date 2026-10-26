import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

// Plugins declarados a mano (sin @lovable.dev/vite-tanstack-config), en el
// mismo orden que en Cosas a la Venta.
export default defineConfig({
  server: { port: 3000 },
  resolve: {
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  plugins: [tailwindcss(), tsConfigPaths({ projects: ["./tsconfig.json"] }), tanstackStart(), viteReact()],
});

import { fileURLToPath } from "node:url";
import { serve } from "srvx/node";
import { serveStatic } from "srvx/static";
import server from "./dist/server/server.js";

const PORT = Number(process.env.PORT ?? 3242);
const HOST = process.env.HOST ?? "127.0.0.1";

// En producción nginx sirve dist/client (/assets, el .glb, las imágenes).
// Para probar el build en local (`npm start`) los sirve este mismo proceso.
const middleware =
  process.env.NODE_ENV === "production"
    ? []
    : [serveStatic({ dir: fileURLToPath(new URL("./dist/client", import.meta.url)) })];

serve({ fetch: server.fetch, middleware, port: PORT, hostname: HOST });

console.log(`[camiruatv-ssr] http://${HOST}:${PORT}`);

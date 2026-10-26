# camiruatv.com

Portafolio de Camila Andrea Rua Tovio, periodista e investigadora de las modas y el vestir. El centro del
sitio es su libro *Desvistiendo otros estilos*, que se muestra en 3D en la portada.

## Cómo está hecho

- **TanStack Start** (SSR) con React 19, Vite 7 y TypeScript. Rutas por archivo en `src/routes/`.
- **Tailwind CSS v4** con los tokens de marca en `src/styles.css` (crema, tinta, oro y violeta, sacados de
  la cubierta del libro). Componentes shadcn/ui en `src/components/ui/`.
- **three.js** para el libro (`src/lib/libro-3d.ts`), importado solo en el navegador desde
  `src/components/sitio/LibroFlotante.tsx`: un canvas fijo a pantalla completa dibuja el libro sobre los
  huecos de la página y lo hace viajar del hero a «Sobre el libro» con el scroll. Si WebGL falla se
  muestra `public/libro-portada.webp`.
- El contenido (bio, libro, artículos, favoritos) vive en `src/lib/contenido.ts`.

## Desarrollo

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run build && npm start   # prueba del build SSR en http://127.0.0.1:3242
```

## Imágenes derivadas

`public/libro-portada.webp`, `public/camila.webp`, `public/og-libro.jpg` y `public/apple-touch-icon.png`
se generaron con `sharp` a partir de `contenido/` (carpeta local, fuera de git). El modelo
`public/libro-desvistiendo.glb` es el export de `contenido/3d/libro_desvistiendo.blend`.

## Despliegue

`python deploy.py` después de hacer push a `main`: entra por SSH al VPS, trae el código, instala, construye
y reinicia el proceso PM2 `camiruatv`. nginx (`nginx/camiruatv.com.conf`) sirve `dist/client` y pasa el
resto al SSR en el puerto 3242. Detalle en `docs/SERVIDOR.md`.

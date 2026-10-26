# camiruatv.com — portafolio de Camila Rua Tovio

Contexto permanente del proyecto para Claude Code. Léelo completo al empezar.
Los secretos (acceso SSH, contraseñas) NO van aquí: están en `CLAUDE.local.md` (no se commitea).

## Qué es

- Portafolio de **Camila Andrea Rua Tovio**, periodista e investigadora de las modas y el vestir,
  magíster en Sociología (Universidad de Antioquia). Lo construye Stiven Antequera. Comunicación en español.
- **El gancho es el libro**: `Desvistiendo otros estilos. Performatividades de género, hipismo, moda y
  vestir en Medellín (1967–1975)` (Fondo Editorial Remington, con estímulo del Ministerio de las Culturas).
  Se muestra en 3D (three.js, modelo `public/libro-desvistiendo.glb`): un canvas transparente fijo a
  pantalla completa (`LibroFlotante`) dibuja el libro sobre dos huecos del DOM (`LibroHueco` en el hero y
  en «Sobre el libro»). En escritorio el libro flota mientras el hero pasa por debajo, da una vuelta y
  aterriza en el segundo hueco (pegajoso); en móvil se va con el hero y vuelve a caer desde arriba al
  llegar a la sección. Se arrastra desde cualquiera de los huecos. Detalle en `src/lib/libro-3d.ts`.
- Estado al 26 oct 2026: página de inicio (hero 3D, libro flotante, sinopsis, bio, escritura, brújula, cierre) y una
  página por artículo (`/$slug`). Sin API ni CMS: **todo el contenido vive en `src/lib/contenido.ts`**.
  Publicado en https://camiruatv.com. Repo privado: `santequera1/camiruatv`.

## Escritura (sección 03)

Lista con imagen flotante al pasar el mouse (`EscrituraLista.tsx`, framer-motion), portada de
`psicomorfosis/docs/hover-image-links-guide.md`. Los textos están en `ESCRITOS` de `contenido.ts`
(el de Sofoco con página propia y 10 externos sacados del Linktree de Camila). Las imágenes viven en
`public/escritura/`: las de los medios salen de la imagen destacada de cada artículo (API de WordPress
de cada sitio) y la de Sofoco es la página 243 del PDF de la revista. El título se escribe solo
(`Maquina.tsx`). En táctil, cada fila muestra su miniatura fija.

## Material de origen (`contenido/`, solo local, ignorado por git)

| Qué | Dónde |
|---|---|
| Modelo 3D y demo original | `contenido/3d/` (`.blend`, `.glb`, `libro-3d.js`, renders) |
| Cubierta completa del libro (contraportada, lomo, portada, solapa con bio) | `contenido/Mesa de trabajo 1-100.jpg`, `portada-01-01.jpg` |
| Foto de Camila | `contenido/foto-camila.jpg` |
| Revista Sofoco ed. 02 (artículo de Camila en pp. 243–257) | `contenido/[Español] Sofoco Revista Edición 02.pdf` |
| Datos sueltos (bio, redes, favoritos) | `info.md` |

Los derivados para la web están en `public/` (`libro-portada.webp`, `camila.webp`, `og-libro.jpg`, íconos);
se generaron con `sharp` (ver README). Si cambia una fuente, se regeneran.

## Identidad visual (tokens en `src/styles.css`)

Sale de la cubierta del libro, **sin el patrón de ondas** (Stiven no lo quiere), más el violeta de Camila:

| Token | Valor | Uso |
|---|---|---|
| `papel` | `#f3ecd9` | crema de la cubierta: **solo** en «Sobre el libro». El resto del sitio es blanco (`hoja`) y «Sobre mí» lila muy claro (`violeta-50`) |
| `tinta` | `#1f5a6b` | títulos, lomo, botones, sección Brújula |
| `oro` | `#f2b84b` | etiqueta del libro, acentos, numeración de secciones |
| `violeta` | `#590186` (el morado de Factedá, su Linktree) | Brújula y menú en morado con texto blanco; Escritura en blanco (`hoja`) con texto morado; acentos |

Tipografía: **EB Garamond** (títulos y lectura) + **DM Sans** (etiquetas, UI). Adornos: marco de doble
línea punteada (`marco-punteado`), capitular (`capitular`), cinta del lomo. Nunca colores sueltos en
componentes: siempre los tokens.

## Stack

Igual que Cosas a la Venta (`C:\Users\STIVEN ANTEQUERA\Desktop\gitproyectos\cosasalaventa`): TanStack Start
(SSR) + React 19 + Vite 7 + TypeScript estricto, alias `@/` → `src/`. Rutas por archivo en `src/routes/`;
datos en el `loader`, SEO en `head()`. Tailwind v4 con tokens en `@theme`, shadcn/Radix (`src/components/ui/`),
lucide, sonner, vaul, embla, react-hook-form + zod. `three` solo se importa en el navegador
(`src/lib/libro-3d.ts`, cargado con `import()` desde `LibroFlotante.tsx`). Menú a pantalla completa
con telón y entradas escalonadas (`SiteHeader.tsx`); animaciones de entrada por clase (`.aparece`,
`.aparece-titulo`, `.aparece-foto`, `.escalona`) activadas por `Aparecer.tsx`. Versiones `@tanstack/*` exactas.
Solo npm, `package-lock.json` en el repo. Sin Lovable ni Cloudflare. Producción: `srvx` (`server.mjs`)
detrás de nginx, con PM2.

## Comandos

```bash
npm install            # dependencias
npm run dev            # http://localhost:3000
npm run typecheck
npm run build && npm start   # build SSR en http://127.0.0.1:3242
python deploy.py       # desplegar (después de commit + push a main)
```

## Reglas

1. `git add` dirigido por archivo, jamás `git add -A`. Nada de `contenido/` ni secretos en git.
2. Contenido nuevo (artículos, bio, favoritos) se agrega en `src/lib/contenido.ts`; un artículo con `cuerpo`
   gana página propia en `/$slug`.
3. Verificar en el navegador (build + `npm start`) antes de desplegar, sobre todo el hero 3D.
4. El VPS es compartido con ~30 proyectos: solo tocar el proceso PM2 `camiruatv` y el sitio nginx `camiruatv.com`.

## Servidor (detalle en `docs/SERVIDOR.md`)

VPS OVH `51.195.109.26`, usuario `ubuntu`. App en `/home/ubuntu/apps/camiruatv/`, SSR en `127.0.0.1:3242`,
PM2 `camiruatv`, nginx `camiruatv.com` con certificado de Let's Encrypt. DNS: `@` y `www` apuntan al VPS.

## Pendiente con Camila / Stiven

- Fecha de lanzamiento y enlace de compra o preventa del libro (hoy el hero dice «Próximamente»).
- Textos de El Bolivarense y el fanzine digital (está en su Linktree, sin imagen) si se quieren en Escritura.
- Correo de contacto, si quiere uno público además de Instagram.
- Confirmar si el texto completo del artículo de Sofoco puede vivir en el sitio o solo el enlace.

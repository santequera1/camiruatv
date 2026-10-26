# Servidor

VPS OVH compartido (`51.195.109.26`, usuario `ubuntu`), el mismo de Cosas a la Venta y Psicomorfosis.
Corren ~30 proyectos más: no tocar procesos PM2, sitios nginx ni crons ajenos.

| | |
|---|---|
| App | `/home/ubuntu/apps/camiruatv/` (clon del repo por la llave `~/.ssh/camiruatv_deploy`, alias `github-camiruatv`) |
| SSR | `srvx` en `127.0.0.1:3242`, proceso PM2 `camiruatv` (`ecosystem.config.cjs`) |
| nginx | `/etc/nginx/sites-available/camiruatv.com` (copia de `nginx/camiruatv.com.conf` + bloques de certbot) |
| TLS | Let's Encrypt con certbot (renovación automática). `www` y HTTP redirigen a `https://camiruatv.com` |
| DNS | `camiruatv.com` y `www` → `51.195.109.26` |
| Chunks viejos | `~/apps/camiruatv-assets-keep/` guarda los `assets/` de builds anteriores 14 días |

## Deploy

```bash
git push origin main
python deploy.py
```

El script hace `git reset --hard origin/main`, `npm ci`, comprueba que haya una sola versión de
TanStack Router, `npm run build`, reinicia `camiruatv` en PM2 y verifica `https://camiruatv.com/`
y el `.glb`.

## Puesta en marcha (ya hecha el 26 oct 2026)

1. Llave de despliegue en el VPS: `ssh-keygen -t ed25519 -f ~/.ssh/camiruatv_deploy` y alias en `~/.ssh/config`;
   la pública se registró en el repo como deploy key de solo lectura.
2. `git clone github-camiruatv:santequera1/camiruatv.git ~/apps/camiruatv`.
3. `npm ci && npm run build && pm2 start ecosystem.config.cjs --only camiruatv && pm2 save`.
4. nginx: copiar `nginx/camiruatv.com.conf` a `sites-available`, enlazar en `sites-enabled`, `nginx -t`, recargar.
5. `sudo certbot --nginx -d camiruatv.com -d www.camiruatv.com --redirect`; luego dentro del bloque 443
   agregar `http2 on;` y la redirección de `www`.

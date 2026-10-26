"""Deploy de camiruatv.com al VPS (docs/SERVIDOR.md).

Antes: commit + push a main. Uso: python deploy.py

Entra con la llave SSH de este PC, por eso no lleva contraseña. VPS_HOST y
VPS_USER se pueden cambiar en .env.deploy (no se commitea).
"""
import subprocess
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")


def leer_env(ruta: Path) -> dict:
    datos = {}
    if ruta.exists():
        for linea in ruta.read_text(encoding="utf-8").splitlines():
            if "=" in linea and not linea.lstrip().startswith("#"):
                k, v = linea.split("=", 1)
                datos[k.strip()] = v.strip()
    return datos


ENV = leer_env(Path(__file__).with_name(".env.deploy"))
HOST = ENV.get("VPS_HOST", "51.195.109.26")
USER = ENV.get("VPS_USER", "ubuntu")
APP = "~/apps/camiruatv"
KEEP = "~/apps/camiruatv-assets-keep"
SITE = "https://camiruatv.com"
PM2 = "camiruatv"
CD = f"cd {APP} && "


def run(cmd: str, allow_fail: bool = False, timeout: int = 600) -> int:
    print(f"\n$ {cmd}", flush=True)
    r = subprocess.run(["ssh", "-o", "BatchMode=yes", f"{USER}@{HOST}", cmd], timeout=timeout)
    if r.returncode != 0 and not allow_fail:
        print(f"\n[FATAL] Código {r.returncode}, se detiene el deploy.")
        sys.exit(1)
    return r.returncode


def main():
    print("=== 1. Código de main ===")
    run(CD + "git fetch origin && git reset --hard origin/main && git log -1 --oneline")

    print("\n=== 2. Dependencias ===")
    run(CD + "npm ci --no-audit --no-fund")

    # Una sola versión de react-router y de router-core, o no se despliega.
    run(
        CD + "n=$(npm ls @tanstack/react-router @tanstack/router-core --all 2>/dev/null "
        "| grep -oE '@tanstack/(react-router|router-core)@[0-9.]+' | sort -u | wc -l); "
        'echo "versiones de TanStack Router: $n"; test "$n" -eq 2'
    )

    print("\n=== 3. Build (conservando los chunks anteriores 14 días) ===")
    run(f"mkdir -p {KEEP} && cp -n {APP}/dist/client/assets/* {KEEP}/ 2>/dev/null; true")
    run(CD + "npm run build")
    run(f"find {KEEP} -type f -mtime +14 -delete; cp -n {KEEP}/* {APP}/dist/client/assets/ 2>/dev/null; true")

    print("\n=== 4. PM2 (solo el proceso de este sitio) ===")
    run(
        CD + f"if pm2 describe {PM2} >/dev/null 2>&1; then "
        f"pm2 restart {PM2} --update-env >/dev/null && echo 'Reiniciado {PM2}'; "
        f"else pm2 start ecosystem.config.cjs --only {PM2} >/dev/null && echo 'Arrancado {PM2}'; fi"
    )
    run(f"pm2 save >/dev/null && pm2 ls | grep -E '{PM2}|name'")

    print("\n=== 5. Verificación ===")
    run("sleep 2")
    ok = run(f"curl -sf -o /dev/null -w 'inicio %{{http_code}}\\n' {SITE}/", allow_fail=True) == 0
    ok = run(f"curl -sf -o /dev/null -w 'glb %{{http_code}}\\n' {SITE}/libro-desvistiendo.glb", allow_fail=True) == 0 and ok
    if not ok:
        run(f"pm2 logs {PM2} --lines 60 --nostream", allow_fail=True)
        print("\n[FATAL] La verificación falló.")
        sys.exit(1)

    print("\n[OK] Deploy completo.")


if __name__ == "__main__":
    main()

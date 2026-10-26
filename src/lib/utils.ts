import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parsea una fecha del backend:
 *   - ISO con Z u offset → se respeta la zona del string
 *   - ISO sin Z (SQLite `CURRENT_TIMESTAMP` → "2026-05-09 02:50:00") → se asume UTC
 *   - undefined/null → null
 */
export function parseBackendDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  if (/[zZ]|[+-]\d{2}:?\d{2}$/.test(iso)) return new Date(iso);
  const normalized = iso.includes(" ") ? iso.replace(" ", "T") : iso;
  return new Date(normalized + "Z");
}

/** Fecha y hora del backend en hora de Colombia. */
export function formatDateTimeCO(
  iso: string | null | undefined,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short" },
): string {
  const d = parseBackendDate(iso);
  if (!d) return "—";
  try {
    return d.toLocaleString("es-CO", { timeZone: "America/Bogota", ...options });
  } catch {
    return d.toString();
  }
}

/** Solo la fecha, en hora de Colombia. */
export function formatDateCO(
  iso: string | null | undefined,
  options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" },
): string {
  const d = parseBackendDate(iso);
  if (!d) return "—";
  try {
    return d.toLocaleDateString("es-CO", { timeZone: "America/Bogota", ...options });
  } catch {
    return d.toString();
  }
}

/** Minúsculas y sin tildes, para comparar textos de búsqueda. */
export function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

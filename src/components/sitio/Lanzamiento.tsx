import { useEffect, useState } from "react";
import { CalendarPlus, Check, Copy, ExternalLink, Video } from "lucide-react";
import { CAMILA, LANZAMIENTO as L } from "@/lib/contenido";
import { cn } from "@/lib/utils";

/** Estado del evento según la hora actual. Se calcula en el navegador
 *  (en el servidor se asume «antes») para no arriesgar la hidratación. */
export type EstadoEvento = "antes" | "en-curso" | "despues";

export function useEstadoEvento(): EstadoEvento {
  const [estado, setEstado] = useState<EstadoEvento>("antes");
  useEffect(() => {
    const calc = () => {
      const ahora = Date.now();
      const inicio = new Date(L.inicio).getTime();
      const fin = new Date(L.fin).getTime();
      // «En curso» desde 15 minutos antes, para que el enlace ya esté a mano.
      setEstado(ahora > fin ? "despues" : ahora > inicio - 15 * 60_000 ? "en-curso" : "antes");
    };
    calc();
    const t = window.setInterval(calc, 60_000);
    return () => window.clearInterval(t);
  }, []);
  return estado;
}

/** Enlace a Google Calendar con el evento ya diligenciado. */
function enlaceGoogleCalendar() {
  const utc = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: L.nombreEvento,
    dates: `${utc(L.inicio)}/${utc(L.fin)}`,
    details: `${L.invitacion[0]}\n\nVideollamada: ${L.enlace}\nMás información: https://camiruatv.com/lanzamiento`,
    location: L.enlace,
    ctz: "America/Bogota",
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

function BotonCopiar() {
  const [copiado, setCopiado] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(L.enlace);
          setCopiado(true);
          window.setTimeout(() => setCopiado(false), 2000);
        } catch {
          /* sin permiso: el enlace sigue visible para copiarlo a mano */
        }
      }}
      className="inline-flex h-11 items-center gap-2 rounded-md border border-violeta/20 bg-hoja px-4 font-sans text-sm font-medium text-violeta transition-colors hover:border-violeta hover:bg-violeta-50"
    >
      {copiado ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      {copiado ? "Enlace copiado" : "Copiar enlace"}
    </button>
  );
}

/**
 * La invitación al lanzamiento. Se usa en el inicio (sección «Lanzamiento»)
 * y en la página /lanzamiento (`completa`: con el texto íntegro y el póster
 * más grande). Antes del evento invita; el día del evento resalta el enlace;
 * después, lo cuenta en pasado.
 */
export function Lanzamiento({ completa = false, className }: { completa?: boolean; className?: string }) {
  const estado = useEstadoEvento();
  const enVivo = estado === "en-curso";
  const paso = estado === "despues";

  return (
    <div className={cn("grid items-center gap-10 lg:grid-cols-[1.25fr_minmax(0,420px)] lg:gap-16", className)}>
      {/* En celular: título y datos → póster → texto y botones (el póster va
          en el medio para que no haya tanto texto antes de la imagen). En
          escritorio son dos columnas y el póster va a la derecha. */}
      <div className="contents lg:block">
      <div className="lg:contents">
        <p className="aparece etiqueta inline-flex items-center gap-2 rounded-sm bg-lima px-2 py-1 text-violeta-900">
          <Video className="size-3.5" aria-hidden="true" />
          {paso ? "Lanzamiento" : enVivo ? "En vivo ahora" : L.titulo}
        </p>
        <h2 className="aparece-titulo mt-4 font-serif text-[clamp(2.1rem,4.5vw,3.6rem)] font-semibold leading-tight text-tinta">
          {paso ? "Presentamos el libro el 13 de noviembre" : "Te invito al lanzamiento de mi libro"}
        </h2>

        <dl className="escalona mt-7 grid gap-x-8 gap-y-4 font-sans text-sm sm:grid-cols-3">
          <div style={{ "--i": 0 } as React.CSSProperties}>
            <dt className="etiqueta text-tinta/60">Fecha</dt>
            <dd className="mt-1 font-serif text-2xl leading-tight text-tinta">{L.fechaTexto}</dd>
          </div>
          <div style={{ "--i": 1 } as React.CSSProperties}>
            <dt className="etiqueta text-tinta/60">Hora</dt>
            <dd className="mt-1 font-serif text-2xl leading-tight text-tinta">{L.horaTexto}</dd>
            <dd className="text-xs text-muted-foreground">{L.zona}</dd>
          </div>
          <div style={{ "--i": 2 } as React.CSSProperties}>
            <dt className="etiqueta text-tinta/60">Modalidad</dt>
            <dd className="mt-1 font-serif text-2xl leading-tight text-tinta">Virtual</dd>
            <dd className="text-xs text-muted-foreground">Google Meet</dd>
          </div>
        </dl>
      </div>

      <figure className="aparece relative mx-auto w-full max-w-[340px] lg:hidden">
        <Poster eager={completa} />
      </figure>

      <div className="lg:contents">
        <div className="aparece prosa mt-0 max-w-2xl lg:mt-7">
          {(completa ? L.invitacion : [L.invitacion[1]]).map((p, i) => (
            <p key={i} className="!text-[1.05rem] text-foreground/90">
              {p}
            </p>
          ))}
          {!completa && (
            <p className="!text-[1.05rem] text-foreground/90">
              Es gratis y abierto: solo tienes que entrar a la videollamada a la hora indicada.
            </p>
          )}
        </div>

        {!paso ? (
          <div className="aparece mt-8 flex flex-wrap gap-3">
            <a
              href={L.enlace}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex h-12 items-center gap-2 rounded-md px-6 font-sans text-sm font-medium shadow-soft transition-colors",
                enVivo ? "bg-lima text-violeta-900 hover:bg-[#b8f55a]" : "bg-violeta text-hoja hover:bg-violeta-700",
              )}
            >
              <Video className="size-4" aria-hidden="true" />
              {enVivo ? "Entrar a la videollamada" : "Unirme el 13 de noviembre"}
              <ExternalLink className="size-3.5 opacity-70" aria-hidden="true" />
            </a>
            <a
              href={enlaceGoogleCalendar()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-violeta/20 bg-hoja px-5 font-sans text-sm font-medium text-violeta shadow-soft transition-colors hover:border-violeta hover:bg-violeta-50"
            >
              <CalendarPlus className="size-4" aria-hidden="true" />
              Google Calendar
            </a>
            <a
              href={L.calendario}
              download="lanzamiento-desvistiendo-otros-estilos.ics"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-violeta/20 bg-hoja px-5 font-sans text-sm font-medium text-violeta shadow-soft transition-colors hover:border-violeta hover:bg-violeta-50"
            >
              <CalendarPlus className="size-4" aria-hidden="true" />
              Apple / Outlook
            </a>
          </div>
        ) : (
          <p className="aparece mt-8 font-sans text-sm text-muted-foreground">
            Gracias a quienes se conectaron. Las novedades del libro siguen en{" "}
            <a href={CAMILA.instagram} target="_blank" rel="noopener noreferrer" className="font-medium text-violeta underline underline-offset-4">
              Instagram
            </a>
            .
          </p>
        )}

        {!paso && (
          <div className="aparece mt-5 flex flex-wrap items-center gap-3 font-sans text-sm text-muted-foreground">
            <span>
              Enlace de la videollamada:{" "}
              <a href={L.enlace} target="_blank" rel="noopener noreferrer" className="font-medium text-violeta underline underline-offset-4">
                meet.google.com/{L.codigoMeet}
              </a>
            </span>
            <BotonCopiar />
          </div>
        )}
      </div>
      </div>

      <figure className="aparece relative hidden w-full lg:block">
        <Poster eager={completa} />
      </figure>
    </div>
  );
}

/** La pieza promocional, como tarjeta ligeramente girada sobre un fondo lima. */
function Poster({ eager }: { eager: boolean }) {
  return (
    <>
      <div className="absolute -inset-2 rotate-[2.5deg] rounded-sm bg-lima" aria-hidden="true" />
      <div className="absolute -inset-2 -rotate-[1.5deg] rounded-sm border border-dashed border-violeta/40" aria-hidden="true" />
      <img
        src={L.poster}
        alt={`Invitación al lanzamiento del libro: ${L.fechaTexto}, ${L.horaTexto}, modalidad virtual`}
        width={900}
        height={1125}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="relative aspect-[4/5] w-full rounded-sm object-cover shadow-card"
      />
    </>
  );
}

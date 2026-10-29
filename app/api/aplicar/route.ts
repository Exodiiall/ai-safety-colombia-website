import { NextResponse } from "next/server";
import {
  CIERRE_ISO,
  DISPONIBILIDAD_FORM,
  EQUIPO_FORM,
  TRACKS_FORM,
} from "@/app/sprint/datos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CORREO_CONTACTO = "equipo@aisafetycolombia.org";
const REMITENTE = "AI Safety Colombia <equipo@aisafetycolombia.org>";
const TABLA = "sprint_applications";

/* Límite por IP: ocho envíos cada diez minutos. Vive en memoria, así que solo
   cubre la instancia que atienda la petición. Es suficiente para frenar un
   script torpe; lo que de verdad filtra bots es el campo trampa. */
const VENTANA_MS = 10 * 60 * 1000;
const TOPE = 8;
const visitas = new Map<string, number[]>();

function pasaElLimite(ip: string): boolean {
  const ahora = Date.now();
  const previas = (visitas.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  if (previas.length >= TOPE) {
    visitas.set(ip, previas);
    return false;
  }
  previas.push(ahora);
  visitas.set(ip, previas);
  if (visitas.size > 5000) visitas.clear();
  return true;
}

function ipDeLaPeticion(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "desconocida";
}

const LIMITES: Record<string, number> = {
  firstName: 100,
  lastName: 100,
  email: 200,
  whatsapp: 40,
  linkedin: 300,
  career: 800,
  reason: 1500,
  hubProblem: 1500,
  hubTeamNames: 600,
  hubAccess: 800,
  hubExtra: 800,
};

/* Hay dos formularios contra esta misma ruta. El largo, en /sprint/aplicar,
   pregunta todo. El corto, en /sprint/aplicar/recomendacion, es el enlace que
   se le manda a quien llega recomendado: nombre, apellidos, correo, LinkedIn y
   por que quiere venir. Las columnas que el corto no llena viajan vacias, igual
   que scholar; en la tabla se reconocen porque career y hub_problem estan en
   blanco. */
const OBLIGATORIOS: Record<string, string[]> = {
  largo: [
    "firstName",
    "lastName",
    "email",
    "whatsapp",
    "linkedin",
    "career",
    "reason",
    "hubProblem",
  ],
  corto: ["firstName", "lastName", "email", "whatsapp", "linkedin", "reason"],
};

/* Lo que el formulario corto no pregunta y por tanto se guarda vacio. */
const SIN_PREGUNTAR = [
  "career",
  "hubProblem",
  "hubTrack",
  "hubTeam",
  "hubTeamNames",
  "hubExtra",
];

const TRACKS = new Set(TRACKS_FORM.map((t) => t.id as string));
const DISPONIBILIDADES = new Set(
  DISPONIBILIDAD_FORM.map((t) => t.id as string),
);
const EQUIPOS = new Set(EQUIPO_FORM.map((t) => t.id as string));

type Crudo = Record<string, unknown>;

function texto(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function validar(
  raw: Crudo,
): { ok: true; datos: Record<string, string> } | { ok: false; campo: string } {
  const formato = texto(raw.formato) === "corto" ? "corto" : "largo";
  const datos: Record<string, string> = { formato };

  for (const [campo, tope] of Object.entries(LIMITES)) {
    const valor = texto(raw[campo]);
    if (valor.length > tope) return { ok: false, campo };
    datos[campo] = valor;
  }
  for (const campo of OBLIGATORIOS[formato]) {
    if (!datos[campo]) return { ok: false, campo };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email))
    return { ok: false, campo: "email" };

  /* Mismo criterio que el formulario: entre siete y quince digitos, escritos
     como quiera cada quien. */
  const digitos = datos.whatsapp.replace(/\D/g, "").length;
  if (
    !/^\+?[\d\s().-]+$/.test(datos.whatsapp) ||
    digitos < 7 ||
    digitos > 15
  )
    return { ok: false, campo: "whatsapp" };

  /* Los tres dias completos son la condicion del fin de semana, asi que la
     pregunta es obligatoria en los dos formularios. */
  const disponible = texto(raw.hubAvailability);
  if (!DISPONIBILIDADES.has(disponible))
    return { ok: false, campo: "hubAvailability" };
  datos.hubAvailability = disponible;

  if (formato === "corto") {
    for (const campo of SIN_PREGUNTAR) datos[campo] = "";
  } else {
    const track = texto(raw.hubTrack);
    if (!TRACKS.has(track)) return { ok: false, campo: "hubTrack" };
    datos.hubTrack = track;

    const equipo = texto(raw.hubTeam);
    if (!EQUIPOS.has(equipo)) return { ok: false, campo: "hubTeam" };
    datos.hubTeam = equipo;
    if (equipo === "equipo" && !datos.hubTeamNames)
      return { ok: false, campo: "hubTeamNames" };
  }

  if (texto(raw.aiConfirm) !== "si") return { ok: false, campo: "aiConfirm" };
  datos.aiConfirm = "si";

  return { ok: true, datos };
}

async function guardar(datos: Record<string, string>): Promise<boolean> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("[aplicar] faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
    return false;
  }

  const fila = {
    submitted_at: new Date().toISOString(),
    sprint: "ai-incident-response-2026-09",
    first_name: datos.firstName,
    last_name: datos.lastName,
    email: datos.email,
    whatsapp: datos.whatsapp,
    /* Ni el largo ni el corto preguntan ya la ciudad. La columna es not null,
       asi que se manda vacia; las filas viejas quedan como estan. */
    location: "",
    linkedin: datos.linkedin,
    /* La pregunta del portafolio se quito del formulario. La columna sigue en
       la tabla por las aplicaciones que ya la traen, y como es not null se
       manda vacia. Para retirarla del todo: alter table sprint_applications
       alter column scholar drop not null. */
    scholar: "",
    career: datos.career,
    reason: datos.reason,
    hub_problem: datos.hubProblem,
    hub_track: datos.hubTrack,
    hub_team: datos.hubTeam,
    hub_team_names: datos.hubTeamNames || null,
    /* Lo mismo con la pregunta de como llegaria a Bogota. */
    hub_travel: "",
    hub_availability: datos.hubAvailability,
    hub_access: datos.hubAccess || null,
    hub_extra: datos.hubExtra || null,
    ai_confirmed: true,
  };

  const enviar = (cuerpo: object) =>
    fetch(`${url}/rest/v1/${TABLA}`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(cuerpo),
    });

  /* Estas dos preguntas llegaron al formulario antes que a la tabla. Mientras
     no se corra el alter, la aplicacion se guarda sin esas respuestas: perder
     al aspirante sale mucho mas caro que perder el dato. PostgREST nombra una
     sola columna por respuesta, asi que se reintenta quitando de a una. En
     cuanto existan las columnas, este lazo deja de entrar solo. */
  const APLAZABLES = ["hub_availability", "whatsapp"];

  try {
    const cuerpo: Record<string, unknown> = { ...fila };
    const quitadas: string[] = [];

    for (let intento = 0; intento <= APLAZABLES.length; intento += 1) {
      const r = await enviar(cuerpo);
      if (r.ok) {
        if (quitadas.length > 0) {
          console.error(
            `[aplicar] faltan columnas en la tabla (${quitadas.join(", ")}); se guardó sin ellas. Corre: ${quitadas
              .map(
                (c) =>
                  `alter table public.sprint_applications add column if not exists ${c} text;`,
              )
              .join(" ")}`,
          );
          /* La fila quedó guardada pero incompleta, y esas respuestas no están
             en ningún otro lado. Se mandan por correo para poder reponerlas a
             mano; en cuanto existan las columnas esto deja de salir solo. */
          await avisarDeLoQueNoCupo(datos, quitadas);
        }
        return true;
      }

      const motivo = await r.text();
      const falta = APLAZABLES.find((c) => c in cuerpo && motivo.includes(c));
      if (!falta) {
        console.error("[aplicar] Supabase respondió", r.status, motivo);
        return false;
      }
      delete cuerpo[falta];
      quitadas.push(falta);
    }

    return false;
  } catch (e) {
    console.error("[aplicar] falló el insert", e);
    return false;
  }
}

/* La confirmación es un extra: si el correo no sale, la aplicación ya quedó
   guardada y no se le dice a nadie que falló. */
async function confirmar(datos: Record<string, string>): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;

  const cuerpo = [
    `Hola ${datos.firstName},`,
    "",
    "Recibimos tu aplicación al hub presencial del AI Incident Response Sprint, del 11 al 13 de septiembre en Bogotá.",
    "",
    "Revisamos las aplicaciones a medida que llegan y te respondemos antes del sprint, quedes o no. El hub queda en el Chicó, en el norte de Bogotá; la dirección exacta va por correo a quienes queden seleccionados.",
    "",
    `Si algo cambia o quieres corregir una respuesta, escríbenos a ${CORREO_CONTACTO}.`,
    "",
    "AI Safety Colombia",
  ].join("\n");

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: REMITENTE,
        to: [datos.email],
        reply_to: CORREO_CONTACTO,
        subject: "Recibimos tu aplicación al sprint de septiembre",
        text: cuerpo,
      }),
    });
    /* Resend responde 200 con un id, o un error con el motivo. Sin esta
       revision una confirmacion rechazada se pierde sin dejar rastro. */
    if (!r.ok)
      console.error(
        "[aplicar] Resend rechazo la confirmacion",
        r.status,
        await r.text(),
      );
  } catch (e) {
    console.error("[aplicar] no salió la confirmación", e);
  }
}

/* Aviso interno para no perder una aplicación si Supabase se cae. */
/* Cuando una columna todavía no existe en la tabla, la aplicación se guarda
   sin esa respuesta. El correo es la única copia que queda de lo que se cayó. */
async function avisarDeLoQueNoCupo(
  datos: Record<string, string>,
  quitadas: string[],
): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const CAMPOS: Record<string, string> = {
    whatsapp: "whatsapp",
    hub_availability: "hubAvailability",
  };
  const perdido = quitadas
    .map((c) => `${c}: ${datos[CAMPOS[c] ?? c] ?? ""}`)
    .join("\n");
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: REMITENTE,
        to: [CORREO_CONTACTO],
        subject: `Aplicación guardada sin ${quitadas.join(" ni ")}`,
        text: `${datos.firstName} ${datos.lastName} <${datos.email}> aplicó, pero la tabla todavía no tiene ${quitadas.join(" ni ")}. Lo que no se guardó:

${perdido}

Para que deje de pasar:
${quitadas
          .map(
            (c) =>
              `alter table public.sprint_applications add column if not exists ${c} text;`,
          )
          .join("\n")}`,
      }),
    });
  } catch {
    /* si esto también falla, ya solo quedan los logs */
  }
}

async function avisarDeLaFalla(datos: Record<string, string>): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: REMITENTE,
        to: [CORREO_CONTACTO],
        subject: "Falló una aplicación al sprint",
        text: `No se pudo guardar en Supabase. Datos:\n\n${JSON.stringify(datos, null, 2)}`,
      }),
    });
  } catch {
    /* si esto también falla, ya solo quedan los logs */
  }
}

export async function POST(req: Request) {
  if (Date.now() > Date.parse(CIERRE_ISO)) {
    return NextResponse.json({ ok: false, error: "closed" }, { status: 403 });
  }

  if (!pasaElLimite(ipDeLaPeticion(req))) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  let raw: Crudo;
  try {
    raw = (await req.json()) as Crudo;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  /* Campo trampa: un bot lo llena. Se responde que todo salió bien para que no
     reintente, y no se guarda nada. */
  if (texto(raw.website)) return NextResponse.json({ ok: true });

  const revisado = validar(raw);
  if (!revisado.ok) {
    return NextResponse.json(
      { ok: false, error: "invalid", campo: revisado.campo },
      { status: 400 },
    );
  }

  const guardado = await guardar(revisado.datos);
  if (!guardado) {
    await avisarDeLaFalla(revisado.datos);
    return NextResponse.json(
      { ok: false, error: "submission_failed" },
      { status: 502 },
    );
  }

  await confirmar(revisado.datos);
  return NextResponse.json({ ok: true });
}

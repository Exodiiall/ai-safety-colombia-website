import { NextResponse } from "next/server";
import { CIERRE_INSCRIPCIONES_ISO, CORREO_HACKATHON, inscripcionesIniciadas } from "@/app/defacchackathon/datos";
import { POLITICA_VERSION } from "@/lib/politica-datos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REMITENTE = "AI Safety Colombia <equipo@aisafetycolombia.org>";
const TABLA = "defacc_applications";

/* Límite por IP: 8 envíos cada 10 minutos */
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
  documentType: 20,
  documentNumber: 50,
  affiliation: 300,
  careerRole: 300,
  experienceLevel: 50,
  linkedin: 300,
  githubPortfolio: 300,
  teamMode: 50,
  teamMembers: 500,
  preferredTrack: 50,
  projectIdea: 1500,
  dietaryRestrictions: 50,
  dietaryDetail: 300,
  availability: 10,
  authorization: 10,
};

const OBLIGATORIOS = [
  "firstName",
  "lastName",
  "email",
  "whatsapp",
  "documentNumber",
  "affiliation",
  "careerRole",
];

type Crudo = Record<string, unknown>;

function texto(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function validar(
  raw: Crudo,
): { ok: true; datos: Record<string, string> } | { ok: false; campo: string } {
  const datos: Record<string, string> = {};

  for (const [campo, tope] of Object.entries(LIMITES)) {
    const valor = texto(raw[campo]);
    if (valor.length > tope) return { ok: false, campo };
    datos[campo] = valor;
  }

  for (const campo of OBLIGATORIOS) {
    if (!datos[campo]) return { ok: false, campo };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
    return { ok: false, campo: "email" };
  }

  const digitos = datos.whatsapp.replace(/\D/g, "").length;
  if (
    !/^\+?[\d\s().-]+$/.test(datos.whatsapp) ||
    digitos < 7 ||
    digitos > 15
  ) {
    return { ok: false, campo: "whatsapp" };
  }

  if (datos.availability !== "si") {
    return { ok: false, campo: "availability" };
  }

  if (datos.authorization !== "si") {
    return { ok: false, campo: "authorization" };
  }

  return { ok: true, datos };
}

async function guardar(datos: Record<string, string>): Promise<boolean> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("[defacc/aplicar] faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
    return false;
  }

  let dieta = datos.dietaryRestrictions || "ninguna";
  if (dieta === "alergias" && datos.dietaryDetail) {
    dieta = `Alergias: ${datos.dietaryDetail}`;
  }

  const fila = {
    submitted_at: new Date().toISOString(),
    first_name: datos.firstName,
    last_name: datos.lastName,
    email: datos.email,
    whatsapp: datos.whatsapp,
    document_type: datos.documentType || "CC",
    document_number: datos.documentNumber,
    affiliation: datos.affiliation,
    career_role: datos.careerRole,
    experience_level: datos.experienceLevel || "intermedio",
    linkedin: datos.linkedin || null,
    github_portfolio: datos.githubPortfolio || null,
    team_mode: datos.teamMode || "individual",
    team_members: datos.teamMembers || null,
    preferred_track: datos.preferredTrack || "por_definir",
    project_idea: datos.projectIdea || null,
    dietary_restrictions: dieta,
    availability_confirmed: true,
    consent_at: new Date().toISOString(),
    policy_version: POLITICA_VERSION,
    status: "nueva",
  };

  try {
    const r = await fetch(`${url}/rest/v1/${TABLA}`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(fila),
    });

    if (!r.ok) {
      const motivo = await r.text();
      console.error("[defacc/aplicar] Supabase respondió error", r.status, motivo);
      return false;
    }

    return true;
  } catch (e) {
    console.error("[defacc/aplicar] falló la petición a Supabase", e);
    return false;
  }
}

const NOMBRES_TRACKS: Record<string, string> = {
  "track-1": "Track 1: Seguridad de agentes e inyección de instrucciones (MCP, AgentDojo)",
  "track-2": "Track 2: Control de IA, monitoreo y detección de sabotaje (ControlArena, Inspect)",
  "track-3": "Track 3: Ciberdefensa automatizada y verificación formal (DafnyBench, CyberSecEval)",
  "track-4": "Track 4: Defensa epistémica, procedencia C2PA y detección de suplantación (AASIST)",
  "track-5": "Track 5: Seguridad de infraestructura de IA y gobernanza defensiva (No-Code, SL1 a SL5)",
  por_definir: "Por definir en la mañana del evento",
};

async function confirmarPorCorreo(datos: Record<string, string>): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;

  const trackLegible = NOMBRES_TRACKS[datos.preferredTrack] ?? datos.preferredTrack;

  const cuerpo = [
    `¡Hola ${datos.firstName}!`,
    "",
    "Recibimos tu postulación al Defensive Acceleration Hackathon, que celebraremos el sábado 14 de noviembre de 2026 de 8:00 a. m. a 8:00 p. m. en la Universidad de los Andes, Bogotá.",
    "",
    `Modalidad: ${datos.teamMode === "equipo" ? "En equipo" : "Individual (te ayudaremos a conectar con un equipo en el matchmaking matutino)"}`,
    `Track preferido: ${trackLegible}`,
    "",
    "Revisamos las postulaciones continuamente para coordinar los accesos peatonales al campus con la Universidad de los Andes (con tu documento registrado) y el servicio de almuerzo.",
    "",
    "Te escribiremos por correo y WhatsApp con las instrucciones de acceso, sala asignada y canales de comunicación técnica.",
    "",
    "Si tienes preguntas o necesitas actualizar tu registro, puedes responder directamente a este correo o escribir a equipo@aisafetycolombia.org.",
    "",
    "¡Nos vemos el 14 de noviembre!",
    "",
    "Comité Organizador",
    "AI Safety Colombia × IEEE Computer Society Uniandes",
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
        reply_to: CORREO_HACKATHON,
        subject: "Recibimos tu postulación al Defensive Acceleration Hackathon",
        text: cuerpo,
      }),
    });

    if (!r.ok) {
      console.error(
        "[defacc/aplicar] Resend rechazó confirmación:",
        r.status,
        await r.text(),
      );
    }
  } catch (e) {
    console.error("[defacc/aplicar] error enviando correo de confirmación", e);
  }
}

async function avisarFallaEquipo(datos: Record<string, string>): Promise<void> {
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
        to: [CORREO_HACKATHON],
        subject: "Alerta: Falló guardado de postulación al Hackathon",
        text: `No se pudo registrar la postulación en Supabase para ${datos.firstName} ${datos.lastName} (${datos.email}).\n\nDatos:\n${JSON.stringify(datos, null, 2)}`,
      }),
    });
  } catch {
    // Silencioso
  }
}

export async function POST(req: Request) {
  if (!pasaElLimite(ipDeLaPeticion(req))) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", mensaje: "Demasiadas peticiones. Intenta en unos minutos." },
      { status: 429 },
    );
  }

  let raw: Crudo;
  try {
    raw = (await req.json()) as Crudo;
  } catch {
    return NextResponse.json(
      { ok: false, error: "bad_json", mensaje: "Formato de datos no válido." },
      { status: 400 },
    );
  }

  // Apertura de inscripciones
  if (!inscripcionesIniciadas()) {
    return NextResponse.json(
      { ok: false, error: "not_started", mensaje: "Las inscripciones al hackathon aún no han iniciado." },
      { status: 403 },
    );
  }

  // Cierre de inscripciones
  if (Date.now() > Date.parse(CIERRE_INSCRIPCIONES_ISO)) {
    return NextResponse.json(
      { ok: false, error: "closed", mensaje: "Las inscripciones al hackathon han cerrado." },
      { status: 403 },
    );
  }

  // Campo trampa (honeypot)
  if (texto(raw.website)) {
    return NextResponse.json({ ok: true });
  }

  const rev = validar(raw);
  if (!rev.ok) {
    return NextResponse.json(
      { ok: false, error: "invalid", campo: rev.campo, mensaje: `El campo ${rev.campo} es obligatorio o tiene un formato no válido.` },
      { status: 400 },
    );
  }

  const guardado = await guardar(rev.datos);
  if (!guardado) {
    await avisarFallaEquipo(rev.datos);
    return NextResponse.json(
      { ok: false, error: "submission_failed", mensaje: "No pudimos conectar con la base de datos. Ya avisamos al equipo técnico; por favor intenta nuevamente en unos instantes." },
      { status: 502 },
    );
  }

  await confirmarPorCorreo(rev.datos);
  return NextResponse.json({ ok: true });
}

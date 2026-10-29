import { NextResponse } from "next/server";
import type { Idioma } from "@/lib/idiomas";
import {
  AREAS,
  CURSOS,
  ETAPAS,
  FORMATOS,
  LIMITES_CURSOS,
  PREGUNTAS,
  cursosCerrados,
  obligatorios,
  type CursoId,
} from "@/lib/cursos";
import { POLITICA_VERSION, RUTA_POLITICA } from "@/lib/politica-datos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CORREO_CONTACTO = "equipo@aisafetycolombia.org";
const REMITENTE = "Jose Gelves <equipo@aisafetycolombia.org>";
const TABLA = "course_applications";
const RONDA = "2026-10";

/* Mismo límite por IP que la ruta del sprint: ocho envíos cada diez minutos,
   en memoria. Lo que de verdad filtra bots es el campo trampa. */
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

type Crudo = Record<string, unknown>;

function texto(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

type Datos = {
  locale: Idioma;
  course: CursoId;
  role: string;
  format: string;
  altPlacement: boolean;
  fields: string[];
  careerStage: string;
  mentionName: boolean;
  shareData: boolean;
  consentAt: string;
  t: Record<string, string>;
};

function validar(raw: Crudo): { ok: true; datos: Datos } | { ok: false; campo: string } {
  const locale = (["es", "en", "pt"].includes(texto(raw.locale)) ? texto(raw.locale) : "es") as Idioma;

  const course = texto(raw.course) as CursoId;
  if (!CURSOS.includes(course)) return { ok: false, campo: "course" };

  /* El formulario ya no pregunta el rol ni la ubicación: todos aplican como
     participantes y las columnas se llenan con lo mismo para no tocar la tabla. */
  const role = "participante";

  const format = texto(raw.format);
  if (!(FORMATOS as readonly string[]).includes(format)) return { ok: false, campo: "format" };

  const t: Record<string, string> = {};
  for (const [campo, tope] of Object.entries(LIMITES_CURSOS)) {
    const valor = texto(raw[campo]);
    if (valor.length > tope) return { ok: false, campo };
    t[campo] = valor;
  }
  /* Lo que el curso no pregunta no se guarda aunque venga en el borrador. */
  if (course !== "agi-strategy") t.hours = "";
  for (const q of ["qPlan", "qEngagement", "qSkills", "qAchievement", "qTradeoff"]) {
    if (!PREGUNTAS[course].includes(q)) t[q] = "";
  }

  const fields = texto(raw.fields).split(",").filter(Boolean);
  if (fields.length === 0 || fields.length > 3) return { ok: false, campo: "fields" };
  if (!fields.every((f) => (AREAS as readonly string[]).includes(f))) return { ok: false, campo: "fields" };

  const careerStage = texto(raw.careerStage);
  if (!(ETAPAS as readonly string[]).includes(careerStage)) return { ok: false, campo: "careerStage" };
  if (careerStage === "other" && !t.careerDetail) return { ok: false, campo: "careerDetail" };
  if (careerStage !== "other") t.careerDetail = "";

  const mention = texto(raw.mentionName);
  if (mention !== "si" && mention !== "no") return { ok: false, campo: "mentionName" };

  /* Sin la casilla de autorización marcada no se guarda nada (Ley 1581 de
     2012, art. 9). */
  if (texto(raw.authorization) !== "si") return { ok: false, campo: "authorization" };

  const faltantes = obligatorios(course).filter(
    (c) => !["course", "role", "format", "fields", "careerStage", "mentionName", "authorization"].includes(c),
  );
  for (const campo of faltantes) if (!t[campo]) return { ok: false, campo };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.email)) return { ok: false, campo: "email" };
  if (!/^https?:\/\/\S+\.\S+/.test(t.profileUrl)) return { ok: false, campo: "profileUrl" };

  return {
    ok: true,
    datos: {
      locale,
      course,
      role,
      format,
      altPlacement: course === "technical-ai-safety" && texto(raw.altPlacement) === "si",
      fields,
      careerStage,
      mentionName: mention === "si",
      /* Ya no se pregunta; la columna se queda en falso. */
      shareData: false,
      consentAt: new Date().toISOString(),
      t,
    },
  };
}

function fila(d: Datos) {
  return {
    submitted_at: new Date().toISOString(),
    round: RONDA,
    locale: d.locale,
    course: d.course,
    role: d.role,
    availability: d.format,
    alt_placement: d.altPlacement,
    first_name: d.t.firstName,
    last_name: d.t.lastName,
    email: d.t.email,
    profile_url: d.t.profileUrl,
    other_profile: d.t.otherProfile || null,
    fields_of_study: d.fields.join(", "),
    career_stage: d.careerStage,
    career_detail: d.t.careerDetail || null,
    location: "",
    hours_ai_safety: d.t.hours || null,
    q_plan: d.t.qPlan,
    q_engagement: d.t.qEngagement,
    q_skills: d.t.qSkills,
    q_achievement: d.t.qAchievement,
    q_tradeoff: d.t.qTradeoff || null,
    source: d.t.source,
    nominee: d.t.nominee,
    mention_name: d.mentionName,
    feedback: d.t.feedback || null,
    share_data: d.shareData,
    /* La prueba de la autorización: cuándo marcó la casilla y qué versión de
       la política tenía a la vista. */
    consent_at: d.consentAt,
    policy_version: POLITICA_VERSION,
  };
}

async function guardar(d: Datos): Promise<boolean> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("[cursos] faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
    return false;
  }
  try {
    const r = await fetch(`${url}/rest/v1/${TABLA}`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(fila(d)),
    });
    if (r.ok) return true;
    const error = await r.text();
    console.error("[cursos] Supabase respondió", r.status, error);
    /* Si la tabla todavía no tiene las columnas de la autorización, se guarda
       la aplicación sin ellas antes que perderla; el aviso de falla de abajo
       no salta y la autorización queda en los registros de Vercel. */
    if (/consent_at|policy_version/.test(error)) {
      const { consent_at, policy_version, ...resto } = fila(d);
      console.error("[cursos] autorización sin columna", { email: d.t.email, consent_at, policy_version });
      const r2 = await fetch(`${url}/rest/v1/${TABLA}`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(resto),
      });
      return r2.ok;
    }
    return false;
  } catch (e) {
    console.error("[cursos] falló el insert", e);
    return false;
  }
}

const NOMBRE: Record<Idioma, Record<CursoId, string>> = {
  es: { "agi-strategy": "Seminario de futuro y riesgos de la IA", "technical-ai-safety": "Seminario técnico de seguridad de la IA" },
  en: { "agi-strategy": "Seminar on the Future and Risks of AI", "technical-ai-safety": "Technical AI Safety Seminar" },
  pt: { "agi-strategy": "Seminário de futuro e riscos da IA", "technical-ai-safety": "Seminário técnico de segurança da IA" },
};

function correoDeConfirmacion(d: Datos): { subject: string; text: string } {
  const curso = NOMBRE[d.locale][d.course];
  if (d.locale === "en") {
    return {
      subject: `We got your application to ${curso}`,
      text: [
        `Hi ${d.t.firstName},`,
        "",
        `We got your application to the ${curso} course that AI Safety Colombia runs with BlueDot Impact materials.`,
        "",
        "Applications close on Friday 9 October at 11:59 pm, Colombia time. We review them after that and reply to everyone, whether or not they get in, with the next steps. The seminar starts the week of 12 October.",
        "",
        `If you want to correct an answer, reply to this email or write to ${CORREO_CONTACTO}. How we handle your data: https://aisafetycolombia.org${RUTA_POLITICA.en}`,
        "",
        "Jose Gelves",
        "AI Safety Colombia",
      ].join("\n"),
    };
  }
  if (d.locale === "pt") {
    return {
      subject: `Recebemos sua inscrição em ${curso}`,
      text: [
        `Olá, ${d.t.firstName},`,
        "",
        `Recebemos sua inscrição no curso ${curso}, que a AI Safety Colombia oferece com materiais da BlueDot Impact.`,
        "",
        "As inscrições fecham na sexta-feira, 9 de outubro, às 23h59, horário da Colômbia. Revisamos depois disso e respondemos a todo mundo, com ou sem vaga, com os próximos passos. O seminário começa na semana de 12 de outubro.",
        "",
        `Se quiser corrigir alguma resposta, responda a este e-mail ou escreva para ${CORREO_CONTACTO}. Como tratamos seus dados: https://aisafetycolombia.org${RUTA_POLITICA.pt}`,
        "",
        "Jose Gelves",
        "AI Safety Colombia",
      ].join("\n"),
    };
  }
  return {
    subject: `Recibimos tu aplicación a ${curso}`,
    text: [
      `Hola ${d.t.firstName},`,
      "",
      `Recibimos tu aplicación al curso ${curso}, que AI Safety Colombia corre con los materiales de BlueDot Impact.`,
      "",
      "Las aplicaciones cierran el viernes 9 de octubre a las 11:59 p. m., hora de Colombia. Las revisamos después y le respondemos a todo el mundo, quede o no, con los siguientes pasos. El seminario arranca la semana del 12 de octubre.",
      "",
      `Si quieres corregir una respuesta, responde este correo o escríbenos a ${CORREO_CONTACTO}. Cómo tratamos tus datos: https://aisafetycolombia.org${RUTA_POLITICA.es}`,
      "",
      "Jose Gelves",
      "AI Safety Colombia",
    ].join("\n"),
  };
}

async function mandar(cuerpo: object, etiqueta: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
    });
    if (!r.ok) console.error(`[cursos] Resend rechazó ${etiqueta}`, r.status, await r.text());
  } catch (e) {
    console.error(`[cursos] no salió ${etiqueta}`, e);
  }
}

export async function POST(req: Request) {
  if (cursosCerrados()) {
    return NextResponse.json({ ok: false, error: "closed" }, { status: 403 });
  }

  if (!pasaElLimite(ipDeLaPeticion(req))) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
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
    return NextResponse.json({ ok: false, error: "invalid", campo: revisado.campo }, { status: 400 });
  }
  const d = revisado.datos;

  if (!(await guardar(d))) {
    /* Aviso interno para no perder la aplicación si Supabase se cae. */
    await mandar(
      {
        from: REMITENTE,
        to: [CORREO_CONTACTO],
        subject: `Falló una aplicación a ${NOMBRE[d.locale][d.course]}`,
        text: `No se pudo guardar en Supabase. Datos:\n\n${JSON.stringify(fila(d), null, 2)}`,
      },
      "el aviso de falla",
    );
    return NextResponse.json({ ok: false, error: "submission_failed" }, { status: 502 });
  }

  /* La confirmación es un extra: si no sale, la aplicación ya quedó guardada. */
  const { subject, text } = correoDeConfirmacion(d);
  await mandar({ from: REMITENTE, to: [d.t.email], reply_to: CORREO_CONTACTO, subject, text }, "la confirmación");
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { verificarSeleccionada, type Seleccionada } from "@/lib/firma-seminario";
import {
  DATOS_SEMINARIO,
  MODALIDADES,
  confirmacionCerrada,
  etiquetaHorario,
  horariosValidos,
  ordenarHorarios,
  whatsappValido,
} from "@/lib/seminarios-confirmar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CORREO_CONTACTO = "equipo@aisafetycolombia.org";
const REMITENTE = "AI Safety Colombia <equipo@aisafetycolombia.org>";
const TABLA = "seminar_confirmations";

/* El mismo límite flojo de /api/confirmar: varias personas confirman desde la
   misma red de la universidad y la identidad ya viene firmada. */
const VENTANA_MS = 10 * 60 * 1000;
const TOPE = 60;
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

function texto(valor: unknown, tope: number): string {
  return typeof valor === "string" ? valor.trim().slice(0, tope) : "";
}

type Respuesta = Seleccionada & {
  toma: boolean;
  whatsapp: string;
  modalidad: string;
  horarios: string[];
  nota: string;
};

const NOMBRE_MODALIDAD: Record<string, string> = Object.fromEntries(
  MODALIDADES.map((m) => [m.id, m.label.replace(/\.$/, "")]),
);

/* Lo mismo que se guarda, en texto, para el aviso interno si Supabase falla y
   para el acuse a la persona. */
function resumen(r: Respuesta): string[] {
  if (!r.toma) return ["No toma el cupo.", r.nota ? `Nota: ${r.nota}` : ""];
  return [
    `WhatsApp: ${r.whatsapp}`,
    r.remoto ? `Modalidad: ${NOMBRE_MODALIDAD[r.modalidad] ?? r.modalidad}` : "",
    "Sesiones en que puedes:",
    ...(r.horarios.length
      ? ordenarHorarios(r.horarios).map((h) => `  ${etiquetaHorario(h)}`)
      : ["  (ninguna)"]),
    r.nota ? `Nota: ${r.nota}` : "",
  ];
}

async function guardar(r: Respuesta): Promise<boolean> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("[seminarios/confirmar] faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
    return false;
  }

  /* Upsert por (seminar, email): quien vuelva a abrir el enlace para cambiar
     los horarios reemplaza su fila. Solo entra por el enlace firmado, así que
     nadie puede pisar la respuesta de otra persona. */
  try {
    const res = await fetch(`${url}/rest/v1/${TABLA}?on_conflict=seminar,email`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal,resolution=merge-duplicates",
      },
      body: JSON.stringify({
        confirmed_at: new Date().toISOString(),
        seminar: r.seminario,
        name: r.nombre,
        email: r.correo,
        takes_spot: r.toma,
        whatsapp: r.toma ? r.whatsapp : null,
        modality: r.toma ? r.modalidad : null,
        slots: r.toma ? r.horarios : [],
        note: r.nota || null,
      }),
    });
    if (res.ok) return true;
    console.error("[seminarios/confirmar] Supabase respondió", res.status, await res.text());
    return false;
  } catch (e) {
    console.error("[seminarios/confirmar] falló el insert", e);
    return false;
  }
}

async function correo(para: string, asunto: string, cuerpo: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: REMITENTE,
        to: [para],
        reply_to: CORREO_CONTACTO,
        subject: asunto,
        text: cuerpo,
      }),
    });
    if (!res.ok)
      console.error("[seminarios/confirmar] Resend rechazó", res.status, await res.text());
  } catch (e) {
    console.error("[seminarios/confirmar] no salió el correo", e);
  }
}

/* Si Supabase se cae, la respuesta llega por correo y se repone a mano. */
async function avisarDeLaFalla(r: Respuesta): Promise<void> {
  await correo(
    CORREO_CONTACTO,
    `[seminarios] NO SE GUARDÓ la confirmación de ${r.nombre}`,
    [
      `${r.nombre} <${r.correo}> respondió y Supabase rechazó la fila.`,
      `Seminario: ${DATOS_SEMINARIO[r.seminario].nombre}`,
      "",
      ...resumen(r),
    ]
      .filter((l) => l !== "")
      .join("\n"),
  );
}

/* Acuse con la copia de lo que marcó. Si no sale, la respuesta ya quedó
   guardada. */
async function acusar(r: Respuesta): Promise<void> {
  const d = DATOS_SEMINARIO[r.seminario];
  const saludo = `Hola ${r.nombre.trim().split(/\s+/)[0]},`;
  const cuerpo = r.toma
    ? [
        saludo,
        "",
        `Tu cupo en el ${d.nombre} queda confirmado. ${d.fechas}.`,
        "",
        "Esto fue lo que marcaste:",
        "",
        ...resumen(r),
        "",
        "Antes del lunes 19 de octubre te escribimos con tu cohorte, el horario y el lugar. Si quieres cambiar algo, vuelve a abrir el enlace del correo de aceptación antes del miércoles a medianoche.",
        "",
        "AI Safety Colombia",
      ]
    : [
        saludo,
        "",
        `Gracias por avisarnos. Liberamos tu cupo en el ${d.nombre}.`,
        "",
        "Si cambias de opinión antes del miércoles a medianoche, vuelve a abrir el enlace del correo de aceptación.",
        "",
        "AI Safety Colombia",
      ];

  await correo(
    r.correo,
    r.toma ? "Confirmado: tu cupo en el seminario" : "Recibimos tu respuesta",
    cuerpo.filter((l, i, todas) => l !== "" || todas[i - 1] !== "").join("\n"),
  );
}

export async function POST(req: Request) {
  if (!pasaElLimite(ipDeLaPeticion(req)))
    return NextResponse.json({ error: "demasiadas" }, { status: 429 });

  let crudo: Record<string, unknown>;
  try {
    crudo = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "json" }, { status: 400 });
  }

  /* Solo hay un camino: el enlace firmado. Sin token o con uno que no cuadre
     no se guarda nada. */
  const persona = verificarSeleccionada(texto(crudo.token, 2000));
  if (!persona) return NextResponse.json({ error: "enlace" }, { status: 403 });

  if (texto(crudo.website, 100)) return NextResponse.json({ ok: true });

  if (confirmacionCerrada(persona.hasta)) return NextResponse.json({ error: "cerrado" }, { status: 410 });

  const toma = crudo.toma === true;
  const nota = texto(crudo.nota, 1200);
  const whatsapp = texto(crudo.whatsapp, 40);
  /* Solo quien está fuera de Bogotá escoge modalidad; el resto va presencial
     diga lo que diga la petición. */
  const modalidad = persona.remoto ? texto(crudo.modalidad, 20) : "presencial";

  /* Los horarios se filtran contra los del seminario de la persona: un id que
     no exista, o uno del otro seminario, se descarta en silencio. */
  const validos = horariosValidos(persona.seminario);
  const horarios = Array.isArray(crudo.horarios)
    ? [...new Set(crudo.horarios.filter((h): h is string => typeof h === "string"))].filter((h) =>
        validos.has(h),
      )
    : [];

  if (toma) {
    if (crudo.compromiso !== true)
      return NextResponse.json({ error: "compromiso" }, { status: 400 });
    if (!whatsappValido(whatsapp))
      return NextResponse.json({ error: "whatsapp" }, { status: 400 });
    if (!MODALIDADES.some((m) => m.id === modalidad))
      return NextResponse.json({ error: "modalidad" }, { status: 400 });
    if (horarios.length === 0 && !nota)
      return NextResponse.json({ error: "horarios" }, { status: 400 });
  }

  const respuesta: Respuesta = { ...persona, toma, whatsapp, modalidad, horarios, nota };

  if (!(await guardar(respuesta))) {
    await avisarDeLaFalla(respuesta);
    return NextResponse.json({ error: "guardar" }, { status: 502 });
  }

  await acusar(respuesta);
  return NextResponse.json({ ok: true });
}

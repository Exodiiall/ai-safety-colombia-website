"use client";

import { useState } from "react";

import SeminarioHorariosGrid from "@/components/seminario-horarios-grid";
import {
  DATOS_SEMINARIO,
  MODALIDADES,
  whatsappValido,
  type SeminarioId,
} from "@/lib/seminarios-confirmar";

/* Confirmación de cupo en los seminarios, con la votación de horarios.

   La identidad y el seminario vienen firmados en el token; acá solo se pregunta
   si toma el cupo, el WhatsApp para el grupo de la cohorte, los horarios y una
   nota. Con los horarios se arman después
   cuatro cohortes: tres en el técnico, una de ellas solo en línea, y una en
   futuro y riesgos. Por eso se pide marcar en la cuadrícula todas las sesiones
   que sirvan y no escoger una. La modalidad solo se le pregunta a quien vive
   fuera de Bogotá (remoto, firmado en el token); el resto va presencial. */

const INPUT =
  "text-body-sm w-full rounded-[var(--radius)] border border-aisc-line bg-white px-3.5 py-2.5 text-aisc-ink transition-colors placeholder:text-aisc-muted/60 focus:border-aisc-forest focus:outline-2 focus:outline-offset-[1px] focus:outline-aisc-forest/35";
const TITULO = "text-display-4 md:text-display-4-lg text-balance text-aisc-ink";
const AYUDA = "text-meta mt-2 block text-aisc-muted";
const ERROR = "text-meta mt-2 block text-aisc-coral";
const ENLACE = "text-aisc-forest transition-colors hover:text-aisc-coral";
const CASILLA =
  "text-body-sm flex cursor-pointer items-start gap-3 rounded-[var(--radius)] border border-aisc-line bg-white px-4 py-4 transition-colors hover:border-aisc-forest/45 has-checked:border-aisc-forest has-checked:bg-aisc-forest/6";
const TOMA = [
  { id: "si", label: "Sí, tomo el cupo." },
  { id: "no", label: "No voy a poder esta vez." },
] as const;

type Estado = "listo" | "enviando" | "enviado" | "falla";

export default function SeminarioConfirmForm({
  token,
  nombre,
  seminario,
  remoto,
}: {
  token: string;
  nombre: string;
  seminario: SeminarioId;
  remoto: boolean;
}) {
  const d = DATOS_SEMINARIO[seminario];
  const [toma, setToma] = useState<"" | "si" | "no">("");
  const [compromiso, setCompromiso] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  const [modalidad, setModalidad] = useState("");
  const [horarios, setHorarios] = useState<string[]>([]);
  const [nota, setNota] = useState("");
  const [trampa, setTrampa] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [estado, setEstado] = useState<Estado>("listo");

  const tarjeta = "rounded-lg border border-aisc-ink bg-aisc-cream p-6 md:p-9 lg:p-11";

  function revisar(): boolean {
    const e: Record<string, string> = {};
    if (!toma) e.toma = "Dinos si tomas el cupo.";
    if (toma === "si") {
      if (!compromiso) e.compromiso = "Marca la casilla para confirmar.";
      if (!whatsapp.trim()) e.whatsapp = "Escribe tu número de WhatsApp.";
      else if (!whatsappValido(whatsapp))
        e.whatsapp = "Revisa el número: solo dígitos, con el indicativo si no es de Colombia.";
      if (remoto && !modalidad) e.modalidad = "Escoge una modalidad.";
      /* Sin horarios se puede enviar solo si la nota dice cuándo sí: es el
         caso de quien no puede en ninguno y no debería quedarse sin confirmar. */
      if (horarios.length === 0 && !nota.trim())
        e.horarios =
          "Marca al menos una sesión. Si ninguna te sirve, cuéntanos abajo cuándo sí puedes.";
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    if (estado === "enviando") return;
    if (!revisar()) return;
    setEstado("enviando");
    try {
      const respuesta = await fetch("/api/seminarios/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          toma: toma === "si",
          compromiso,
          whatsapp: toma === "si" ? whatsapp : "",
          modalidad: remoto ? modalidad : "",
          horarios,
          nota,
          website: trampa,
        }),
      });
      if (!respuesta.ok) throw new Error(String(respuesta.status));
      setEstado("enviado");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setEstado("falla");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  if (estado === "enviado") {
    return toma === "si" ? (
      <div className={tarjeta}>
        <h2 className={TITULO}>Listo. Tu cupo está confirmado.</h2>
        <p className="text-body-sm mt-4 text-aisc-ink">
          Antes del lunes 19 de octubre te escribimos con tu cohorte, el horario y el lugar. Te
          llegó al correo una copia de lo que marcaste.
        </p>
        <p className="text-meta mt-7 text-aisc-muted">
          Si quieres cambiar algo, vuelve a abrir el enlace del correo antes del cierre: la última
          respuesta reemplaza a la anterior.
        </p>
      </div>
    ) : (
      <div className={tarjeta}>
        <h2 className={TITULO}>Gracias por avisarnos.</h2>
        <p className="text-body-sm mt-4 text-aisc-ink">
          Liberamos tu cupo para otra persona. Si cambias de opinión antes del cierre, vuelve a
          abrir el enlace del correo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className={tarjeta}>
      {estado === "falla" ? (
        <p className="text-body-sm mb-8 rounded-[var(--radius)] border border-aisc-coral bg-white px-4 py-3 text-aisc-coral">
          No pudimos guardar tu respuesta. Intenta de nuevo en un minuto. Si sigue fallando,
          escríbenos a equipo@aisafetycolombia.org.
        </p>
      ) : null}

      <p className="text-meta text-aisc-muted">
        Confirmando como <span className="font-medium text-aisc-ink">{nombre}</span>
      </p>

      <div className="mt-8 space-y-10">
        <section>
          <h2 className={TITULO}>¿Tomas el cupo?</h2>
          <span className={AYUDA}>Si no puedes, avísanos igual: el cupo pasa a otra persona.</span>
          <div className="mt-4 space-y-2.5">
            {TOMA.map((opcion) => (
              <label className={CASILLA} key={opcion.id} htmlFor={`toma-${opcion.id}`}>
                <input
                  id={`toma-${opcion.id}`}
                  type="radio"
                  name="toma"
                  checked={toma === opcion.id}
                  onChange={() => setToma(opcion.id)}
                  className="mt-0.5 accent-aisc-forest"
                />
                <span>{opcion.label}</span>
              </label>
            ))}
          </div>
          {errores.toma ? <span className={ERROR}>{errores.toma}</span> : null}
        </section>

        {toma === "si" ? (
          <>
            <section>
              <h2 className={TITULO}>Tu compromiso</h2>
              <span className={AYUDA}>
                Son unas tres horas por semana: una de material por tu cuenta y dos de sesión con tu
                cohorte. Para el certificado puedes faltar a una sesión como máximo.
              </span>
              <label className={`${CASILLA} mt-4`} htmlFor="compromiso">
                <input
                  id="compromiso"
                  type="checkbox"
                  checked={compromiso}
                  onChange={(e) => setCompromiso(e.target.checked)}
                  className="mt-0.5 accent-aisc-forest"
                />
                <span>
                  Voy a las sesiones de las {d.semanas}, reviso el material antes de cada una y
                  aviso si tengo que faltar.
                </span>
              </label>
              {errores.compromiso ? <span className={ERROR}>{errores.compromiso}</span> : null}
            </section>

            <section>
              <h2 className={TITULO}>
                <label htmlFor="whatsapp">Tu WhatsApp</label>
              </h2>
              <span className={AYUDA}>
                Para el grupo de tu cohorte. Con el indicativo si tu número no es de Colombia.
              </span>
              <input
                id="whatsapp"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="300 123 4567"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                maxLength={40}
                className={`${INPUT} mt-4 max-w-sm`}
              />
              {errores.whatsapp ? <span className={ERROR}>{errores.whatsapp}</span> : null}
            </section>

            {remoto ? (
              <section>
                <h2 className={TITULO}>Modalidad</h2>
                <span className={AYUDA}>
                  Una de las cohortes es solo en línea. Las presenciales son en la Universidad de
                  los Andes, y los domingos en un café cerca, con refrigerio gratis.
                </span>
                <div className="mt-4 space-y-2.5">
                  {MODALIDADES.map((opcion) => (
                    <label className={CASILLA} key={opcion.id} htmlFor={`modalidad-${opcion.id}`}>
                      <input
                        id={`modalidad-${opcion.id}`}
                        type="radio"
                        name="modalidad"
                        checked={modalidad === opcion.id}
                        onChange={() => setModalidad(opcion.id)}
                        className="mt-0.5 accent-aisc-forest"
                      />
                      <span>{opcion.label}</span>
                    </label>
                  ))}
                </div>
                {errores.modalidad ? <span className={ERROR}>{errores.modalidad}</span> : null}
              </section>
            ) : null}

            <section>
              <h2 className={TITULO}>¿En qué horarios puedes?</h2>
              {/* Quien está fuera de Bogotá ya leyó dónde son en Modalidad. Futuro y
                  riesgos no tiene sesiones el domingo. */}
              {remoto ? null : (
                <span className={AYUDA}>
                  {seminario === "futuro"
                    ? "Las sesiones son presenciales en la Universidad de los Andes, con refrigerio gratis."
                    : "Las sesiones son presenciales en la Universidad de los Andes, y los domingos en un café cerca, con refrigerio gratis."}
                </span>
              )}
              <div className="mt-5">
                <SeminarioHorariosGrid
                  seminario={seminario}
                  marcados={horarios}
                  onChange={setHorarios}
                />
              </div>
              {errores.horarios ? <span className={ERROR}>{errores.horarios}</span> : null}
            </section>
          </>
        ) : null}

        {toma ? (
          <section>
            <h2 className={TITULO}>
              <label htmlFor="nota">¿Algo que debamos saber?</label>
            </h2>
            <span className={AYUDA}>
              {toma === "si"
                ? "Si ninguna sesión te sirve, cuéntanos cuándo sí puedes. También alergias alimentarias o lo que necesites."
                : "Opcional."}
            </span>
            <textarea
              id="nota"
              rows={4}
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              maxLength={1200}
              className={`${INPUT} mt-4`}
            />
            <p className="text-meta mt-4 text-aisc-muted">
              Lo que nos cuentes solo lo ven quienes organizan los seminarios. Así tratamos tus
              datos:{" "}
              <a className={ENLACE} href="/privacidad" target="_blank" rel="noopener noreferrer">
                política de tratamiento de datos
              </a>
              .
            </p>
          </section>
        ) : null}
      </div>

      {/* Trampa para bots: un campo que ninguna persona ve ni llena. */}
      <div aria-hidden className="hidden">
        <label htmlFor="website">No llenar</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={trampa}
          onChange={(e) => setTrampa(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={estado === "enviando"}
        className="text-body-sm mt-10 inline-flex min-h-11 items-center rounded-full bg-aisc-coral px-7 font-medium text-aisc-cream transition-colors hover:bg-aisc-coral/85 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {estado === "enviando" ? "Enviando…" : toma === "no" ? "Enviar" : "Confirmar mi cupo"}
      </button>
    </form>
  );
}

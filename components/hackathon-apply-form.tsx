"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  APART_SPRINT_URL,
  DISPONIBILIDAD_FORM,
  EQUIPO_FORM,
  TRACKS_FORM,
} from "@/app/sprint/datos";
import type { Idioma } from "@/lib/idiomas";
import { RUTA_SPRINT, TEXTOS_APLICAR } from "@/lib/textos-aplicar";

/* Borrador local: quien empieza a escribir y cierra la pestaña no pierde lo que
   llevaba. Se borra al enviar. Cada formulario lleva su propia llave para que
   uno no le pise lo escrito al otro. */
const BORRADOR = "aisc-hackathon-2026-09";
const BORRADOR_CORTO = "aisc-hackathon-2026-09-corto";

type Campos = Record<string, string>;

const VACIO: Campos = {
  firstName: "",
  lastName: "",
  email: "",
  whatsapp: "",
  linkedin: "",
  career: "",
  reason: "",
  hubProblem: "",
  hubTrack: "",
  hubTeam: "",
  hubTeamNames: "",
  hubAvailability: "",
  hubAccess: "",
  hubExtra: "",
  aiConfirm: "",
  website: "",
};

/* Los campos que no se pueden dejar en blanco. El texto con que aparece cada
   uno en el resumen de arriba está en lib/textos-aplicar.ts, en los tres
   idiomas. */
const OBLIGATORIOS_LARGO = [
  "firstName",
  "lastName",
  "email",
  "whatsapp",
  "linkedin",
  "career",
  "reason",
  "hubProblem",
  "hubTrack",
  "hubTeam",
  "hubAvailability",
  "aiConfirm",
];

/* El corto pide lo indispensable: quién es, por dónde se le escribe, dónde se
   ve su trabajo y por qué quiere venir. */
const OBLIGATORIOS_CORTO = [
  "firstName",
  "lastName",
  "email",
  "whatsapp",
  "linkedin",
  "reason",
  "hubAvailability",
  "aiConfirm",
];

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

/* WhatsApp: se acepta como lo escriba cada quien -espacios, guiones,
   parentesis- y solo se exige que queden entre siete y quince digitos, que es
   el rango de la E.164. El indicativo se pide en la ayuda, no en el formato. */
function telefonoValido(valor: string): boolean {
  const s = valor.trim();
  if (!/^\+?[\d\s().-]+$/.test(s)) return false;
  const digitos = s.replace(/\D/g, "").length;
  return digitos >= 7 && digitos <= 15;
}

const INPUT =
  "text-body-sm w-full rounded-[var(--radius)] border border-aisc-line bg-white px-3.5 py-2.5 text-aisc-ink transition-colors placeholder:text-aisc-muted/60 focus:border-aisc-forest focus:outline-2 focus:outline-offset-[1px] focus:outline-aisc-forest/35";
const INPUT_MAL =
  "border-aisc-coral focus:border-aisc-coral focus:outline-aisc-coral/35";
const ETIQUETA = "text-body-sm block font-medium text-aisc-ink";
const AYUDA = "text-meta mt-1 block text-aisc-muted";
const ERROR = "text-meta mt-1.5 block text-aisc-coral";
const SECCION = "border-t border-aisc-line pt-8 first:border-t-0 first:pt-0";
const ENLACE =
  "text-aisc-forest underline underline-offset-[3px] transition-colors hover:text-aisc-forest-deep";

function Campo({
  name,
  label,
  ayuda,
  error,
  requerido,
  opcional,
  children,
}: {
  name: string;
  label: string;
  ayuda?: string;
  error?: string;
  requerido?: boolean;
  opcional: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <label className={ETIQUETA} htmlFor={name}>
        {label}
        {requerido ? (
          <span className="text-aisc-coral"> *</span>
        ) : (
          <span className="text-aisc-muted">{opcional}</span>
        )}
      </label>
      {ayuda ? <span className={AYUDA}>{ayuda}</span> : null}
      <div className="mt-2">{children}</div>
      {error ? (
        <span className={ERROR} id={`${name}-error`} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export default function HackathonApplyForm({
  cerrado,
  idioma = "es",
  corta = false,
}: {
  cerrado: boolean;
  idioma?: Idioma;
  /** La versión corta, la que se le manda por enlace a alguien recomendado. */
  corta?: boolean;
}) {
  const t = TEXTOS_APLICAR[idioma];
  const sprint = RUTA_SPRINT[idioma];
  const OBLIGATORIOS = corta ? OBLIGATORIOS_CORTO : OBLIGATORIOS_LARGO;
  const borrador = corta ? BORRADOR_CORTO : BORRADOR;
  const [v, setV] = useState<Campos>(VACIO);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [estado, setEstado] = useState<
    "listo" | "enviando" | "enviado" | "falla"
  >("listo");
  const [faltantes, setFaltantes] = useState<string[]>([]);
  const [cargado, setCargado] = useState(false);
  const resumen = useRef<HTMLDivElement>(null);

  /* Recuperar el borrador. Va en un efecto para que el HTML del servidor y el
     del cliente coincidan en el primer render. */
  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(borrador);
      if (guardado) setV({ ...VACIO, ...(JSON.parse(guardado) as Campos) });
    } catch {
      /* si el almacenamiento está bloqueado, se sigue sin borrador */
    }
    setCargado(true);
  }, []);

  useEffect(() => {
    if (!cargado || estado === "enviado") return;
    try {
      window.localStorage.setItem(
        borrador,
        JSON.stringify({ ...v, website: "" }),
      );
    } catch {
      /* idem */
    }
  }, [v, cargado, estado]);

  const set = (name: string, valor: string) => {
    setV((prev) => ({ ...prev, [name]: valor }));
    setErrores((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
  };

  const revisar = () => {
    const nuevos: Record<string, string> = {};
    for (const campo of OBLIGATORIOS) {
      if (!v[campo]?.trim()) nuevos[campo] = t.faltaResponder;
    }
    if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) {
      nuevos.email = t.correoMal;
    }
    if (v.whatsapp.trim() && !telefonoValido(v.whatsapp)) {
      nuevos.whatsapp = t.whatsappMal;
    }
    if (v.hubTeam === "equipo" && !v.hubTeamNames.trim()) {
      nuevos.hubTeamNames = t.faltaResponder;
    }
    for (const [name, tope] of Object.entries(LIMITES)) {
      if ((v[name] ?? "").length > tope) nuevos[name] = t.limite(tope);
    }
    return nuevos;
  };

  const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (estado === "enviando") return;

    const nuevos = revisar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) {
      const pendientes = OBLIGATORIOS.filter((c) => nuevos[c]).map(
        (c) => t.falta[c],
      );
      if (nuevos.hubTeamNames) pendientes.push(t.falta.hubTeamNames);
      setFaltantes(pendientes);
      requestAnimationFrame(() =>
        resumen.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        }),
      );
      return;
    }

    setFaltantes([]);
    setEstado("enviando");
    try {
      const r = await fetch("/api/aplicar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, formato: corta ? "corto" : "largo" }),
      });
      if (!r.ok) throw new Error(String(r.status));
      try {
        window.localStorage.removeItem(borrador);
      } catch {
        /* idem */
      }
      setEstado("enviado");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setEstado("falla");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const tarjeta =
    "rounded-lg border border-aisc-ink bg-aisc-cream p-6 md:p-9 lg:p-11";

  if (cerrado) {
    return (
      <div className={tarjeta}>
        <h2 className="text-display-3 md:text-display-3-lg text-balance">
          {t.cerradoTitulo}
        </h2>
        <p className="text-body-sm mt-4 text-aisc-ink">{t.cerradoCuerpo}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a
            className="text-body-sm inline-flex min-h-11 items-center rounded-full bg-aisc-coral px-6 font-medium text-aisc-cream transition-colors hover:bg-aisc-coral/85"
            href={APART_SPRINT_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.cerradoEnLinea}
          </a>
          <Link
            className="text-body-sm inline-flex min-h-11 items-center rounded-full border border-aisc-ink px-6 font-medium text-aisc-ink transition-colors hover:bg-aisc-ink hover:text-aisc-cream"
            href={sprint}
          >
            {t.volverAlSprint}
          </Link>
        </div>
      </div>
    );
  }

  if (estado === "enviado") {
    return (
      <div className={tarjeta}>
        <h2 className="text-display-3 md:text-display-3-lg text-balance">
          {t.enviadoTitulo}
        </h2>
        <p className="text-body-sm mt-4 text-aisc-ink">{t.enviadoCuerpo1}</p>
        <p className="text-body-sm mt-3 text-aisc-ink">{t.enviadoCuerpo2}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a
            className="text-body-sm inline-flex min-h-11 items-center rounded-full bg-aisc-coral px-6 font-medium text-aisc-cream transition-colors hover:bg-aisc-coral/85"
            href="https://chat.whatsapp.com/KwE8cciX48TAVhAOHnrLaZ"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.enviadoGrupo}
          </a>
          <Link
            className="text-body-sm inline-flex min-h-11 items-center rounded-full border border-aisc-ink px-6 font-medium text-aisc-ink transition-colors hover:bg-aisc-ink hover:text-aisc-cream"
            href={sprint}
          >
            {t.volverAlSprint}
          </Link>
        </div>
      </div>
    );
  }

  const contador = (name: string) => {
    const usado = (v[name] ?? "").length;
    const tope = LIMITES[name];
    /* En el formulario corto le pedimos tres o cuatro frases: un "0 / 1500"
       debajo de la caja dice lo contrario. El contador aparece solo cuando de
       verdad falta poco para el tope. */
    if (corta && usado < tope * 0.6) return null;
    return (
      <span
        className={`text-meta mt-1 block text-right tabular-nums ${usado > tope ? "text-aisc-coral" : "text-aisc-muted"}`}
      >
        {usado} / {tope}
      </span>
    );
  };

  const areaProps = (name: string, rows: number) => ({
    id: name,
    name,
    rows,
    value: v[name],
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      set(name, e.target.value),
    className: `${INPUT} resize-y ${errores[name] ? INPUT_MAL : ""}`,
    "aria-invalid": errores[name] ? true : undefined,
    "aria-describedby": errores[name] ? `${name}-error` : undefined,
  });

  const textProps = (name: string, tipo = "text", extra = 200) => ({
    id: name,
    name,
    type: tipo,
    maxLength: extra,
    value: v[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      set(name, e.target.value),
    className: `${INPUT} ${errores[name] ? INPUT_MAL : ""}`,
    "aria-invalid": errores[name] ? true : undefined,
    "aria-describedby": errores[name] ? `${name}-error` : undefined,
  });

  return (
    <form className={tarjeta} noValidate onSubmit={enviar}>
      {estado === "falla" ? (
        <div className="mb-8 rounded-[var(--radius)] border border-aisc-coral bg-aisc-coral/8 p-5">
          <p className="text-body-sm text-aisc-ink">
            {t.fallaAntes}
            <a className={ENLACE} href="mailto:equipo@aisafetycolombia.org">
              equipo@aisafetycolombia.org
            </a>
            {t.fallaDespues}
          </p>
        </div>
      ) : null}

      <div aria-live="polite" ref={resumen}>
        {faltantes.length > 0 ? (
          <div className="mb-8 rounded-[var(--radius)] border border-aisc-coral bg-aisc-coral/8 p-5">
            <p className="text-body-sm font-medium text-aisc-ink">
              {t.resumenTitulo}
            </p>
            <ul className="text-body-sm mt-2 list-disc pl-5 text-aisc-ink">
              {faltantes.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {/* trampa para robots: si viene llena, la aplicación se descarta */}
      <div
        aria-hidden="true"
        className="absolute h-px w-px overflow-hidden opacity-0"
      >
        <label htmlFor="website">{t.trampa}</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={v.website}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-9">
        {corta ? (
          <>
          <section className={SECCION}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Campo
                opcional={t.opcional}
                requerido
                name="firstName"
                label={t.nombre}
                error={errores.firstName}
              >
                <input
                  {...textProps("firstName", "text", 100)}
                  autoComplete="given-name"
                />
              </Campo>
              <Campo
                opcional={t.opcional}
                requerido
                name="lastName"
                label={t.apellidos}
                error={errores.lastName}
              >
                <input
                  {...textProps("lastName", "text", 100)}
                  autoComplete="family-name"
                />
              </Campo>
              <Campo
                opcional={t.opcional}
                requerido
                name="email"
                label={t.correo}
                ayuda={t.correoAyuda}
                error={errores.email}
              >
                <input
                  {...textProps("email", "email", 200)}
                  autoComplete="email"
                />
              </Campo>
              <Campo
                opcional={t.opcional}
                requerido
                name="whatsapp"
                label={t.whatsapp}
                ayuda={t.whatsappAyuda}
                error={errores.whatsapp}
              >
                <input
                  {...textProps("whatsapp", "tel", 40)}
                  autoComplete="tel"
                  placeholder="+57 300 123 4567"
                />
              </Campo>
              <Campo
                opcional={t.opcional}
                requerido
                name="linkedin"
                label={t.linkedin}
                ayuda={t.linkedinAyuda}
                error={errores.linkedin}
              >
                <input
                  {...textProps("linkedin", "url", 300)}
                  placeholder="https://linkedin.com/in/..."
                />
              </Campo>
            </div>
          </section>

          <section className={SECCION}>
            <Campo
              opcional={t.opcional}
              requerido
              name="reason"
              label={t.motivo}
              ayuda={t.motivoCortoAyuda}
              error={errores.reason}
            >
              <textarea {...areaProps("reason", 5)} />
              {contador("reason")}
            </Campo>
            <Campo
              opcional={t.opcional}
              name="hubAccess"
              label={t.acceso}
              ayuda={t.accesoAyuda}
              error={errores.hubAccess}
            >
              <textarea {...areaProps("hubAccess", 3)} />
              {contador("hubAccess")}
            </Campo>
          </section>
          </>
        ) : (
          <>
          <section className={SECCION}>
            <h2 className="text-display-3 md:text-display-3-lg text-balance">
              {t.seccionBasicos}
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <Campo
                opcional={t.opcional}
                requerido
                name="firstName"
                label={t.nombre}
                error={errores.firstName}
              >
                <input
                  {...textProps("firstName", "text", 100)}
                  autoComplete="given-name"
                />
              </Campo>
              <Campo
                opcional={t.opcional}
                requerido
                name="lastName"
                label={t.apellidos}
                error={errores.lastName}
              >
                <input
                  {...textProps("lastName", "text", 100)}
                  autoComplete="family-name"
                />
              </Campo>
              <Campo
                opcional={t.opcional}
                requerido
                name="email"
                label={t.correo}
                ayuda={t.correoAyuda}
                error={errores.email}
              >
                <input
                  {...textProps("email", "email", 200)}
                  autoComplete="email"
                />
              </Campo>
              <Campo
                opcional={t.opcional}
                requerido
                name="whatsapp"
                label={t.whatsapp}
                ayuda={t.whatsappAyuda}
                error={errores.whatsapp}
              >
                <input
                  {...textProps("whatsapp", "tel", 40)}
                  autoComplete="tel"
                  placeholder="+57 300 123 4567"
                />
              </Campo>
              <Campo
                opcional={t.opcional}
                requerido
                name="linkedin"
                label={t.linkedin}
                ayuda={t.linkedinAyuda}
                error={errores.linkedin}
              >
                <input
                  {...textProps("linkedin", "url", 300)}
                  placeholder="https://linkedin.com/in/..."
                />
              </Campo>
            </div>
          </section>

          <section className={SECCION}>
            <h2 className="text-display-3 md:text-display-3-lg text-balance">
              {t.seccionTrayectoria}
            </h2>
            <p className="text-body-sm mt-3 max-w-[640px] text-aisc-muted">
              {t.trayectoriaNota}
            </p>
            <div className="mt-6 flex flex-col gap-6">
              <Campo
                opcional={t.opcional}
                requerido
                name="career"
                label={t.carrera}
                ayuda={t.carreraAyuda}
                error={errores.career}
              >
                <textarea {...areaProps("career", 3)} />
                {contador("career")}
              </Campo>
              <Campo
                opcional={t.opcional}
                requerido
                name="reason"
                label={t.motivo}
                ayuda={t.motivoAyuda}
                error={errores.reason}
              >
                <textarea {...areaProps("reason", 5)} />
                {contador("reason")}
              </Campo>
            </div>
          </section>

          <section className={SECCION}>
            <h2 className="text-display-3 md:text-display-3-lg text-balance">
              {t.seccionSeleccion}
            </h2>
            <p className="text-body-sm mt-3 max-w-[640px] text-aisc-muted">
              {t.seleccionNota}
            </p>
            <p className="text-body-sm mt-2 max-w-[640px] text-aisc-muted">
              {t.ejemplosAntes}
              <a
                className={ENLACE}
                href={APART_SPRINT_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.ejemplosEnlace}
              </a>
              {t.ejemplosDespues}
            </p>
            <div className="mt-6 flex flex-col gap-6">
              <Campo
                opcional={t.opcional}
                requerido
                name="hubProblem"
                label={t.problema}
                ayuda={t.problemaAyuda}
                error={errores.hubProblem}
              >
                <textarea {...areaProps("hubProblem", 8)} />
                {contador("hubProblem")}
              </Campo>

              <fieldset>
                <legend className={ETIQUETA}>
                  {t.frente}
                  <span className="text-aisc-coral"> *</span>
                </legend>
                <span className={AYUDA}>{t.frenteAyuda}</span>
                <div className="mt-3 flex flex-col gap-2">
                  {TRACKS_FORM.map((opcion) => (
                    <label
                      className="text-body-sm flex cursor-pointer items-start gap-3 rounded-[var(--radius)] border border-aisc-line bg-white px-3.5 py-2.5 transition-colors hover:border-aisc-forest/45 has-checked:border-aisc-forest has-checked:bg-aisc-forest/6"
                      key={opcion.id}
                    >
                      <input
                        type="radio"
                        name="hubTrack"
                        value={opcion.id}
                        checked={v.hubTrack === opcion.id}
                        onChange={() => set("hubTrack", opcion.id)}
                        className="mt-0.5 accent-aisc-forest"
                      />
                      <span>{t.tracks[opcion.id]}</span>
                    </label>
                  ))}
                </div>
                {errores.hubTrack ? (
                  <span className={ERROR} role="alert">
                    {errores.hubTrack}
                  </span>
                ) : null}
              </fieldset>

              <fieldset>
                <legend className={ETIQUETA}>
                  {t.equipo}
                  <span className="text-aisc-coral"> *</span>
                </legend>
                <span className={AYUDA}>{t.equipoAyuda}</span>
                <div className="mt-3 flex flex-col gap-2">
                  {EQUIPO_FORM.map((opcion) => (
                    <label
                      className="text-body-sm flex cursor-pointer items-start gap-3 rounded-[var(--radius)] border border-aisc-line bg-white px-3.5 py-2.5 transition-colors hover:border-aisc-forest/45 has-checked:border-aisc-forest has-checked:bg-aisc-forest/6"
                      key={opcion.id}
                    >
                      <input
                        type="radio"
                        name="hubTeam"
                        value={opcion.id}
                        checked={v.hubTeam === opcion.id}
                        onChange={() => set("hubTeam", opcion.id)}
                        className="mt-0.5 accent-aisc-forest"
                      />
                      <span>{t.equipos[opcion.id]}</span>
                    </label>
                  ))}
                </div>
                {errores.hubTeam ? (
                  <span className={ERROR} role="alert">
                    {errores.hubTeam}
                  </span>
                ) : null}
              </fieldset>

              {v.hubTeam === "equipo" ? (
                <Campo
                  opcional={t.opcional}
                  requerido
                  name="hubTeamNames"
                  label={t.companeros}
                  ayuda={t.companerosAyuda}
                  error={errores.hubTeamNames}
                >
                  <textarea {...areaProps("hubTeamNames", 4)} />
                  {contador("hubTeamNames")}
                </Campo>
              ) : null}
            </div>
          </section>

          <section className={SECCION}>
            <h2 className="text-display-3 md:text-display-3-lg text-balance">
              {t.seccionServir}
            </h2>
            <div className="mt-6 flex flex-col gap-6">
              <Campo
                opcional={t.opcional}
                name="hubAccess"
                label={t.acceso}
                ayuda={t.accesoAyuda}
                error={errores.hubAccess}
              >
                <textarea {...areaProps("hubAccess", 3)} />
                {contador("hubAccess")}
              </Campo>
              <Campo
                opcional={t.opcional}
                name="hubExtra"
                label={t.extra}
                ayuda={t.extraAyuda}
                error={errores.hubExtra}
              >
                <textarea {...areaProps("hubExtra", 3)} />
                {contador("hubExtra")}
              </Campo>
            </div>
          </section>
          </>
        )}

        {/* Los tres dias completos son la condicion del fin de semana, asi que
            la pregunta va en los dos formularios. */}
        <section className={SECCION}>
          <fieldset>
            <legend className={ETIQUETA}>
              {t.disponibilidad}
              <span className="text-aisc-coral"> *</span>
            </legend>
            <span className={AYUDA}>{t.disponibilidadAyuda}</span>
            <div className="mt-3 flex flex-col gap-2">
              {DISPONIBILIDAD_FORM.map((opcion) => (
                <label
                  className="text-body-sm flex cursor-pointer items-start gap-3 rounded-[var(--radius)] border border-aisc-line bg-white px-3.5 py-2.5 transition-colors hover:border-aisc-forest/45 has-checked:border-aisc-forest has-checked:bg-aisc-forest/6"
                  key={opcion.id}
                >
                  <input
                    type="radio"
                    name="hubAvailability"
                    value={opcion.id}
                    checked={v.hubAvailability === opcion.id}
                    onChange={() => set("hubAvailability", opcion.id)}
                    className="mt-0.5 accent-aisc-forest"
                  />
                  <span>{t.disponibilidades[opcion.id]}</span>
                </label>
              ))}
            </div>
            {errores.hubAvailability ? (
              <span className={ERROR} role="alert">
                {errores.hubAvailability}
              </span>
            ) : null}
          </fieldset>
        </section>

        <section className={SECCION}>
          <h2 className="text-display-3 md:text-display-3-lg text-balance">
            {t.seccionAntes}
          </h2>
          <label
            className="text-body-sm mt-6 flex cursor-pointer items-start gap-3 rounded-[var(--radius)] border border-aisc-line bg-white px-4 py-4 transition-colors hover:border-aisc-forest/45 has-checked:border-aisc-forest has-checked:bg-aisc-forest/6"
            htmlFor="aiConfirm"
          >
            <input
              id="aiConfirm"
              name="aiConfirm"
              type="checkbox"
              checked={v.aiConfirm === "si"}
              onChange={(e) => set("aiConfirm", e.target.checked ? "si" : "")}
              className="mt-0.5 accent-aisc-forest"
            />
            <span>{t.confirmacionIA}</span>
          </label>
          {errores.aiConfirm ? (
            <span className={ERROR} role="alert">
              {errores.aiConfirm}
            </span>
          ) : null}
          <p className="text-meta mt-4 text-aisc-muted">
            {corta ? t.privacidadCortaAntes : t.privacidadAntes}
            <a className={ENLACE} href="mailto:equipo@aisafetycolombia.org">
              equipo@aisafetycolombia.org
            </a>
            {t.privacidadDespues}
          </p>
        </section>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-aisc-line pt-8">
        <button
          className="text-body-sm inline-flex min-h-11 items-center rounded-full bg-aisc-coral px-7 font-medium text-aisc-cream transition-colors hover:bg-aisc-coral/85 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={estado === "enviando"}
          type="submit"
        >
          {estado === "enviando" ? t.enviando : t.enviar}
        </button>
        <span className="text-meta text-aisc-muted">{t.guardado}</span>
      </div>
    </form>
  );
}

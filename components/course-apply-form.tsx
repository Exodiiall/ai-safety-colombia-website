"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Idioma } from "@/lib/idiomas";
import {
  AREAS,
  CURSOS,
  ETAPAS,
  FORMATOS,
  LIMITES_CURSOS as LIMITES,
  PREGUNTAS,
  RUTA_UNETE,
  TEXTOS_CURSOS,
  obligatorios,
  type CursoId,
} from "@/lib/cursos";
import { RUTA_POLITICA, TEXTOS_POLITICA } from "@/lib/politica-datos";

/* Borrador local, igual que en el formulario del sprint: quien cierra la
   pestaña a mitad de camino no pierde lo que llevaba. Se borra al enviar. */
const BORRADOR = "aisc-cursos-2026-10";

type Campos = Record<string, string>;

const VACIO: Campos = {
  course: "",
  format: "",
  altPlacement: "",
  firstName: "",
  lastName: "",
  email: "",
  profileUrl: "",
  otherProfile: "",
  fields: "",
  careerStage: "",
  careerDetail: "",
  hours: "",
  qPlan: "",
  qEngagement: "",
  qSkills: "",
  qAchievement: "",
  qTradeoff: "",
  source: "",
  nominee: "",
  mentionName: "",
  feedback: "",
  /* La casilla de autorización de datos. No se guarda en el borrador: quien
     vuelve tiene que marcarla otra vez, con el texto a la vista. */
  authorization: "",
  website: "",
};

const INPUT =
  "text-body-sm w-full rounded-[var(--radius)] border border-aisc-line bg-white px-3.5 py-2.5 text-aisc-ink transition-colors placeholder:text-aisc-muted/60 focus:border-aisc-forest focus:outline-2 focus:outline-offset-[1px] focus:outline-aisc-forest/35";
const INPUT_MAL =
  "border-aisc-coral focus:border-aisc-coral focus:outline-aisc-coral/35";
const ETIQUETA = "text-body-sm block font-medium text-aisc-ink";
/* La flecha de los menús desplegables, dibujada a mano para que se vea igual
   en todos los navegadores. */
const FLECHA = "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%235a5044%22><path d=%22M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z%22/></svg>";
const SELECT = "cursor-pointer appearance-none bg-[length:18px_18px] bg-[position:right_12px_center] bg-no-repeat pr-10";
const AYUDA = "text-meta mt-1 block text-aisc-muted";
const ERROR = "text-meta mt-1.5 block text-aisc-coral";
const SECCION = "border-t border-aisc-line pt-8 first:border-t-0 first:pt-0";
const ENLACE =
  "text-aisc-forest transition-colors hover:text-aisc-coral";
const OPCION =
  "text-body-sm flex cursor-pointer items-start gap-3 rounded-[var(--radius)] border border-aisc-line bg-white px-3.5 py-2.5 transition-colors hover:border-aisc-forest/45 has-checked:border-aisc-forest has-checked:bg-aisc-forest/6";
const BOTON_LLENO =
  "text-body-sm inline-flex min-h-11 items-center rounded-full bg-aisc-coral px-6 font-medium text-aisc-cream transition-colors hover:bg-aisc-coral/85";
const BOTON_CONTORNO =
  "text-body-sm inline-flex min-h-11 items-center rounded-full border border-aisc-ink px-6 font-medium text-aisc-ink transition-colors hover:bg-aisc-ink hover:text-aisc-cream";
const WHATSAPP = "https://chat.whatsapp.com/KhjJqDNVviK3aX5S4q79EF";

/* Un menú desplegable propio, para que la lista se vea igual en todos los
   navegadores. Con `tope` mayor que 1 se marcan varias opciones y las marcadas
   se ven como pastillas en el botón; con `tope` 1 se escoge una sola, se ve
   como texto y el panel se cierra al escogerla. También se cierra con Escape o
   al hacer clic afuera. */
function Menu({
  id,
  name,
  opciones,
  etiqueta,
  elegidas,
  tope,
  alternar,
  vacio,
  invalido,
}: {
  id: string;
  name: string;
  opciones: readonly string[];
  etiqueta: (id: string) => string;
  elegidas: string[];
  tope: number;
  alternar: (id: string) => void;
  vacio: string;
  invalido: boolean;
}) {
  const [abierto, setAbierto] = useState(false);
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => {
      if (!caja.current?.contains(e.target as Node)) setAbierto(false);
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    document.addEventListener("pointerdown", fuera);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("pointerdown", fuera);
      document.removeEventListener("keydown", tecla);
    };
  }, [abierto]);

  const una = tope === 1;
  const lleno = elegidas.length >= tope;
  const escoger = (o: string) => {
    alternar(o);
    if (una) setAbierto(false);
  };

  return (
    <div ref={caja} className="relative">
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={abierto}
        aria-invalid={invalido ? true : undefined}
        onClick={() => setAbierto((a) => !a)}
        style={{ backgroundImage: `url("${FLECHA}")` }}
        className={`${INPUT} ${SELECT} ${invalido ? INPUT_MAL : ""} flex min-h-11 flex-wrap items-center gap-1.5 text-left`}
      >
        {elegidas.length === 0 ? (
          <span className="text-aisc-muted/60">{vacio}</span>
        ) : una ? (
          <span>{etiqueta(elegidas[0])}</span>
        ) : (
          elegidas.map((e) => (
            <span key={e} className="text-meta rounded-full bg-aisc-forest/8 px-2.5 py-0.5 text-aisc-forest">
              {etiqueta(e)}
            </span>
          ))
        )}
      </button>
      {abierto ? (
        <ul
          role="listbox"
          aria-multiselectable={una ? undefined : true}
          className="absolute top-full left-0 z-20 mt-1.5 max-h-72 w-full overflow-y-auto rounded-[var(--radius)] border border-aisc-line bg-white p-1.5 shadow-[0_16px_40px_-12px_rgba(33,26,18,0.25)]"
        >
          {opciones.map((o) => {
            const marcada = elegidas.includes(o);
            const bloqueada = !una && !marcada && lleno;
            return (
              <li key={o} role="option" aria-selected={marcada}>
                <label
                  className={`text-body-sm flex items-start gap-3 rounded-[10px] px-3 py-2 ${
                    bloqueada ? "cursor-not-allowed text-aisc-muted/60" : "cursor-pointer hover:bg-aisc-forest/6"
                  }${marcada ? " bg-aisc-forest/6" : ""}`}
                >
                  <input
                    type={una ? "radio" : "checkbox"}
                    name={name}
                    value={o}
                    checked={marcada}
                    disabled={bloqueada}
                    onChange={() => escoger(o)}
                    className="mt-0.5 accent-aisc-forest"
                  />
                  <span>{etiqueta(o)}</span>
                </label>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

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
  ayuda?: React.ReactNode;
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
      {ayuda ? <div className={AYUDA}>{ayuda}</div> : null}
      <div className="mt-2">{children}</div>
      {error ? (
        <span className={ERROR} id={`${name}-error`} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

function Grupo({
  label,
  ayuda,
  error,
  children,
}: {
  label: string;
  ayuda?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className={ETIQUETA}>
        {label}
        <span className="text-aisc-coral"> *</span>
      </legend>
      {ayuda ? <span className={AYUDA}>{ayuda}</span> : null}
      <div className="mt-3 flex flex-col gap-2">{children}</div>
      {error ? (
        <span className={ERROR} role="alert">
          {error}
        </span>
      ) : null}
    </fieldset>
  );
}

const urlValida = (s: string) => /^https?:\/\/\S+\.\S+/.test(s.trim());

export default function CourseApplyForm({
  cerrado,
  idioma = "es",
  cursoInicial,
}: {
  cerrado: boolean;
  idioma?: Idioma;
  /** El curso que llega por `?curso=` desde la página de Únete. */
  cursoInicial?: CursoId;
}) {
  const t = TEXTOS_CURSOS[idioma];
  const tp = TEXTOS_POLITICA[idioma];
  const [v, setV] = useState<Campos>({ ...VACIO, course: cursoInicial ?? "" });
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [estado, setEstado] = useState<
    "listo" | "enviando" | "enviado" | "falla"
  >("listo");
  const [faltantes, setFaltantes] = useState<string[]>([]);
  const [cargado, setCargado] = useState(false);
  const resumen = useRef<HTMLDivElement>(null);

  /* Recuperar el borrador. El curso de la URL gana sobre el del borrador:
     si alguien vuelve desde el botón del otro curso, es porque cambió de idea. */
  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(BORRADOR);
      if (guardado) {
        const previo = JSON.parse(guardado) as Campos;
        setV({
          ...VACIO,
          ...previo,
          authorization: "",
          course: cursoInicial ?? previo.course ?? "",
        });
      }
    } catch {
      /* si el almacenamiento está bloqueado, se sigue sin borrador */
    }
    setCargado(true);
  }, [cursoInicial]);

  useEffect(() => {
    if (!cargado || estado === "enviado") return;
    try {
      window.localStorage.setItem(
        BORRADOR,
        JSON.stringify({ ...v, website: "", authorization: "" }),
      );
    } catch {
      /* idem */
    }
  }, [v, cargado, estado]);

  const set = (name: string, valor: string) => {
    setV((prev) => ({ ...prev, [name]: valor }));
    setErrores((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
  };

  const curso = (CURSOS as string[]).includes(v.course)
    ? (v.course as CursoId)
    : null;
  const areas = v.fields ? v.fields.split(",") : [];

  const alternarArea = (id: string) => {
    const nuevas = areas.includes(id)
      ? areas.filter((a) => a !== id)
      : [...areas, id];
    set("fields", nuevas.join(","));
  };

  /* Lo que se valida depende del curso: AGI Strategy pregunta las horas y la
     tensión más difícil, Technical AI Safety no. */
  const requeridos = () => obligatorios(curso ?? "agi-strategy");

  const revisar = () => {
    const nuevos: Record<string, string> = {};
    const valor = (c: string) => v[c]?.trim();
    for (const campo of requeridos()) {
      if (!valor(campo)) nuevos[campo] = t.faltaResponder;
    }
    if (v.authorization !== "si") nuevos.authorization = tp.casillaFalta;
    if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) {
      nuevos.email = t.correoMal;
    }
    if (v.profileUrl.trim() && !urlValida(v.profileUrl)) {
      nuevos.profileUrl = t.urlMal;
    }
    if (areas.length > 3) nuevos.fields = t.maxTres;
    if (v.careerStage === "other" && !v.careerDetail.trim()) {
      nuevos.careerDetail = t.faltaResponder;
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
    if (Object.keys(nuevos).some((k) => nuevos[k])) {
      const pendientes = requeridos()
        .filter((c) => nuevos[c])
        .map((c) => (c === "authorization" ? tp.faltaCasilla : t.falta[c]));
      if (nuevos.careerDetail) pendientes.push(t.falta.careerStage);
      setFaltantes(pendientes.length ? pendientes : [t.faltaResponder]);
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
      const r = await fetch("/api/cursos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, locale: idioma }),
      });
      if (!r.ok) throw new Error(String(r.status));
      try {
        window.localStorage.removeItem(BORRADOR);
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

  if (cerrado || estado === "enviado") {
    return (
      <div className={tarjeta}>
        <h2 className="text-display-3 md:text-display-3-lg text-balance">
          {cerrado ? t.cerradoTitulo : t.enviadoTitulo}
        </h2>
        <p className="text-body-sm mt-4 text-aisc-ink">
          {cerrado ? t.cerradoCuerpo : t.enviadoCuerpo}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a
            className={BOTON_LLENO}
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.enviadoGrupo}
          </a>
          <Link className={BOTON_CONTORNO} href={RUTA_UNETE[idioma]}>
            {t.volver}
          </Link>
        </div>
      </div>
    );
  }

  const contador = (name: string) => {
    const usado = (v[name] ?? "").length;
    const tope = LIMITES[name];
    if (usado < tope * 0.6) return null;
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

  const textProps = (name: string, tipo = "text") => ({
    id: name,
    name,
    type: tipo,
    maxLength: LIMITES[name],
    value: v[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      set(name, e.target.value),
    className: `${INPUT} ${errores[name] ? INPUT_MAL : ""}`,
    "aria-invalid": errores[name] ? true : undefined,
    "aria-describedby": errores[name] ? `${name}-error` : undefined,
  });

  const radios = (
    name: string,
    opciones: readonly string[],
    etiqueta: (id: string) => string,
  ) =>
    opciones.map((id) => (
      <label className={OPCION} key={id}>
        <input
          type="radio"
          name={name}
          value={id}
          checked={v[name] === id}
          onChange={() => set(name, id)}
          className="mt-0.5 accent-aisc-forest"
        />
        <span>{etiqueta(id)}</span>
      </label>
    ));

  const casilla = (name: string, texto: string) => (
    <label className={OPCION} key={name}>
      <input
        type="checkbox"
        name={name}
        checked={v[name] === "si"}
        onChange={(e) => set(name, e.target.checked ? "si" : "")}
        className="mt-0.5 accent-aisc-forest"
      />
      <span>{texto}</span>
    </label>
  );

  const ayudaPregunta = (id: string) => {
    if (!curso) return null;
    const p = t.preguntas[curso][id];
    if (!p.ayuda && !p.puntos) return null;
    return (
      <>
        {p.ayuda ? <span className="block">{p.ayuda}</span> : null}
        {p.puntos ? (
          <ul className="mt-1 list-disc pl-5">
            {p.puntos.map((punto) => (
              <li key={punto}>{punto}</li>
            ))}
          </ul>
        ) : null}
        {p.cierre ? <span className="mt-1 block">{p.cierre}</span> : null}
      </>
    );
  };

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
        <section className={SECCION}>
          <h2 className="text-display-3 md:text-display-3-lg text-balance">
            {t.seccionCurso}
          </h2>
          <div className="mt-6 flex flex-col gap-6">
            <Grupo label={t.curso} error={errores.course}>
              {CURSOS.map((id) => (
                <label className={OPCION} key={id}>
                  <input
                    type="radio"
                    name="course"
                    value={id}
                    checked={v.course === id}
                    onChange={() => set("course", id)}
                    className="mt-0.5 accent-aisc-forest"
                  />
                  <span>
                    <span className="font-medium">{t.nombreCurso[id]}</span>
                    <span className="block text-aisc-muted">
                      {t.resumenCurso[id]}
                    </span>
                  </span>
                </label>
              ))}
            </Grupo>

            {curso === "technical-ai-safety" ? (
              <div className="rounded-[var(--radius)] border border-aisc-line bg-white/60 p-5">
                <p className="text-body-sm font-medium text-aisc-ink">
                  {t.prerrequisitoTitulo}
                </p>
                <ul className="text-body-sm mt-2 list-disc pl-5 text-aisc-ink">
                  {t.prerrequisitos.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <p className="text-body-sm mt-2 text-aisc-muted">
                  {t.prerrequisitoCierre}
                </p>
              </div>
            ) : null}

            <Grupo label={t.formato} ayuda={t.formatoAyuda} error={errores.format}>
              {radios("format", FORMATOS, (id) =>
                t.formatos[id as (typeof FORMATOS)[number]],
              )}
            </Grupo>

            {curso === "technical-ai-safety" ? (
              <div>{casilla("altPlacement", t.alternativaCheck)}</div>
            ) : null}
          </div>
        </section>

        <section className={SECCION}>
          <h2 className="text-display-3 md:text-display-3-lg text-balance">
            {t.seccionTu}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Campo
              opcional={t.opcional}
              requerido
              name="firstName"
              label={t.nombre}
              error={errores.firstName}
            >
              <input {...textProps("firstName")} autoComplete="given-name" />
            </Campo>
            <Campo
              opcional={t.opcional}
              requerido
              name="lastName"
              label={t.apellido}
              error={errores.lastName}
            >
              <input {...textProps("lastName")} autoComplete="family-name" />
            </Campo>
            <Campo
              opcional={t.opcional}
              requerido
              name="email"
              label={t.correo}
              error={errores.email}
            >
              <input {...textProps("email", "email")} autoComplete="email" />
            </Campo>
            <Campo
              opcional={t.opcional}
              requerido
              name="profileUrl"
              label={t.perfil}
              ayuda={t.perfilAyuda}
              error={errores.profileUrl}
            >
              <input
                {...textProps("profileUrl", "url")}
                placeholder="https://linkedin.com/in/..."
              />
            </Campo>
            <Campo
              opcional={t.opcional}
              name="otherProfile"
              label={t.otroPerfil}
              ayuda={t.otroPerfilAyuda}
              error={errores.otherProfile}
            >
              <input {...textProps("otherProfile", "url")} />
            </Campo>
          </div>

          <div className="mt-6 flex flex-col gap-6">
            <Campo
              opcional={t.opcional}
              requerido
              name="fields"
              label={t.areas}
              ayuda={t.areasAyuda}
              error={errores.fields}
            >
              <Menu
                id="fields"
                name="fields"
                opciones={AREAS}
                etiqueta={(id) => t.areasOpciones[id as (typeof AREAS)[number]]}
                elegidas={areas}
                tope={3}
                alternar={alternarArea}
                vacio={t.escogerVarias}
                invalido={Boolean(errores.fields)}
              />
            </Campo>

            <Campo
              opcional={t.opcional}
              requerido
              name="careerStage"
              label={t.etapa}
              error={errores.careerStage}
            >
              <Menu
                id="careerStage"
                name="careerStage"
                opciones={ETAPAS}
                etiqueta={(id) => t.etapas[id as (typeof ETAPAS)[number]]}
                elegidas={v.careerStage ? [v.careerStage] : []}
                tope={1}
                alternar={(id) => set("careerStage", id)}
                vacio={t.escoger}
                invalido={Boolean(errores.careerStage)}
              />
            </Campo>
            {v.careerStage === "other" ? (
              <Campo
                opcional={t.opcional}
                requerido
                name="careerDetail"
                label={t.etapaDetalle}
                error={errores.careerDetail}
              >
                <input {...textProps("careerDetail")} />
              </Campo>
            ) : null}

            {curso !== "technical-ai-safety" ? (
              <Campo
                opcional={t.opcional}
                requerido
                name="hours"
                label={t.horas}
                ayuda={t.horasAyuda}
                error={errores.hours}
              >
                <input {...textProps("hours")} className={`${INPUT} max-w-[220px] ${errores.hours ? INPUT_MAL : ""}`} />
              </Campo>
            ) : null}
          </div>
        </section>

        <section className={SECCION}>
          <h2 className="text-display-3 md:text-display-3-lg text-balance">
            {t.seccionMotivacion}
          </h2>
          <p className="text-body-sm mt-3 max-w-[640px] text-aisc-muted">
            {t.sinIA}
          </p>
          <div className="mt-6 flex flex-col gap-6">
            {PREGUNTAS[curso ?? "agi-strategy"].map((id) => (
              <Campo
                key={id}
                opcional={t.opcional}
                requerido
                name={id}
                label={t.preguntas[curso ?? "agi-strategy"][id].label}
                ayuda={ayudaPregunta(id)}
                error={errores[id]}
              >
                <textarea {...areaProps(id, 6)} />
                {contador(id)}
              </Campo>
            ))}
          </div>
        </section>

        <section className={SECCION}>
          <h2 className="text-display-3 md:text-display-3-lg text-balance">
            {t.seccionCierre}
          </h2>
          <div className="mt-6 flex flex-col gap-6">
            <Campo
              opcional={t.opcional}
              requerido
              name="source"
              label={t.fuente}
              ayuda={
                <>
                  <span className="block">{t.fuenteAyuda}</span>
                  <ul className="mt-1 list-disc pl-5">
                    {t.fuenteEjemplos.map((ej) => (
                      <li key={ej}>{ej}</li>
                    ))}
                  </ul>
                </>
              }
              error={errores.source}
            >
              <textarea {...areaProps("source", 2)} />
            </Campo>
            <Campo
              opcional={t.opcional}
              requerido
              name="nominee"
              label={t.nominado}
              ayuda={t.nominadoAyuda}
              error={errores.nominee}
            >
              <textarea {...areaProps("nominee", 2)} />
            </Campo>
            <Grupo label={t.mencion} error={errores.mentionName}>
              {radios("mentionName", ["si", "no"], (id) =>
                id === "si" ? t.si : t.no,
              )}
            </Grupo>
            <Campo
              opcional={t.opcional}
              name="feedback"
              label={t.comentarios}
              ayuda={t.comentariosAyuda}
              error={errores.feedback}
            >
              <textarea {...areaProps("feedback", 3)} />
            </Campo>
          </div>
          <p className="text-meta mt-6 text-aisc-muted">
            {t.privacidadAntes}
            <a className={ENLACE} href="mailto:equipo@aisafetycolombia.org">
              equipo@aisafetycolombia.org
            </a>
            {t.privacidadDespues}
          </p>
          <div className="mt-4">
            <label className={OPCION}>
              <input
                type="checkbox"
                name="authorization"
                checked={v.authorization === "si"}
                onChange={(e) => set("authorization", e.target.checked ? "si" : "")}
                className="mt-0.5 accent-aisc-forest"
              />
              <span>
                {tp.casilla}
                <a
                  className={ENLACE}
                  href={RUTA_POLITICA[idioma]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tp.casillaEnlace}
                </a>
                .<span className="text-aisc-coral"> *</span>
              </span>
            </label>
            {errores.authorization ? (
              <span className={ERROR} role="alert">
                {errores.authorization}
              </span>
            ) : null}
          </div>
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

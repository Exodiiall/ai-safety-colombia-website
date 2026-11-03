"use client";

import Link from "next/link";
import styles from "./defacc.module.css";
import { useEffect, useState } from "react";
import type { Idioma } from "@/lib/idiomas";
import { rutaEn } from "@/lib/idiomas";
import { RUTA_POLITICA, TEXTOS_POLITICA } from "@/lib/politica-datos";

const BORRADOR_KEY = "aisc-defacc-2026-11-draft";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  documentType: string;
  documentNumber: string;
  affiliation: string;
  careerRole: string;
  experienceLevel: string;
  linkedin: string;
  githubPortfolio: string;
  teamMode: string;
  teamMembers: string;
  preferredTrack: string;
  projectIdea: string;
  dietaryRestrictions: string;
  dietaryDetail: string;
  availability: string;
  authorization: string;
  website: string; // Honeypot
};

const VACIO: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  whatsapp: "",
  documentType: "CC",
  documentNumber: "",
  affiliation: "",
  careerRole: "",
  experienceLevel: "intermedio",
  linkedin: "",
  githubPortfolio: "",
  teamMode: "individual",
  teamMembers: "",
  preferredTrack: "track-1",
  projectIdea: "",
  dietaryRestrictions: "ninguna",
  dietaryDetail: "",
  availability: "",
  authorization: "",
  website: "",
};

const INPUT =
  "text-body-sm w-full rounded-[var(--radius)] border border-aisc-line bg-white px-3.5 py-2.5 text-aisc-ink transition-colors placeholder:text-aisc-muted/60 focus:border-aisc-forest focus:outline-2 focus:outline-offset-[1px] focus:outline-aisc-forest/35";
const ETIQUETA = "text-body-sm block font-medium text-aisc-ink";
const AYUDA = "text-meta mt-1 block text-aisc-muted";
const SECCION = "border-t border-aisc-line pt-8 first:border-t-0 first:pt-0";

export default function DefAccApplyForm({
  cerrado = false,
  noIniciado = false,
  idioma = "es",
}: {
  cerrado?: boolean;
  noIniciado?: boolean;
  idioma?: Idioma;
}) {
  const [datos, setDatos] = useState<FormState>(VACIO);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar borrador guardado en localStorage
  useEffect(() => {
    try {
      const guardado = localStorage.getItem(BORRADOR_KEY);
      if (guardado) {
        setDatos((prev) => ({ ...prev, ...JSON.parse(guardado), authorization: "" }));
      }
    } catch {
      // Ignorar
    }
  }, []);

  // Guardar cambios en borrador
  const cambiar = (campo: keyof FormState, valor: string) => {
    setDatos((prev) => {
      const nuevo = { ...prev, [campo]: valor };
      try {
        const { authorization, website, ...aGuardar } = nuevo;
        localStorage.setItem(BORRADOR_KEY, JSON.stringify(aGuardar));
      } catch {
        // Ignorar
      }
      return nuevo;
    });
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones básicas
    if (
      !datos.firstName.trim() ||
      !datos.lastName.trim() ||
      !datos.email.trim() ||
      !datos.whatsapp.trim() ||
      !datos.documentNumber.trim() ||
      !datos.affiliation.trim() ||
      !datos.careerRole.trim()
    ) {
      setError(
        idioma === "en"
          ? "Please fill in all required fields."
          : idioma === "pt"
          ? "Por favor, preencha todos os campos obrigatórios."
          : "Por favor completa todos los campos obligatorios antes de enviar."
      );
      return;
    }

    if (datos.availability !== "si") {
      setError(
        idioma === "en"
          ? "You must confirm full in-person availability for Saturday, November 14."
          : idioma === "pt"
          ? "Você deve confirmar presença integral no sábado, 14 de novembro."
          : "Debes confirmar tu disponibilidad presencial completa el sábado 14 de noviembre (8:00 a. m. a 8:00 p. m.)."
      );
      return;
    }

    if (datos.authorization !== "si") {
      setError(
        idioma === "en"
          ? "You must authorize personal data processing to proceed."
          : idioma === "pt"
          ? "Você deve autorizar o tratamento de dados para continuar."
          : "Debes autorizar el tratamiento de tus datos personales conforme a la ley para postularte."
      );
      return;
    }

    setEnviando(true);

    try {
      const r = await fetch("/api/defacc/aplicar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const res = await r.json();

      if (!r.ok || !res.ok) {
        setError(
          res.mensaje ||
            (idioma === "en"
              ? "Could not submit your application. Please check your data or try again in a minute."
              : idioma === "pt"
              ? "Não foi possível enviar sua inscrição. Tente novamente em um minuto."
              : "No se pudo guardar la postulación. Verifica tus datos o intenta nuevamente en un minuto.")
        );
        setEnviando(false);
        return;
      }

      // Éxito: limpiar borrador local
      try {
        localStorage.removeItem(BORRADOR_KEY);
      } catch {
        // Ignorar
      }
      setEnviado(true);
    } catch {
      setError(
        idioma === "en"
          ? "Network error. Please check your connection."
          : idioma === "pt"
          ? "Erro de conexão. Verifique sua internet."
          : "Error de conexión. Por favor verifica tu red e intenta de nuevo."
      );
    } finally {
      setEnviando(false);
    }
  };

  const tPol = TEXTOS_POLITICA[idioma];

  if (noIniciado) {
    return (
      <div className="rounded-2xl border border-aisc-line bg-white p-8 text-center shadow-xs md:p-12">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-aisc-sand text-aisc-forest-deep mb-4">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h2 className="text-display-3 text-aisc-ink">
          {idioma === "en"
            ? "Applications Have Not Started Yet"
            : idioma === "pt"
            ? "As inscrições ainda não começaram"
            : "Las postulaciones aún no han iniciado"}
        </h2>
        <p className="text-body mt-4 text-aisc-muted max-w-lg mx-auto">
          {idioma === "en"
            ? "We are finalizing logistics and campus security pass coordination with IEEE Computer Society Uniandes. Registration will open very soon. In the meantime, you can explore the 5 research tracks or join our community group to be notified the moment applications go live."
            : idioma === "pt"
            ? "Estamos finalizando os preparativos de logística e acesso ao campus junto à IEEE Computer Society Uniandes. O formulário de inscrição será aberto em breve. Enquanto isso, você pode conferir as 5 frentes temáticas ou entrar no grupo da comunidade para ser avisado assim que abrir."
            : "Estamos ultimando los detalles logísticos y de registro peatonal al campus junto con IEEE Computer Society Uniandes. Próximamente habilitaremos el formulario oficial de inscripción. Mientras tanto, puedes explorar los 5 frentes temáticos o unirte a nuestro grupo de la comunidad para enterarte apenas abran."}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={rutaEn(idioma, "/defacchackathon")}
            className="text-body-sm inline-flex items-center rounded-full bg-aisc-forest px-6 py-2.5 font-medium text-aisc-cream transition-colors hover:bg-aisc-forest-deep"
          >
            {idioma === "en"
              ? "Explore Research Tracks"
              : idioma === "pt"
              ? "Ver frentes de pesquisa"
              : "Ver frentes temáticos"}
          </Link>
          <a
            href="https://chat.whatsapp.com/KhjJqDNVviK3aX5S4q79EF"
            target="_blank"
            rel="noopener noreferrer"
            className="text-body-sm inline-flex items-center rounded-full border border-aisc-forest/40 bg-aisc-sand/40 px-6 py-2.5 font-medium text-aisc-forest transition-colors hover:bg-aisc-forest hover:text-aisc-cream"
          >
            {idioma === "en"
              ? "Join WhatsApp Community"
              : idioma === "pt"
              ? "Entrar no grupo do WhatsApp"
              : "Unirme al grupo en WhatsApp"}
          </a>
        </div>
      </div>
    );
  }

  if (cerrado) {
    return (
      <div className="rounded-2xl border border-aisc-line bg-white p-8 text-center shadow-xs md:p-12">
        <h2 className="text-display-3 text-aisc-ink">
          {idioma === "en"
            ? "Applications are closed"
            : idioma === "pt"
            ? "Inscrições encerradas"
            : "Las inscripciones para esta edición ya cerraron"}
        </h2>
        <p className="text-body mt-4 text-aisc-muted max-w-lg mx-auto">
          {idioma === "en"
            ? "Selection review is underway. If you already applied, check your inbox between November 11 and 13 for your campus access pass."
            : idioma === "pt"
            ? "O processo de seleção está em andamento. Os selecionados receberão instruções de acesso ao campus por e-mail."
            : "El proceso de selección está en marcha. Si ya postulaste, revisa tu correo entre el 11 y el 13 de noviembre para la confirmación de ingreso al campus de la Universidad de los Andes."}
        </p>
        <div className="mt-8">
          <Link
            href={rutaEn(idioma, "/defacchackathon")}
            className="text-body-sm inline-flex items-center rounded-full bg-aisc-forest px-6 py-2.5 font-medium text-aisc-cream transition-colors hover:bg-aisc-forest-deep"
          >
            {idioma === "en"
              ? "Back to Hackathon Page"
              : idioma === "pt"
              ? "Voltar para o Hackathon"
              : "Volver a la página del hackatón"}
          </Link>
        </div>
      </div>
    );
  }

  if (enviado) {
    return (
      <div className="rounded-2xl border border-aisc-forest/30 bg-aisc-sand/40 p-8 text-center shadow-xs md:p-12">
        <span className="text-4xl" aria-hidden="true">🎉</span>
        <h2 className="text-display-2 text-aisc-forest mt-4">
          {idioma === "en"
            ? "Application Received!"
            : idioma === "pt"
            ? "Inscrição Recebida!"
            : "¡Recibimos tu postulación!"}
        </h2>
        <p className="text-body md:text-body-lg mt-4 text-aisc-ink max-w-xl mx-auto">
          {idioma === "en"
            ? "Thank you for applying to the Defensive Acceleration Hackathon. We review applications continuously and will notify you by email before November 13 with campus security details."
            : idioma === "pt"
            ? "Obrigado por se inscrever no Defensive Acceleration Hackathon. Enviaremos o resultado e as orientações de acesso ao campus por e-mail até 13 de novembro."
            : "Muchas gracias por postularte al Defensive Acceleration Hackathon. Revisamos las postulaciones continuamente y te responderemos por correo antes del 13 de noviembre con los detalles de ingreso a la Universidad de los Andes."}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={rutaEn(idioma, "/defacchackathon")}
            className="text-body-sm inline-flex items-center rounded-full bg-aisc-forest px-6 py-2.5 font-medium text-aisc-cream transition-colors hover:bg-aisc-forest-deep"
          >
            {idioma === "en"
              ? "Return to Hackathon Overview"
              : idioma === "pt"
              ? "Voltar ao resumo"
              : "Volver al resumen del evento"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className={`${styles.form} flex flex-col gap-8 rounded-2xl border border-aisc-line bg-white p-6 shadow-xs md:p-10`}>
      {/* Honeypot anti-spam */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        value={datos.website}
        onChange={(e) => cambiar("website", e.target.value)}
      />

      {error ? (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-body-sm text-red-800">
          {error}
        </div>
      ) : null}

      {/* SECCIÓN 1: DATOS PERSONALES */}
      <div className={SECCION}>
        <h3 className="text-display-3 text-aisc-ink">
          {idioma === "en" ? "1. Personal Information" : idioma === "pt" ? "1. Dados Pessoais" : "1. Datos personales y de contacto"}
        </h3>
        <p className={AYUDA}>
          {idioma === "en"
            ? "Used to communicate results and process your Uniandes campus clearance pass."
            : idioma === "pt"
            ? "Usados para contato e credenciamento no campus da Uniandes."
            : "Usados para comunicarte el resultado y tramitar tu pase de acceso en la portería de Uniandes."}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={ETIQUETA} htmlFor="firstName">
              {idioma === "en" ? "First name *" : idioma === "pt" ? "Nome *" : "Nombres *"}
            </label>
            <input
              id="firstName"
              type="text"
              required
              maxLength={80}
              className={INPUT}
              value={datos.firstName}
              onChange={(e) => cambiar("firstName", e.target.value)}
            />
          </div>
          <div>
            <label className={ETIQUETA} htmlFor="lastName">
              {idioma === "en" ? "Last name *" : idioma === "pt" ? "Sobrenome *" : "Apellidos *"}
            </label>
            <input
              id="lastName"
              type="text"
              required
              maxLength={80}
              className={INPUT}
              value={datos.lastName}
              onChange={(e) => cambiar("lastName", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={ETIQUETA} htmlFor="email">
              {idioma === "en" ? "Email *" : idioma === "pt" ? "E-mail *" : "Correo electrónico *"}
            </label>
            <input
              id="email"
              type="email"
              required
              maxLength={150}
              className={INPUT}
              value={datos.email}
              onChange={(e) => cambiar("email", e.target.value)}
            />
            <span className={AYUDA}>
              {idioma === "en" ? "Where you will receive confirmation and updates." : "Donde recibirás la confirmación y acceso."}
            </span>
          </div>

          <div>
            <label className={ETIQUETA} htmlFor="whatsapp">
              WhatsApp *
            </label>
            <input
              id="whatsapp"
              type="tel"
              required
              placeholder="+57 300 1234567"
              maxLength={30}
              className={INPUT}
              value={datos.whatsapp}
              onChange={(e) => cambiar("whatsapp", e.target.value)}
            />
            <span className={AYUDA}>
              {idioma === "en" ? "Include country code (e.g. +57)." : "Incluye el indicativo de país (ej. +57 para Colombia)."}
            </span>
          </div>
        </div>

        {/* IDENTIFICACIÓN PARA INGRESO A UNIANDES */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-12">
          <div className="sm:col-span-4">
            <label className={ETIQUETA} htmlFor="documentType">
              {idioma === "en" ? "ID Type *" : idioma === "pt" ? "Tipo de Documento *" : "Tipo de documento *"}
            </label>
            <select
              id="documentType"
              className={INPUT}
              value={datos.documentType}
              onChange={(e) => cambiar("documentType", e.target.value)}
            >
              <option value="CC">Cédula de Ciudadanía (CC)</option>
              <option value="CE">Cédula de Extranjería (CE)</option>
              <option value="Pasaporte">{idioma === "en" ? "Passport" : "Pasaporte"}</option>
              <option value="TI">Tarjeta de Identidad (TI)</option>
              <option value="Otro">{idioma === "en" ? "Other" : "Otro"}</option>
            </select>
          </div>

          <div className="sm:col-span-8">
            <label className={ETIQUETA} htmlFor="documentNumber">
              {idioma === "en" ? "ID Number *" : idioma === "pt" ? "Número do Documento *" : "Número de documento *"}
            </label>
            <input
              id="documentNumber"
              type="text"
              required
              maxLength={40}
              placeholder="1020304050"
              className={INPUT}
              value={datos.documentNumber}
              onChange={(e) => cambiar("documentNumber", e.target.value)}
            />
            <span className={AYUDA}>
              {idioma === "en"
                ? "Required by Uniandes campus security for in-person access on Saturday, Nov 14."
                : "Requerido por seguridad de la Universidad de los Andes para autorizar tu ingreso físico."}
            </span>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: PERFIL */}
      <div className={SECCION}>
        <h3 className="text-display-3 text-aisc-ink">
          {idioma === "en" ? "2. Academic / Professional Profile" : idioma === "pt" ? "2. Perfil Acadêmico / Profissional" : "2. Perfil académico o profesional"}
        </h3>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={ETIQUETA} htmlFor="affiliation">
              {idioma === "en" ? "University or Company *" : idioma === "pt" ? "Universidade ou Empresa *" : "Universidad o empresa *"}
            </label>
            <input
              id="affiliation"
              type="text"
              required
              placeholder="Ej. Uniandes, UNAL, Javeriana, Empresa..."
              maxLength={120}
              className={INPUT}
              value={datos.affiliation}
              onChange={(e) => cambiar("affiliation", e.target.value)}
            />
          </div>

          <div>
            <label className={ETIQUETA} htmlFor="careerRole">
              {idioma === "en" ? "Major / Current Role *" : idioma === "pt" ? "Curso / Cargo Atual *" : "Carrera, semestre o cargo actual *"}
            </label>
            <input
              id="careerRole"
              type="text"
              required
              placeholder="Ej. Ing. de Sistemas 6to sem, Investigador..."
              maxLength={120}
              className={INPUT}
              value={datos.careerRole}
              onChange={(e) => cambiar("careerRole", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label className={ETIQUETA} htmlFor="experienceLevel">
              {idioma === "en" ? "AI / Coding Experience" : "Nivel de experiencia con IA"}
            </label>
            <select
              id="experienceLevel"
              className={INPUT}
              value={datos.experienceLevel}
              onChange={(e) => cambiar("experienceLevel", e.target.value)}
            >
              <option value="principiante">{idioma === "en" ? "Beginner (Python basics)" : "Principiante (Python básico / primeros semestres)"}</option>
              <option value="intermedio">{idioma === "en" ? "Intermediate (LLM APIs, prompt engineering)" : "Intermedio (APIs de LLM, RAG, desarrollo)"}</option>
              <option value="avanzado">{idioma === "en" ? "Advanced (Security, agent frameworks)" : "Avanzado (Ciberseguridad, benchmarks, modelos)"}</option>
            </select>
          </div>

          <div>
            <label className={ETIQUETA} htmlFor="linkedin">
              LinkedIn ({idioma === "en" ? "optional" : "opcional"})
            </label>
            <input
              id="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/..."
              maxLength={160}
              className={INPUT}
              value={datos.linkedin}
              onChange={(e) => cambiar("linkedin", e.target.value)}
            />
          </div>

          <div>
            <label className={ETIQUETA} htmlFor="githubPortfolio">
              GitHub / Web ({idioma === "en" ? "optional" : "opcional"})
            </label>
            <input
              id="githubPortfolio"
              type="url"
              placeholder="https://github.com/..."
              maxLength={160}
              className={INPUT}
              value={datos.githubPortfolio}
              onChange={(e) => cambiar("githubPortfolio", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: MODALIDAD DE EQUIPO Y TRACK */}
      <div className={SECCION}>
        <h3 className="text-display-3 text-aisc-ink">
          {idioma === "en" ? "3. Team & Research Track" : idioma === "pt" ? "3. Equipe e Track de Pesquisa" : "3. Modalidad de equipo y track de interés"}
        </h3>

        <div className="mt-6 space-y-4">
          <div>
            <label className={ETIQUETA}>
              {idioma === "en" ? "¿How are you applying?" : "¿Cómo te postulas? *"}
            </label>
            <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                  datos.teamMode === "individual"
                    ? "border-aisc-forest bg-aisc-sand/40"
                    : "border-aisc-line hover:border-aisc-line/80"
                }`}
              >
                <input
                  type="radio"
                  name="teamMode"
                  value="individual"
                  checked={datos.teamMode === "individual"}
                  onChange={() => cambiar("teamMode", "individual")}
                  className="mt-1 size-4 text-aisc-forest"
                />
                <div>
                  <span className="text-body-sm font-semibold text-aisc-ink block">
                    {idioma === "en" ? "Solo applicant" : "Aplico de forma individual"}
                  </span>
                  <span className="text-meta text-aisc-muted mt-0.5 block">
                    {idioma === "en"
                      ? "I want to be matched with a team at the 9:40 AM mixer."
                      : "Quiero armar equipo con otros participantes en la dinámica de las 9:40 a. m."}
                  </span>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                  datos.teamMode === "equipo"
                    ? "border-aisc-forest bg-aisc-sand/40"
                    : "border-aisc-line hover:border-aisc-line/80"
                }`}
              >
                <input
                  type="radio"
                  name="teamMode"
                  value="equipo"
                  checked={datos.teamMode === "equipo"}
                  onChange={() => cambiar("teamMode", "equipo")}
                  className="mt-1 size-4 text-aisc-forest"
                />
                <div>
                  <span className="text-body-sm font-semibold text-aisc-ink block">
                    {idioma === "en" ? "With a pre-formed team" : "Aplico con equipo ya armado (2 a 4 personas)"}
                  </span>
                  <span className="text-meta text-aisc-muted mt-0.5 block">
                    {idioma === "en"
                      ? "All members should apply individually with the same team name/members."
                      : "Cada integrante debe enviar su postulación para su acceso individual al campus."}
                  </span>
                </div>
              </label>
            </div>
          </div>

          {datos.teamMode === "equipo" ? (
            <div>
              <label className={ETIQUETA} htmlFor="teamMembers">
                {idioma === "en"
                  ? "Names and emails of your teammates *"
                  : "Nombres y correos de tus compañeros de equipo *"}
              </label>
              <textarea
                id="teamMembers"
                rows={2}
                maxLength={400}
                required={datos.teamMode === "equipo"}
                placeholder="Ej. Juan Pérez (juan@uniandes.edu.co), Laura Gómez (laura@gmail.com)..."
                className={INPUT}
                value={datos.teamMembers}
                onChange={(e) => cambiar("teamMembers", e.target.value)}
              />
            </div>
          ) : null}

          <div>
            <label className={ETIQUETA} htmlFor="preferredTrack">
              {idioma === "en" ? "Preferred Research Track" : "Track temático de preferencia"}
            </label>
            <select
              id="preferredTrack"
              className={INPUT}
              value={datos.preferredTrack}
              onChange={(e) => cambiar("preferredTrack", e.target.value)}
            >
              <option value="track-1">Track 1: Seguridad de agentes e inyección de instrucciones (MCP, AgentDojo)</option>
              <option value="track-2">Track 2: Control de IA, monitoreo y detección de sabotaje (ControlArena, Inspect)</option>
              <option value="track-3">Track 3: Ciberdefensa automatizada y verificación formal (DafnyBench, CyberSecEval)</option>
              <option value="track-4">Track 4: Defensa epistémica, procedencia C2PA y detección de suplantación (AASIST)</option>
              <option value="track-5">Track 5: Seguridad de infraestructura de IA y gobernanza defensiva (No-Code, SL1 a SL5)</option>
              <option value="por_definir">Aún no lo tengo claro / Decidiré en la mañana</option>
            </select>
          </div>

          <div>
            <label className={ETIQUETA} htmlFor="projectIdea">
              {idioma === "en"
                ? "Preliminary project idea (optional)"
                : "¿Tienes alguna idea o problema preliminar que te gustaría trabajar? (Opcional)"}
            </label>
            <textarea
              id="projectIdea"
              rows={2}
              maxLength={600}
              placeholder="Una frase o dos sobre el enfoque o problema que tienes en mente..."
              className={INPUT}
              value={datos.projectIdea}
              onChange={(e) => cambiar("projectIdea", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN 4: LOGÍSTICA DE LA JORNADA */}
      <div className={SECCION}>
        <h3 className="text-display-3 text-aisc-ink">
          {idioma === "en" ? "4. Event Logistics & Catering" : idioma === "pt" ? "4. Logística e Alimentação" : "4. Logística de la jornada y alimentación"}
        </h3>
        <p className={AYUDA}>
          {idioma === "en"
            ? "We provide full lunch and coffee breaks on campus to keep the build sprint uninterrupted."
            : idioma === "pt"
            ? "O evento inclui almoço completo e lanches no campus para não pausar o trabalho em equipe."
            : "El evento incluye almuerzo completo en el campus y refrigerios continuos para no pausar el trabajo en equipo."}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={ETIQUETA} htmlFor="dietaryRestrictions">
              {idioma === "en" ? "Dietary preferences" : "Preferencias de alimentación"}
            </label>
            <select
              id="dietaryRestrictions"
              className={INPUT}
              value={datos.dietaryRestrictions}
              onChange={(e) => cambiar("dietaryRestrictions", e.target.value)}
            >
              <option value="ninguna">{idioma === "en" ? "No restrictions (standard menu)" : "Ninguna (menú estándar)"}</option>
              <option value="vegetariano">{idioma === "en" ? "Vegetarian" : "Vegetariano"}</option>
              <option value="vegano">{idioma === "en" ? "Vegan" : "Vegano"}</option>
              <option value="alergia">{idioma === "en" ? "Food allergy (specify below)" : "Alergia alimentaria (especificar abajo)"}</option>
            </select>
          </div>

          <div>
            <label className={ETIQUETA} htmlFor="dietaryDetail">
              {idioma === "en" ? "Allergy or accessibility details" : "Detalle de alergias o accesibilidad (si aplica)"}
            </label>
            <input
              id="dietaryDetail"
              type="text"
              placeholder="Ej. Celíaco, alergia a maní, movilidad reducida..."
              maxLength={120}
              className={INPUT}
              value={datos.dietaryDetail}
              onChange={(e) => cambiar("dietaryDetail", e.target.value)}
            />
          </div>
        </div>

        {/* CONFIRMACIÓN DE DISPONIBILIDAD */}
        <div className="mt-6 rounded-xl border border-aisc-forest/30 bg-aisc-sand/40 p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={datos.availability === "si"}
              onChange={(e) => cambiar("availability", e.target.checked ? "si" : "")}
              className="mt-1 size-5 rounded text-aisc-forest"
            />
            <span className="text-body-sm font-medium text-aisc-ink leading-relaxed">
              <strong>Compromiso de asistencia:</strong> Confirmo que podré asistir de forma presencial a la Universidad de los Andes el <strong>sábado 14 de noviembre de 2026</strong> desde las 8:00 a. m. hasta las 8:00 p. m.
            </span>
          </label>
        </div>
      </div>

      {/* SECCIÓN 5: POLÍTICA DE DATOS Y ENVÍO */}
      <div className={SECCION}>
        <div className="rounded-xl border border-aisc-line bg-white p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={datos.authorization === "si"}
              onChange={(e) => cambiar("authorization", e.target.checked ? "si" : "")}
              className="mt-1 size-5 rounded text-aisc-forest"
            />
            <span className="text-meta text-aisc-ink/90 leading-relaxed">
              {tPol.casilla}
              <Link
                href={RUTA_POLITICA[idioma]}
                target="_blank"
                className="text-aisc-forest font-medium underline"
              >
                {tPol.casillaEnlace}
              </Link>
              .
            </span>
          </label>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href={rutaEn(idioma, "/defacchackathon")}
            className="text-body-sm text-aisc-muted hover:text-aisc-ink"
          >
            ← {idioma === "en" ? "Back to hackathon" : "Volver a las bases"}
          </Link>

          <button
            type="submit"
            disabled={enviando}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-aisc-coral px-8 font-medium text-aisc-cream transition-colors hover:bg-aisc-coral/85 disabled:opacity-50"
          >
            {enviando
              ? idioma === "en"
                ? "Submitting..."
                : "Enviando postulación..."
              : idioma === "en"
              ? "Submit Application"
              : "Enviar mi postulación"}
          </button>
        </div>
      </div>
    </form>
  );
}

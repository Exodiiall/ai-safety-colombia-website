"use client";

import Link from "next/link";
import { League_Spartan } from "next/font/google";
import { useEffect, useState } from "react";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import {
  CTA_LINK,
  CTA_LINK_PRIMARY,
  PAGE_SHELL,
} from "@/components/ui";
import {
  CIERRE_INSCRIPCIONES_ISO,
  FECHA_EVENTO_ISO,
  TEXTOS_HACKATHON,
  inscripcionesCerradas,
} from "@/app/defacchackathon/datos";
import type { Premio } from "@/app/defacchackathon/datos";
import type { Idioma } from "@/lib/idiomas";
import { rutaEn } from "@/lib/idiomas";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
});

function FondoBinario() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {/* Ala binaria izquierda extraída directamente del flyer */}
      <img
        src="/aisc/hackathon/binario-izq.webp"
        alt=""
        width={220}
        height={500}
        decoding="async"
        className="absolute top-0 bottom-0 left-0 h-full w-auto object-cover opacity-55 md:opacity-75"
      />
      {/* Ala binaria derecha extraída directamente del flyer */}
      <img
        src="/aisc/hackathon/binario-der.webp"
        alt=""
        width={226}
        height={500}
        decoding="async"
        className="absolute top-0 right-0 bottom-0 h-full w-auto object-cover opacity-75 md:opacity-95"
      />
    </div>
  );
}

const ENLACE =
  "text-aisc-forest underline underline-offset-[3px] font-medium transition-colors hover:text-aisc-forest-deep";

function diasHasta(iso: string) {
  const [y, m, d] = iso.split("T")[0].split("-").map(Number);
  const target = Date.UTC(y, m - 1, d);
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / 86_400_000);
}

function PremiosSoberos({
  premios,
  premioDifusion,
}: {
  premios: Premio[];
  premioDifusion: Premio;
}) {
  return (
    <div className="space-y-6">
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {premios.map((p, i) => (
          <li className="flex" key={p.puesto}>
            <article
              className={`flex min-h-[148px] w-full flex-col justify-between rounded-[8px] p-5 md:min-h-[164px] md:p-6 ${
                i === 0
                  ? "bg-aisc-forest text-aisc-sand"
                  : "border border-aisc-forest/55 bg-aisc-cream text-aisc-ink"
              }`}
            >
              <span
                className={`text-meta font-semibold tracking-widest uppercase ${
                  i === 0 ? "text-aisc-sand/75" : "text-aisc-muted"
                }`}
              >
                {p.puesto}
              </span>
              <span className="mt-6 flex flex-col">
                <span
                  className={`text-meta ${i === 0 ? "text-aisc-sand/75" : "text-aisc-muted"}`}
                >
                  COP
                </span>
                <span
                  className={`font-[family-name:var(--font-display)] text-[1.85rem] lg:text-[2.1rem] font-extrabold leading-none tracking-tight tabular-nums whitespace-nowrap mt-1 ${
                    i === 0 ? "text-aisc-sand" : "text-aisc-forest"
                  }`}
                >
                  {p.monto}
                </span>
              </span>
            </article>
          </li>
        ))}
      </ul>

      {premioDifusion && (
        <div className="rounded-[8px] border border-aisc-line bg-aisc-sand/40 p-5 text-body-sm">
          <span className="text-meta font-semibold uppercase tracking-wider text-aisc-forest block">
            {premioDifusion.puesto}
          </span>
          <p className="mt-1 text-aisc-ink/90">
            {premioDifusion.detalle} ({premioDifusion.monto}).
          </p>
        </div>
      )}
    </div>
  );
}

export default function DefAccPage({ idioma = "es" }: { idioma?: Idioma }) {
  const d = TEXTOS_HACKATHON[idioma];
  const [pestaña, setPestaña] = useState<"resumen" | "tracks" | "reglas" | "cronograma">("resumen");
  const [diasFaltan, setDiasFaltan] = useState<number | null>(null);

  useEffect(() => {
    setDiasFaltan(diasHasta(FECHA_EVENTO_ISO));
  }, []);

  const cerrada = inscripcionesCerradas();
  const rutaAplicar = rutaEn(idioma, "/defacchackathon/aplicar");

  const datosClave =
    idioma === "en"
      ? [
          {
            valor: "November 14",
            nota: "One full Saturday, from 8:00 AM to 8:00 PM",
          },
          {
            valor: "In-person in Bogotá",
            nota: "Universidad de los Andes campus",
          },
          {
            valor: "COP 2,000,000 in prizes",
            nota: "Three winning teams selected by the judges at the close of the sprint",
          },
        ]
      : idioma === "pt"
      ? [
          {
            valor: "14 de novembro",
            nota: "Um sábado inteiro, das 8:00 às 20:00",
          },
          {
            valor: "Presencial em Bogotá",
            nota: "Campus da Universidad de los Andes",
          },
          {
            valor: "COP 2.000.000 em prêmios",
            nota: "Três equipes vencedoras escolhidas pelos jurados no encerramento do dia",
          },
        ]
      : [
          {
            valor: "14 de noviembre",
            nota: "Un sábado completo, de 8:00 a. m. a 8:00 p. m.",
          },
          {
            valor: "Presencial en Bogotá",
            nota: "Campus de la Universidad de los Andes",
          },
          {
            valor: "COP 2.000.000 en premios",
            nota: "Tres equipos ganadores escogidos por el jurado al cierre de la jornada",
          },
        ];

  return (
    <main className={PAGE_SHELL}>
      {/* ------------------------------------------------------------ HERO */}
      <section className="relative overflow-hidden bg-aisc-forest-deep text-aisc-sand">
        <FondoBinario />
        <SiteHeader active="/defacchackathon" />

        <div className="relative z-10 mx-auto w-full max-w-[1240px] px-6 pt-28 pb-12 sm:px-8 md:pt-36 md:pb-16">
          <div className="flex flex-col items-center text-center">
            {/* Banner oficial propuesto por IEEE Computer Society Uniandes */}
            <div className="w-full max-w-[980px] overflow-hidden rounded-2xl border border-white/20 bg-[#faf8f5] shadow-2xl transition-all">
              <img
                src="/aisc/hackathon/banner-ieee.png"
                alt="Defensive Acceleration Hackathon · Sábado 14 Noviembre 2026 · Uniandes · IEEE Computer Society × AI Safety Colombia"
                width={1024}
                height={512}
                decoding="async"
                className="h-auto w-full object-contain"
              />
            </div>

            {/* Subtítulo y estado de postulación */}
            <p className="mt-8 max-w-[720px] text-body md:text-body-lg text-aisc-sand/90">
              {d.lema}
            </p>

            <div className="mt-3.5 inline-flex items-center gap-2 rounded-full border border-aisc-sand/25 bg-white/5 px-4 py-1.5 text-body-sm text-aisc-sand/85 backdrop-blur-xs">
              <span className="size-2 rounded-full bg-aisc-coral animate-pulse" />
              <span>{d.estadoInscripciones}</span>
            </div>

            {/* Botones de acción principales */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link className={CTA_LINK_PRIMARY} href={rutaAplicar}>
                {d.ctaAplicar}
              </Link>
              <button
                type="button"
                onClick={() => setPestaña("tracks")}
                className={CTA_LINK}
              >
                {d.ctaVerBases}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Los organizadores, en una banda de arena pegada al hero: igual que en /sprint */}
      <section className="bg-aisc-sand">
        <div className="mx-auto w-full max-w-[1448px] px-8 md:px-16">
          <div className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:gap-10 md:py-7">
            <p className="text-kicker whitespace-nowrap text-aisc-muted sm:flex-none">
              {idioma === "en"
                ? "Organized by"
                : idioma === "pt"
                ? "Organizam"
                : "Organizan"}
            </p>
            <ul className="flex flex-wrap items-center gap-x-12 gap-y-5 sm:ml-auto">
              <li>
                <Link
                  className="block transition-opacity hover:opacity-60"
                  href={rutaEn(idioma, "/")}
                  title="AI Safety Colombia"
                >
                  <img
                    alt="AI Safety Colombia"
                    className="max-h-[44px] w-auto object-contain"
                    decoding="async"
                    src="/aisc/logo-lockup-oscuro.png"
                  />
                </Link>
              </li>
              <li>
                <a
                  className="block transition-opacity hover:opacity-60"
                  href="https://www.instagram.com/csuniandes/"
                  rel="noopener noreferrer"
                  target="_blank"
                  title="IEEE Computer Society Uniandes"
                >
                  <img
                    alt="IEEE Computer Society Uniandes"
                    className="max-h-[58px] max-w-[200px] w-auto object-contain"
                    decoding="async"
                    height={167}
                    src="/aisc/aliados/ieee-cs-uniandes.png"
                    width={560}
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Las tres cifras duras, en tarjetas oscuras debajo de la tira de logos: igual que en /sprint */}
      <section className="bg-aisc-cream pt-9 pb-8 md:pt-10 md:pb-10">
        <div className="mx-auto w-full max-w-[1448px] px-8 md:px-16">
          <dl className="grid grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-3">
            {datosClave.map((item) => (
              <div
                className="flex min-h-[122px] flex-col justify-start rounded-[8px] bg-aisc-forest-deep px-5 py-5 text-aisc-sand md:min-h-[142px] md:px-7 md:py-7"
                key={item.valor}
              >
                <dt className="text-display-4 md:text-display-4-lg break-words">
                  {item.valor}
                </dt>
                <dd className="text-body-sm mt-3 text-aisc-sand">{item.nota}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ------------------------------------------------ SUBNAV PESTAÑAS ESTILO APART */}
      <nav
        aria-label="Secciones del evento"
        className="sticky top-0 z-40 border-b border-aisc-line bg-white/95 px-6 backdrop-blur-md md:px-12"
      >
        <div className="mx-auto flex max-w-[860px] items-center justify-start gap-4 overflow-x-auto py-3 no-scrollbar">
          <div className="flex items-center gap-1 md:gap-2">
            {(
              [
                { id: "resumen", label: d.pestañas.resumen },
                { id: "tracks", label: d.pestañas.tracks },
                { id: "reglas", label: d.pestañas.reglas },
                { id: "cronograma", label: d.pestañas.cronograma },
              ] as const
            ).map((tab) => {
              const activo = pestaña === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPestaña(tab.id)}
                  aria-pressed={activo}
                  className={`text-body-sm whitespace-nowrap rounded-full px-4 py-2 font-medium transition-all ${
                    activo
                      ? "bg-aisc-forest text-aisc-cream shadow-xs"
                      : "text-aisc-muted hover:bg-aisc-sand/60 hover:text-aisc-ink"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ------------------------------------------------ CUERPO PRINCIPAL SOBRIO (ESTILO APART) */}
      <section className="mx-auto w-full max-w-[860px] px-6 py-12 md:px-8 md:py-16">
        <div className="min-w-0">
            {/* PESTAÑA 1: RESUMEN */}
            {pestaña === "resumen" && (
              <div className="space-y-12">
                {/* 1. La idea */}
                <div>
                  <h2 className="text-display-2 md:text-display-2-lg text-aisc-ink">
                    {d.resumen.ideaTitulo}
                  </h2>
                  <div className="text-body md:text-body-lg mt-5 space-y-4 text-aisc-ink/85">
                    {d.resumen.ideaParrafos.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>

                {/* 2. Colombia */}
                <div className="rounded-2xl border border-aisc-forest/20 bg-aisc-sand/60 p-6 md:p-8">
                  <h3 className="text-display-3 text-aisc-forest">
                    {d.resumen.colombiaTitulo}
                  </h3>
                  <p className="text-body mt-3 text-aisc-ink/90">
                    {d.resumen.colombiaTexto}
                  </p>
                </div>

                {/* 3. El reto y los 4 requisitos */}
                <div className="border-t border-aisc-line pt-8">
                  <h3 className="text-display-3 md:text-display-3-lg text-aisc-ink">
                    {d.resumen.retoTitulo}
                  </h3>
                  <p className="text-body md:text-body-lg mt-3 text-aisc-ink/85">
                    {d.resumen.retoTexto}
                  </p>

                  {/* Diagrama técnico del ciclo del reto defensivo */}
                  <div className="mt-8 rounded-2xl border border-aisc-forest/20 bg-aisc-sand/45 p-5 md:p-7">
                    <span className="text-kicker text-aisc-forest font-bold block mb-4">
                      {idioma === "en"
                        ? "Technical Sprint Cycle"
                        : idioma === "pt"
                        ? "Ciclo Técnico do Sprint"
                        : "Ciclo técnico del sprint"}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        {
                          paso: "01",
                          titulo: idioma === "en" ? "Threat Vector" : idioma === "pt" ? "Vetor de Ameaça" : "Vector de amenaza",
                          desc: idioma === "en" ? "Identify an active, concrete AI vulnerability or risk" : idioma === "pt" ? "Identificar um risco ou vulnerabilidade real em IA" : "Definir un riesgo o vulnerabilidad real en modelos o agentes",
                        },
                        {
                          paso: "02",
                          titulo: idioma === "en" ? "Defensive Prototype" : idioma === "pt" ? "Protótipo Defensivo" : "Prototipo defensivo",
                          desc: idioma === "en" ? "Build verifiable, working code to mitigate or contain it" : idioma === "pt" ? "Construir código funcional que mitigue ou contenha a ameaça" : "Construir código ejecutable que mitigue o contenga el vector",
                        },
                        {
                          paso: "03",
                          titulo: idioma === "en" ? "Empirical Benchmark" : idioma === "pt" ? "Avaliação Empírica" : "Evaluación empírica",
                          desc: idioma === "en" ? "Measure effectiveness with datasets, tests, or metrics" : idioma === "pt" ? "Medir eficácia com benchmarks ou testes reproduzíveis" : "Medir efectividad con suite de pruebas o datos reproducibles",
                        },
                        {
                          paso: "04",
                          titulo: idioma === "en" ? "Safety Verification" : idioma === "pt" ? "Verificação de Segurança" : "Verificación y seguridad",
                          desc: idioma === "en" ? "Assess safety boundaries and responsible deployment" : idioma === "pt" ? "Verificar limites de segurança e uso responsável" : "Verificar que la defensa no cree riesgos o sesgos secundarios",
                        },
                      ].map((item, i) => (
                        <div key={item.paso} className="relative flex flex-col justify-between rounded-xl border border-aisc-line bg-white p-4 shadow-2xs">
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-xs font-bold text-aisc-coral">{item.paso}</span>
                              {i < 3 && (
                                <span className="hidden lg:block text-aisc-muted/50 text-xs" aria-hidden="true">→</span>
                              )}
                            </div>
                            <h4 className="text-display-4 font-semibold text-aisc-ink mt-2">
                              {item.titulo}
                            </h4>
                            <p className="text-body-sm text-aisc-muted mt-1 leading-snug">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <h4 className="text-display-4 mt-8 text-aisc-forest">
                    {d.resumen.cuatroRequisitosTitulo}
                  </h4>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {d.resumen.cuatroRequisitos.map((req, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3.5 rounded-xl border border-aisc-line bg-white p-4 shadow-2xs"
                      >
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-aisc-forest text-sm font-bold text-aisc-cream">
                          {idx + 1}
                        </span>
                        <p className="text-body-sm text-aisc-ink font-medium">{req}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Quién puede participar */}
                <div className="border-t border-aisc-line pt-8">
                  <h3 className="text-display-3 text-aisc-ink">
                    {d.resumen.quienTitulo}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {d.resumen.quienPuntos.map((pt, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-aisc-coral" />
                        <span className="text-body-sm text-aisc-ink/90">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 5. Premios */}
                <div className="border-t border-aisc-line pt-8">
                  <div className="mb-4">
                    <h3 className="text-display-3 text-aisc-ink">
                      {d.resumen.premiosTitulo}
                    </h3>
                    <p className="text-body-sm text-aisc-muted mt-1">
                      {idioma === "en"
                        ? "Judges will evaluate submissions and determine the top three projects at the conclusion of the sprint."
                        : idioma === "pt"
                        ? "Os jurados avaliarão as entregas e definirão os três primeiros lugares no encerramento do evento."
                        : "Los jurados evalúan los proyectos y definen los tres primeros lugares al cierre de la jornada."}
                    </p>
                  </div>

                  <PremiosSoberos
                    premios={d.premiosPodio}
                    premioDifusion={d.premioDifusion}
                  />
                </div>

                {/* 6. Mascota */}
                <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl bg-aisc-forest-deep p-6 text-aisc-sand md:p-8">
                  <img
                    src="/aisc/hackathon/cyberbear-clean.png"
                    alt="Oso de anteojos"
                    width={180}
                    height={277}
                    className="size-36 shrink-0 object-contain drop-shadow-md"
                  />
                  <div>
                    <h3 className="text-display-3 text-aisc-sand">
                      {d.resumen.mascotaTitulo}
                    </h3>
                    <p className="text-body-sm mt-2 text-aisc-sand/85">
                      {d.resumen.mascotaTexto}
                    </p>
                  </div>
                </div>

                {/* 7. Jueces y mentores (al final de El reto, con retrato cuadrado estilo /sprint) */}
                <div className="border-t border-aisc-line pt-8">
                  <h3 className="text-display-3 text-aisc-ink">
                    {d.reglas.juradosTitulo}
                  </h3>
                  <p className="text-body mt-1 text-aisc-muted">
                    {d.reglas.juradosTexto}
                  </p>

                  <ul className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
                    {d.reglas.jurados.map((j) => (
                      <li key={j.nombre} className="flex flex-col gap-3.5">
                        <div className="flex items-center gap-4">
                          {j.foto ? (
                            <div className="relative size-20 shrink-0 overflow-hidden rounded-[10px] bg-aisc-sand">
                              <img
                                src={j.foto}
                                alt={j.nombre}
                                width={160}
                                height={160}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                          ) : null}
                          <div className="min-w-0">
                            <span className="text-kicker text-aisc-coral font-bold block">
                              {j.rol}
                            </span>
                            <h4 className="text-display-4 mt-0.5 font-semibold text-aisc-forest">
                              {j.url ? (
                                <a
                                  href={j.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline decoration-aisc-forest/30 underline-offset-4 transition-colors hover:text-aisc-coral hover:decoration-aisc-coral"
                                >
                                  {j.nombre}
                                </a>
                              ) : (
                                j.nombre
                              )}
                            </h4>
                            <p className="text-meta font-medium text-aisc-muted mt-0.5">
                              {j.afiliacion}
                            </p>
                          </div>
                        </div>
                        <p className="text-body-sm text-aisc-ink/85 leading-relaxed">
                          {j.bio}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* PESTAÑA 2: KITS Y TRACKS */}
            {pestaña === "tracks" && (
              <div className="space-y-12">
                <div>
                  <h2 className="text-display-2 md:text-display-2-lg text-aisc-ink">
                    {d.kits.tracksTitulo}
                  </h2>
                  <p className="text-body md:text-body-lg mt-3 text-aisc-ink/85">
                    {d.kits.tracksTexto}
                  </p>

                  <div className="mt-8 space-y-8">
                    {d.kits.listaTracks.map((tr) => (
                      <article
                        key={tr.id}
                        id={tr.id}
                        className="scroll-mt-24 rounded-2xl border border-aisc-line bg-white p-6 shadow-xs md:p-8"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-display-3 font-mono font-bold text-aisc-coral">
                            {tr.numero}
                          </span>
                          <h4 className="text-display-3 text-aisc-ink">
                            {tr.titulo}
                          </h4>
                        </div>

                        <p className="text-body mt-4 text-aisc-ink/90">
                          {tr.resumen}
                        </p>

                        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-aisc-line/70 pt-5 md:grid-cols-2">
                          <div className="rounded-xl bg-aisc-sand/50 p-4">
                            <span className="text-kicker text-aisc-forest font-bold">
                              {idioma === "en"
                                ? "Getting started"
                                : idioma === "pt"
                                ? "Para começar"
                                : "Para empezar"}
                            </span>
                            <p className="text-body-sm mt-1.5 text-aisc-ink">
                              {tr.paraEmpezar}
                            </p>
                          </div>
                          <div className="rounded-xl bg-aisc-sand/50 p-4">
                            <span className="text-kicker text-aisc-forest font-bold">
                              {idioma === "en"
                                ? "Advanced scope"
                                : idioma === "pt"
                                ? "Com experiência"
                                : "Con experiencia"}
                            </span>
                            <p className="text-body-sm mt-1.5 text-aisc-ink">
                              {tr.conExperiencia}
                            </p>
                          </div>
                        </div>

                        {tr.paraIrMasLejos ? (
                          <div className="mt-3 rounded-xl bg-aisc-cream border border-aisc-line p-4">
                            <span className="text-kicker text-aisc-coral font-bold">
                              {idioma === "en"
                                ? "Going further"
                                : idioma === "pt"
                                ? "Para ir mais longe"
                                : "Para ir más lejos"}
                            </span>
                            <p className="text-body-sm mt-1.5 text-aisc-ink">
                              {tr.paraIrMasLejos}
                            </p>
                          </div>
                        ) : null}

                        {/* Recursos y Datasets */}
                        <div className="mt-5 pt-4 border-t border-aisc-line/60">
                          <span className="text-kicker text-aisc-muted">
                            {idioma === "en"
                              ? "Starter datasets, benchmarks & repositories:"
                              : idioma === "pt"
                              ? "Datasets, benchmarks e repositórios de partida:"
                              : "Datasets, benchmarks y repositorios de partida:"}
                          </span>
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            {tr.recursos.map((rec) => (
                              <a
                                key={rec.url}
                                href={rec.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-meta inline-flex items-center gap-1.5 rounded-full border border-aisc-forest/30 bg-aisc-sand/30 px-3 py-1 font-medium text-aisc-forest transition-colors hover:border-aisc-forest hover:bg-aisc-forest hover:text-aisc-sand"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                  <polyline points="15 3 21 3 21 9" />
                                  <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                                {rec.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PESTAÑA 3: PREMIOS Y EVALUACIÓN */}
            {pestaña === "reglas" && (
              <div className="space-y-12">
                {/* Premios */}
                <div>
                  <h2 className="text-display-2 md:text-display-2-lg text-aisc-ink">
                    {d.resumen.premiosTitulo}
                  </h2>
                  <p className="text-body mt-2 mb-6 text-aisc-muted">
                    {idioma === "en"
                      ? "Prizes are awarded based on the judges' evaluation across defensive relevance, prototype functionality, empirical benchmarks, and responsible use."
                      : idioma === "pt"
                      ? "Os prêmios são concedidos com base na avaliação dos jurados em relevância defensiva, funcionamento do protótipo, evidência empírica e uso responsável."
                      : "Los premios se asignan con base en la evaluación de los jurados sobre relevancia defensiva, funcionamiento del prototipo, evidencia empírica y uso responsable."}
                  </p>

                  <PremiosSoberos
                    premios={d.premiosPodio}
                    premioDifusion={d.premioDifusion}
                  />
                </div>

                {/* Reglas de uso responsable */}
                <div className="border-t border-aisc-line pt-8">
                  <h3 className="text-display-3 text-aisc-ink">
                    {d.reglas.tituloSeguridad}
                  </h3>
                  <div className="mt-6 space-y-4">
                    {d.reglas.reglasSeguridad.map((regla, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 rounded-xl border border-red-200 bg-red-50/50 p-4 text-aisc-ink"
                      >
                        <span className="mt-0.5 text-lg text-red-600 font-bold" aria-hidden="true">
                          ⚠
                        </span>
                        <p className="text-body-sm leading-relaxed">{regla}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Entregables */}
                <div className="border-t border-aisc-line pt-8">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-display-3 text-aisc-ink">
                      {d.reglas.entregablesTitulo}
                    </h3>
                    <span className="text-meta font-bold text-aisc-coral">
                      {d.reglas.entregablesHora}
                    </span>
                  </div>

                  <ul className="mt-5 space-y-3">
                    {d.reglas.entregables.map((ent, i) => (
                      <li key={i} className="flex items-start gap-3 rounded-xl border border-aisc-line bg-white p-4">
                        <span className="mt-1 size-2 rounded-full bg-aisc-forest shrink-0" />
                        <span className="text-body-sm font-medium text-aisc-ink">{ent}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Criterios de evaluación */}
                <div className="border-t border-aisc-line pt-8">
                  <h3 className="text-display-3 text-aisc-ink">
                    {d.reglas.criteriosTitulo}
                  </h3>
                  <p className="text-body mt-2 text-aisc-muted">
                    {d.reglas.criteriosTexto}
                  </p>

                  <div className="mt-6 space-y-3">
                    {d.reglas.criterios.map((c) => (
                      <div
                        key={c.nombre}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-aisc-line bg-aisc-sand/30 p-4 md:p-5"
                      >
                        <div className="min-w-0">
                          <h4 className="text-display-4 font-semibold text-aisc-ink">
                            {c.nombre}
                          </h4>
                          <p className="text-body-sm mt-1 text-aisc-muted">
                            {c.descripcion}
                          </p>
                        </div>
                        <span className="text-display-3 tabular-nums font-bold text-aisc-coral shrink-0">
                          {c.peso}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dinámica de finalistas */}
                <div className="rounded-2xl border border-aisc-forest/20 bg-aisc-sand/70 p-6 md:p-8">
                  <h3 className="text-display-3 text-aisc-forest">
                    {d.reglas.finalistasTitulo}
                  </h3>
                  <p className="text-body mt-3 text-aisc-ink/90 leading-relaxed">
                    {d.reglas.finalistasTexto}
                  </p>
                </div>
              </div>
            )}

            {/* PESTAÑA 4: CRONOGRAMA Y FAQ */}
            {pestaña === "cronograma" && (
              <div className="space-y-12">
                {/* Minuto a minuto */}
                <div>
                  <h2 className="text-display-2 md:text-display-2-lg text-aisc-ink">
                    {d.cronograma.titulo}
                  </h2>
                  <p className="text-body mt-2 text-aisc-muted">
                    {d.cronograma.subtitulo}
                  </p>

                  <div className="mt-8 space-y-3">
                    {d.cronograma.agenda.map((ag) => (
                      <div
                        key={ag.hora}
                        className={`flex flex-col sm:flex-row sm:items-start gap-4 rounded-xl border p-4 transition-colors ${
                          ag.destacado
                            ? "border-aisc-coral/40 bg-aisc-sand/60"
                            : "border-aisc-line bg-white"
                        }`}
                      >
                        <time className="text-display-4 font-mono font-bold text-aisc-forest shrink-0 sm:w-28">
                          {ag.hora}
                        </time>
                        <div className="min-w-0">
                          <h4 className="text-display-4 font-semibold text-aisc-ink">
                            {ag.actividad}
                          </h4>
                          <p className="text-body-sm text-aisc-muted mt-1">
                            {ag.detalle}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calendario previo */}
                <div className="border-t border-aisc-line pt-8">
                  <h3 className="text-display-3 text-aisc-ink">
                    {d.cronograma.calendarioPrevioTitulo}
                  </h3>
                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {d.cronograma.calendarioPrevio.map((cal, i) => (
                      <div key={i} className="rounded-xl border border-aisc-line bg-aisc-sand/40 p-4">
                        <span className="text-kicker text-aisc-coral font-bold">{cal.fecha}</span>
                        <p className="text-body-sm font-medium text-aisc-ink mt-1">{cal.hito}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preguntas frecuentes */}
                <div className="border-t border-aisc-line pt-8">
                  <h3 className="text-display-3 text-aisc-ink">
                    {d.cronograma.faqTitulo}
                  </h3>
                  <div className="mt-6 space-y-4">
                    {d.cronograma.faqs.map((faq) => (
                      <details key={faq.q} className="group rounded-2xl border border-aisc-line bg-white p-5">
                        <summary className="text-display-4 cursor-pointer font-semibold text-aisc-ink list-none flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                          <span>{faq.q}</span>
                          <span className="text-aisc-coral text-xl font-bold transition-transform group-open:rotate-45">
                            +
                          </span>
                        </summary>
                        <p className="text-body-sm text-aisc-ink/80 mt-3 pt-3 border-t border-aisc-line/60 leading-relaxed">
                          {faq.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            )}
        </div>
      </section>

      <SiteFooter idioma={idioma} />
    </main>
  );
}

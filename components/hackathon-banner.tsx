"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { type Idioma, idiomaDe, rutaEn } from "@/lib/idiomas";

/* Defensive Acceleration Hackathon · 14 de noviembre de 2026 */
export const HACKATHON_INFO: Record<
  Idioma,
  { badge: string; title: string; body: string; cta: string }
> = {
  es: {
    badge: "14 de noviembre · Uniandes Bogotá",
    title: "Defensive Acceleration Hackathon",
    body: "Una jornada presencial en la Universidad de los Andes para construir y evaluar defensas en seguridad de IA: seguridad de agentes, AI Control, verificación formal, defensa epistémica y gobernanza defensiva. COP 2.000.000 en premios.",
    cta: "Inscribirme al Hackathon",
  },
  en: {
    badge: "November 14 · Uniandes Bogotá",
    title: "Defensive Acceleration Hackathon",
    body: "An in-person sprint at Universidad de los Andes to build and evaluate AI safety defenses: agent security, AI control, formal verification, epistemic defense, and defensive governance. COP 2,000,000 in prizes.",
    cta: "Register for the Hackathon",
  },
  pt: {
    badge: "14 de novembro · Uniandes Bogotá",
    title: "Defensive Acceleration Hackathon",
    body: "Uma jornada presencial na Universidad de los Andes para construir e avaliar defesas em segurança de IA: segurança de agentes, AI Control, verificação formal, defesa epistêmica e governança defensiva. COP 2.000.000 em prêmios.",
    cta: "Inscrever-se no Hackathon",
  },
};

/** Fecha de realización del evento */
export const HACKATHON_FECHA = "2026-11-14";

function diasHasta(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const target = Date.UTC(y, m - 1, d);
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / 86_400_000);
}

function Countdown({ idioma }: { idioma: Idioma }) {
  const [texto, setTexto] = useState<string | null>(null);

  useEffect(() => {
    const dias = diasHasta(HACKATHON_FECHA);
    const cuenta: Record<Idioma, (d: number) => string | null> = {
      es: (d) => (d > 1 ? `Faltan ${d} días` : d === 1 ? "Falta 1 día" : d === 0 ? "¡Es hoy!" : null),
      en: (d) => (d > 1 ? `${d} days to go` : d === 1 ? "1 day to go" : d === 0 ? "Today!" : null),
      pt: (d) => (d > 1 ? `Faltam ${d} dias` : d === 1 ? "Falta 1 dia" : d === 0 ? "É hoje!" : null),
    };
    setTexto(cuenta[idioma](dias));
  }, [idioma]);

  if (!texto) return null;
  return (
    <span className="inline-flex items-center justify-center gap-2 text-meta font-medium text-aisc-sand/75">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-aisc-coral animate-pulse" />
      {texto}
    </span>
  );
}

export default function HackathonBanner() {
  const ruta = usePathname() ?? "/";
  const idioma = idiomaDe(ruta);
  const t = HACKATHON_INFO[idioma];

  const [fecha, lugar] = t.badge.split(" · ");
  const destino = rutaEn(idioma, "/defacchackathon");

  return (
    <div className="overflow-hidden rounded-[22px] border border-aisc-forest-deep/20 bg-aisc-forest text-aisc-sand shadow-sm lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-center">
      {/* Afiche oficial: arriba en el celular, a la derecha en escritorio. Ya lleva fecha, lugar y logos. */}
      <Link
        href={destino}
        tabIndex={-1}
        aria-hidden="true"
        className="block bg-[#faf8f5] lg:order-2 lg:m-8 lg:ml-0 lg:overflow-hidden lg:rounded-2xl"
      >
        <Image
          src="/aisc/hackathon/banner-ieee.png"
          alt=""
          width={1024}
          height={512}
          sizes="(min-width: 1024px) 420px, 100vw"
          className="h-auto w-full"
        />
      </Link>

      <div className="flex flex-col gap-4 px-5 pt-6 pb-7 sm:px-8 sm:pt-8 md:px-10 md:pb-9 lg:order-1">
        <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-body-sm font-medium text-aisc-sand/85">
          <li className="inline-flex items-center gap-2">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 text-aisc-coral" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="2.5" /><path d="M3 9.5h18M8 2.5v4M16 2.5v4" /></svg>
            {fecha}
          </li>
          <li className="inline-flex items-center gap-2">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 text-aisc-coral" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
            {lugar}
          </li>
        </ul>

        <h2 className="text-display-3 md:text-display-3-lg text-balance text-aisc-sand">
          {t.title}
        </h2>
        <p className="text-body-sm max-w-[620px] leading-relaxed text-aisc-sand/85">
          {t.body}
        </p>

        <div className="mt-2 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5">
          <Link
            className="text-body-sm inline-flex min-h-12 items-center justify-center rounded-full bg-aisc-coral px-7 font-medium text-aisc-cream shadow-sm transition-all hover:scale-[1.02] hover:bg-aisc-coral/90 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-aisc-sand"
            href={destino}
          >
            {t.cta}
          </Link>
          <Countdown idioma={idioma} />
        </div>
      </div>
    </div>
  );
}

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
    <span className="text-meta font-medium tracking-wide text-aisc-sand/90 bg-white/10 px-3 py-1 rounded-full border border-white/15">
      {texto}
    </span>
  );
}

export default function HackathonBanner() {
  const ruta = usePathname() ?? "/";
  const idioma = idiomaDe(ruta);
  const t = HACKATHON_INFO[idioma];

  return (
    <div className="relative overflow-hidden rounded-[22px] bg-aisc-forest px-5 py-7 sm:px-6 sm:py-8 text-aisc-sand shadow-sm md:px-10 md:py-9 border border-aisc-forest-deep/20">
      {/* Círculo salvia decorativo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[120px] -right-[80px] size-[280px] rounded-full bg-aisc-sage opacity-30"
      />
      <div className="relative z-10 flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="flex max-w-[740px] flex-col items-start gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-kicker inline-flex items-center whitespace-nowrap rounded-full bg-aisc-coral px-3 py-1 text-[0.6875rem] tracking-[0.06em] text-aisc-cream font-medium shadow-xs sm:text-xs sm:tracking-[0.12em]">
              {t.badge}
            </span>
            <span className="text-[10px] font-mono tracking-wide text-aisc-sand/75 uppercase sm:text-[11px] sm:tracking-wider">
              AI Safety Colombia × IEEE Uniandes
            </span>
          </div>
          <h2 className="text-display-3 md:text-display-3-lg text-balance text-aisc-sand">
            {t.title}
          </h2>
          <p className="text-body-sm text-aisc-sand/90 max-w-[650px] leading-relaxed">
            {t.body}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-4">
          <div className="hidden sm:block shrink-0">
            <Image
              src="/aisc/hackathon/cyberbear.png"
              alt="CyberBear"
              width={76}
              height={76}
              className="object-contain drop-shadow-md"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              className="text-body-sm inline-flex min-h-11 items-center rounded-full bg-aisc-coral px-6 font-medium text-aisc-cream transition-all hover:bg-aisc-coral/90 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-aisc-sand shadow-sm"
              href={rutaEn(idioma, "/defacchackathon")}
            >
              {t.cta}
            </Link>
            <Countdown idioma={idioma} />
          </div>
        </div>
      </div>
    </div>
  );
}

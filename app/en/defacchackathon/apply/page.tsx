import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import DefAccApplyForm from "@/components/defacc-apply-form";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { HERO_CORNER_CLASS, HERO_INNER, HERO_SECTION, PAGE_SHELL } from "@/components/ui";
import { inscripcionesCerradas, inscripcionesIniciadas } from "@/app/defacchackathon/datos";
import { alternativas } from "@/lib/idiomas";

export const metadata: Metadata = {
  title: "Apply · Defensive Acceleration Hackathon",
  description:
    "Application form for the Defensive Acceleration Hackathon, Saturday November 14, 2026 at Universidad de los Andes, Bogotá. Co-organized by AI Safety Colombia & IEEE Computer Society Uniandes.",
  alternates: {
    canonical: "/en/defacchackathon/apply",
    languages: alternativas("/en/defacchackathon/apply"),
  },
};

export const dynamic = "force-dynamic";

export default async function ApplyDefAcc() {
  const cerrado = inscripcionesCerradas();
  const noIniciado = !inscripcionesIniciadas();

  return (
    <main lang="en" className={PAGE_SHELL}>
      <section className={HERO_SECTION}>
        <img
          alt=""
          aria-hidden="true"
          loading="lazy"
          width="1697"
          height="1415"
          decoding="async"
          className={HERO_CORNER_CLASS}
          style={{ color: "transparent" }}
          src="/aisc/patterns/aisc-hero-hackathon.svg"
        />
        <SiteHeader active="/en/defacchackathon" />
        <div className={HERO_INNER}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 max-w-[960px]">
            <div className="flex max-w-[700px] flex-col gap-4">
              <span className="text-kicker text-aisc-sand/70">
                Defensive Acceleration Hackathon · Saturday November 14, 2026 · Uniandes
              </span>
              <h1 className="text-display-1 md:text-display-1-lg text-balance text-aisc-sand">
                Register for the Hackathon
              </h1>
              <p className="text-body md:text-body-lg text-aisc-sand/90">
                8:00 a.m. to 8:00 p.m. at Universidad de los Andes campus, Bogotá.
                Limited capacity, lunch and coffee breaks included, technical mentors, and COP 2,000,000 in prizes.
              </p>
            </div>
            <div className="hidden md:flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Image
                src="/aisc/hackathon/cyberbear.png"
                alt="Spectacled Bear · Defensive Acceleration Hackathon"
                width={120}
                height={120}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-aisc-sand">
        <div className="mx-auto w-full max-w-[900px] px-6 pt-12 pb-16 md:px-8 md:pt-16 md:pb-20">
          {!cerrado && !noIniciado ? (
            <div className="mb-8 rounded-[var(--radius)] border border-aisc-line bg-white/70 p-5 backdrop-blur-sm flex flex-col gap-2.5">
              <p className="text-body-sm font-medium text-aisc-forest-deep">
                Key information before applying:
              </p>
              <ul className="text-body-sm text-aisc-ink space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Teams or individual:</strong> you can apply as a pre-formed team (2 to 4 people) or individually. Individual participants will be matched during the morning matchmaking session (9:40 a.m.).
                </li>
                <li>
                  <strong>Campus access:</strong> your national ID or passport number is strictly required to issue your pedestrian security pass at the Universidad de los Andes entrance.
                </li>
                <li>
                  <strong>Lunch and catering:</strong> full lunch is provided on campus for selected participants, alongside coffee stations and snacks throughout the day.
                </li>
                <li>
                  <strong>Applications deadline:</strong> Tuesday, November 10 at 11:59 p.m.
                </li>
              </ul>
              <div className="pt-2 text-body-sm">
                Need to review the 5 research tracks or evaluation criteria before applying?{" "}
                <Link
                  className="font-medium text-aisc-forest underline underline-offset-[3px] transition-colors hover:text-aisc-forest-deep"
                  href="/en/defacchackathon"
                >
                  View full hackathon details here →
                </Link>
              </div>
            </div>
          ) : null}

          <DefAccApplyForm cerrado={cerrado} noIniciado={noIniciado} idioma="en" />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

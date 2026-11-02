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
  title: "Inscrição · Defensive Acceleration Hackathon",
  description:
    "Formulário de inscrição no Defensive Acceleration Hackathon, sábado 14 de novembro de 2026 na Universidad de los Andes, Bogotá. Co-organizado por AI Safety Colombia e IEEE Computer Society Uniandes.",
  alternates: {
    canonical: "/pt/defacchackathon/inscricao",
    languages: alternativas("/pt/defacchackathon/inscricao"),
  },
};

export const dynamic = "force-dynamic";

export default async function InscricaoDefAcc() {
  const cerrado = inscripcionesCerradas();
  const noIniciado = !inscripcionesIniciadas();

  return (
    <main lang="pt" className={PAGE_SHELL}>
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
        <SiteHeader active="/pt/defacchackathon" />
        <div className={HERO_INNER}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 max-w-[960px]">
            <div className="flex max-w-[700px] flex-col gap-4">
              <span className="text-kicker text-aisc-sand/70">
                Defensive Acceleration Hackathon · Sábado 14 de novembro de 2026 · Uniandes
              </span>
              <h1 className="text-display-1 md:text-display-1-lg text-balance text-aisc-sand">
                Inscreva-se no Hackathon
              </h1>
              <p className="text-body md:text-body-lg text-aisc-sand/90">
                Das 8h00 às 20h00 no campus da Universidad de los Andes, em Bogotá.
                Vagas limitadas, almoço completo incluso, mentores técnicos e COP 2.000.000 em prêmios.
              </p>
            </div>
            <div className="hidden md:flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Image
                src="/aisc/hackathon/cyberbear.png"
                alt="Urso-de-óculos · Defensive Acceleration Hackathon"
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
                Informações importantes antes de preencher:
              </p>
              <ul className="text-body-sm text-aisc-ink space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Equipes ou individual:</strong> você pode se inscrever em equipe (2 a 4 pessoas) ou individualmente. Participantes individuais serão agrupados na sessão de matchmaking matinal (9h40).
                </li>
                <li>
                  <strong>Acesso ao campus:</strong> o número de documento de identidade ou passaporte é estritamente obrigatório para emissão da autorização de entrada na portaria da Universidad de los Andes.
                </li>
                <li>
                  <strong>Alimentação:</strong> almoço completo garantido para os participantes selecionados, com café e lanches ao longo do dia.
                </li>
                <li>
                  <strong>Prazo de inscrição:</strong> terça-feira, 10 de novembro às 23h59.
                </li>
              </ul>
              <div className="pt-2 text-body-sm">
                Deseja consultar os 5 frentes de pesquisa ou critérios de avaliação antes de se inscrever?{" "}
                <Link
                  className="font-medium text-aisc-forest underline underline-offset-[3px] transition-colors hover:text-aisc-forest-deep"
                  href="/pt/defacchackathon"
                >
                  Veja todos os detalhes do hackathon aqui →
                </Link>
              </div>
            </div>
          ) : null}

          <DefAccApplyForm cerrado={cerrado} noIniciado={noIniciado} idioma="pt" />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

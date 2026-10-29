import type { Metadata } from "next";
import SeminarioConfirmForm from "@/components/seminario-confirm-form";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { HERO_CORNER_CLASS, HERO_INNER, HERO_SECTION, PAGE_SHELL } from "@/components/ui";
import { verificarSeleccionada } from "@/lib/firma-seminario";
import {
  DATOS_SEMINARIO,
  confirmacionCerrada,
  textoCierre,
  type SeminarioId,
} from "@/lib/seminarios-confirmar";

/* Igual que /sprint/confirmar: solo en español, sin enlazar desde ningún lado y
   con noindex. Se llega por el enlace firmado del correo de aceptación, que
   trae el nombre, el correo y el seminario. */
export const metadata: Metadata = {
  title: "Confirma tu cupo en los seminarios",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const HERO: Record<SeminarioId, string> = {
  tecnico: "/aisc/patterns/aisc-hero-seminario-tecnico.svg?v=2",
  futuro: "/aisc/patterns/aisc-hero-seminario-futuro.svg?v=2",
};

const RUTA: Record<SeminarioId, string> = {
  tecnico: "/seminarios/tecnico",
  futuro: "/seminarios/futuro-y-riesgos",
};

function Marco({
  seminario,
  hasta,
  children,
}: {
  seminario: SeminarioId | null;
  hasta?: string;
  children: React.ReactNode;
}) {
  const d = seminario ? DATOS_SEMINARIO[seminario] : null;
  return (
    <main className={PAGE_SHELL}>
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
          src={seminario ? HERO[seminario] : "/aisc/patterns/aisc-hero-programas.svg"}
        />
        <SiteHeader active={seminario ? RUTA[seminario] : undefined} />
        <div className={HERO_INNER}>
          <div className="flex max-w-[760px] flex-col gap-5">
            <span className="text-kicker text-aisc-sand/70">
              {d ? d.nombre : "Seminarios de AI Safety Colombia"}
            </span>
            <h1 className="text-display-1 md:text-display-1-lg text-balance text-aisc-sand">
              Confirma tu cupo
            </h1>
            {d ? (
              <p className="text-body md:text-body-lg max-w-[660px] text-aisc-sand/90">
                Responde antes {textoCierre(hasta).replace(/^el /, "del ")}.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="bg-aisc-sand">
        <div className="mx-auto w-full max-w-[900px] px-6 pt-12 pb-16 md:px-8 md:pt-16 md:pb-20">
          {children}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function Aviso({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="rounded-lg border border-aisc-ink bg-aisc-cream p-6 md:p-9 lg:p-11">
      <h2 className="text-display-3 md:text-display-3-lg text-balance text-aisc-ink">{titulo}</h2>
      <p className="text-body-sm mt-4 text-aisc-ink">{texto}</p>
      <p className="text-body-sm mt-4 text-aisc-ink">
        Escríbenos a{" "}
        <a
          className="text-aisc-forest transition-colors hover:text-aisc-coral"
          href="mailto:equipo@aisafetycolombia.org"
        >
          equipo@aisafetycolombia.org
        </a>{" "}
        y lo resolvemos.
      </p>
    </div>
  );
}

export default async function Confirmar({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;
  const persona = verificarSeleccionada(t);

  if (!persona) {
    return (
      <Marco seminario={null}>
        <Aviso
          titulo="Este enlace no sirve."
          texto="Puede que se haya cortado al copiarlo del correo. Ábrelo directamente desde el correo de aceptación."
        />
      </Marco>
    );
  }

  if (confirmacionCerrada(persona.hasta)) {
    return (
      <Marco seminario={persona.seminario} hasta={persona.hasta}>
        <Aviso
          titulo="La confirmación ya cerró."
          texto={`Cerró ${textoCierre(persona.hasta)} y las cohortes ya están armadas. Si todavía quieres tu cupo, escríbenos y miramos si queda espacio.`}
        />
      </Marco>
    );
  }

  return (
    <Marco seminario={persona.seminario} hasta={persona.hasta}>
      <SeminarioConfirmForm
        token={t ?? ""}
        nombre={persona.nombre}
        seminario={persona.seminario}
        remoto={persona.remoto}
      />
    </Marco>
  );
}

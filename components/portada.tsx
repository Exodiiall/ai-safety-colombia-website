import Link from "next/link";
import CtaPanel from "./cta-panel";
import HackathonBanner from "./hackathon-banner";
import Puntos, { type Patron } from "./puntos";
import SiteFooter from "./site-footer";
import SiteHeader from "./site-header";
import { CTA_LINK, CTA_LINK_PRIMARY, CTA_LINK_VERDE } from "./ui";
import { type Idioma, rutaEn } from "@/lib/idiomas";
import { PORTADAS } from "@/lib/portadas";
import { cargarEventos, fechaLarga, partirEventos } from "@/lib/eventos";

/* La portada, en los tres idiomas. La estructura es la de apartresearch.com
   (tesis, quién nos apoya, los programas, la comunidad y lo que se ha
   publicado) y la estética la de aisafety.sg: papel blanco, verde
   muy oscuro, dibujos de líneas finas e íconos de puntos. La letra, el ancho de
   columna, los bordes y el ritmo entre secciones son los de las páginas
   interiores, para que la portada no se lea como otro sitio.
   Las tres app/…/page.tsx solo ponen los metadatos y llaman a esta. */

const WHATSAPP = "https://chat.whatsapp.com/KhjJqDNVviK3aX5S4q79EF";
const AGENDAR = "https://cal.com/josegelves/meeting";

type Textos = {
  hero: { titulo: string; texto: string; programas: string; unete: string };
  aliados: string;
  investigacion: { titulo: string; texto: string; piezas: { tipo: string; fecha: string; venue: string; autores: string }[] };
  programas: {
    titulo: string;
    texto: string;
    tarjetas: { kicker: string; titulo: string; texto: string; enlaces: string[] }[];
  };
  comunidad: { titulo: string; texto: string; eventos: string };
  cierre: { titulo: string; texto: string; whatsapp: string; agendar: string; escribir: string };
};

export const TEXTOS: Record<Idioma, Textos> = {
  es: {
    hero: {
      titulo: "De Colombia a la frontera de la seguridad de la IA",
      texto: "Si te interesa que la inteligencia artificial avance de forma segura, acá encuentras apoyo para acelerar tu carrera en este campo.",
      programas: "Ver los programas",
      unete: "Únete a la comunidad",
    },
    aliados: "Trabajamos con",
    investigacion: {
      titulo: "Investigación",
      texto: "Artículos y documentos de trabajo firmados por miembros de la comunidad.",
      piezas: [
        { tipo: "Documento de trabajo", fecha: "Diciembre de 2025", venue: "Oxford Martin AI Governance Initiative", autores: "Camila Beltran y 18 coautores" },
        { tipo: "Artículo aceptado en taller", fecha: "Octubre de 2025", venue: "Dos talleres de NeurIPS 2025", autores: "Fernando Avalos y 5 coautores" },
        { tipo: "Artículo revisado por pares", fecha: "Julio de 2025", venue: "Revista de Estudios Sociales, Universidad de los Andes", autores: "Mónica A. Ulloa Ruiz y Guillem Bas Graells" },
      ],
    },
    programas: {
      titulo: "Programas",
      texto: "Para estudiar el campo en grupo, sacar adelante un primer proyecto o escuchar a quienes ya investigan.",
      tarjetas: [
        {
          kicker: "Cinco o seis semanas",
          titulo: "Seminarios",
          texto: "Lees los cursos de BlueDot y los discutes cada semana en grupo, con facilitación en español.",
          enlaces: ["Ver el técnico", "Ver futuro y riesgos"],
        },
        {
          kicker: "14 de noviembre · Uniandes",
          titulo: "Hackatón y sprints",
          texto: "Diseña defensas de IA en el Defensive Acceleration Hackathon (Uniandes) o investiga en sprints con Apart Research.",
          enlaces: ["Hackatón 14 Nov", "Ver proyectos"],
        },
        {
          kicker: "Cada quince días",
          titulo: "Grupo de lectura",
          texto: "Leemos y discutimos trabajos sobre AI Control: cómo supervisar a un sistema de IA que actúa por su cuenta. Abierto y sin requisitos previos.",
          enlaces: ["Ver el grupo"],
        },
        {
          kicker: "Una vez al mes",
          titulo: "Charlas de investigación",
          texto: "Alguien que investiga en seguridad de la IA presenta su trabajo en quince minutos y después responde preguntas.",
          enlaces: ["Ver las charlas"],
        },
      ],
    },
    comunidad: {
      titulo: "Comunidad y eventos",
      texto: "Charlas, cenas de discusión y paneles en Bogotá, para conocer a quienes trabajan en esto y discutir con ellos.",
      eventos: "Ver los eventos",
    },
    cierre: {
      titulo: "¿Quieres entrar?",
      texto: "No hace falta ser investigador ni haber estudiado inteligencia artificial.",
      whatsapp: "Entrar al grupo de WhatsApp",
      agendar: "Agendar 20 minutos",
      escribir: "Escribirnos",
    },
  },
  en: {
    hero: {
      titulo: "From Colombia to the frontier of AI safety",
      texto: "If you care about artificial intelligence going well, this is where you find support to accelerate your career in the field.",
      programas: "See the programs",
      unete: "Join the community",
    },
    aliados: "We work with",
    investigacion: {
      titulo: "Research",
      texto: "Papers and working papers by members of the community.",
      piezas: [
        { tipo: "Working paper", fecha: "December 2025", venue: "Oxford Martin AI Governance Initiative", autores: "Camila Beltran and 18 co-authors" },
        { tipo: "Workshop paper", fecha: "October 2025", venue: "Two NeurIPS 2025 workshops", autores: "Fernando Avalos and 5 co-authors" },
        { tipo: "Peer-reviewed article", fecha: "July 2025", venue: "Revista de Estudios Sociales, Universidad de los Andes", autores: "Mónica A. Ulloa Ruiz and Guillem Bas Graells" },
      ],
    },
    programas: {
      titulo: "Programs",
      texto: "To study the field in a group, get a first project done, or hear from the people already doing research.",
      tarjetas: [
        {
          kicker: "Five or six weeks",
          titulo: "Seminars",
          texto: "You read the BlueDot courses and discuss them every week in a group, facilitated in Spanish.",
          enlaces: ["See Technical", "See Future and Risks"],
        },
        {
          kicker: "November 14 · Uniandes",
          titulo: "Hackathon & sprints",
          texto: "Build AI defenses at the Defensive Acceleration Hackathon (Uniandes) or conduct research in sprints with Apart Research.",
          enlaces: ["Hackathon Nov 14", "See projects"],
        },
        {
          kicker: "Every two weeks",
          titulo: "Reading group",
          texto: "We read and discuss work on AI control: how to oversee an AI system that acts on its own. Open, with no prerequisites.",
          enlaces: ["See the group"],
        },
        {
          kicker: "Once a month",
          titulo: "Research talks",
          texto: "Someone doing AI safety research presents their work in fifteen minutes and then takes questions.",
          enlaces: ["See the talks"],
        },
      ],
    },
    comunidad: {
      titulo: "Community and events",
      texto: "Talks, discussion dinners and panels in Bogotá, to meet the people working on this and argue with them.",
      eventos: "See the events",
    },
    cierre: {
      titulo: "Want in?",
      texto: "You do not need to be a researcher, and you do not need to have studied artificial intelligence.",
      whatsapp: "Join the WhatsApp group",
      agendar: "Book 20 minutes",
      escribir: "Write to us",
    },
  },
  pt: {
    hero: {
      titulo: "Da Colômbia à fronteira da segurança da IA",
      texto: "Se te interessa que a inteligência artificial avance de forma segura, aqui você encontra apoio para acelerar sua carreira nesta área.",
      programas: "Ver os programas",
      unete: "Entre na comunidade",
    },
    aliados: "Trabalhamos com",
    investigacion: {
      titulo: "Pesquisa",
      texto: "Artigos e documentos de trabalho assinados por membros da comunidade.",
      piezas: [
        { tipo: "Documento de trabalho", fecha: "Dezembro de 2025", venue: "Oxford Martin AI Governance Initiative", autores: "Camila Beltran e 18 coautores" },
        { tipo: "Artigo aceito em workshop", fecha: "Outubro de 2025", venue: "Dois workshops da NeurIPS 2025", autores: "Fernando Avalos e 5 coautores" },
        { tipo: "Artigo revisado por pares", fecha: "Julho de 2025", venue: "Revista de Estudios Sociales, Universidad de los Andes", autores: "Mónica A. Ulloa Ruiz e Guillem Bas Graells" },
      ],
    },
    programas: {
      titulo: "Programas",
      texto: "Para estudar a área em grupo, tirar do papel um primeiro projeto ou ouvir quem já pesquisa.",
      tarjetas: [
        {
          kicker: "Cinco ou seis semanas",
          titulo: "Seminários",
          texto: "Você lê os cursos da BlueDot e os discute toda semana em grupo, com facilitação em espanhol.",
          enlaces: ["Ver o técnico", "Ver futuro e riscos"],
        },
        {
          kicker: "14 de novembro · Uniandes",
          titulo: "Hackathon e sprints",
          texto: "Construa defesas de IA no Defensive Acceleration Hackathon (Uniandes) ou pesquise em sprints com a Apart Research.",
          enlaces: ["Hackathon 14 Nov", "Ver projetos"],
        },
        {
          kicker: "A cada quinze dias",
          titulo: "Grupo de leitura",
          texto: "Lemos e discutimos trabalhos sobre AI Control: como supervisionar um sistema de IA que age por conta própria. Aberto e sem pré-requisitos.",
          enlaces: ["Ver o grupo"],
        },
        {
          kicker: "Uma vez por mês",
          titulo: "Palestras de pesquisa",
          texto: "Alguém que pesquisa segurança da IA apresenta seu trabalho em quinze minutos e depois responde perguntas.",
          enlaces: ["Ver as palestras"],
        },
      ],
    },
    comunidad: {
      titulo: "Comunidade e eventos",
      texto: "Palestras, jantares de discussão e painéis em Bogotá, para conhecer quem trabalha nisso e discutir com essas pessoas.",
      eventos: "Ver os eventos",
    },
    cierre: {
      titulo: "Quer entrar?",
      texto: "Não é preciso ser pesquisador nem ter estudado inteligência artificial.",
      whatsapp: "Entrar no grupo de WhatsApp",
      agendar: "Agendar 20 minutos",
      escribir: "Escrever para nós",
    },
  },
};

/** Los logos van en el idioma que sea: son nombres propios. */
const ALIADOS = [
  { name: "Apart Research", logo: "/aisc/aliados/apart.png", href: "https://apartresearch.com", alto: "h-6" },
  { name: "BlueDot Impact", logo: "/aisc/aliados/bluedot.png", href: "https://bluedot.org", alto: "h-6" },
  { name: "Kairos", logo: "/aisc/aliados/kairos.png", href: "https://kairos-project.org", alto: "h-7" },
  { name: "Coefficient Giving", logo: "/aisc/aliados/coefficient-giving.svg", href: "https://www.coefficientgiving.org", alto: "h-7" },
];

/** Las tres publicaciones de /investigacion, en el mismo orden. */
const PUBLICACIONES = [
  {
    titulo: "AI Benefit-Sharing Framework: Balancing Access and Safety",
    href: "https://aigi.ox.ac.uk/publications/ai-benefit-sharing-framework-balancing-access-and-safety/",
  },
  {
    titulo: "Approximating Human Preferences Using a Multi-Judge Learned System",
    href: "https://arxiv.org/abs/2510.25884",
  },
  {
    titulo: "La securitización de la inteligencia artificial: un análisis de sus impulsores y sus consecuencias",
    href: "https://revistas.uniandes.edu.co/index.php/res/article/view/10754",
  },
];

/** Para cada programa, su ícono y a dónde lleva cada enlace (rutas en español; se traducen abajo). */
const PROGRAMAS: { patron: Patron; rutas: string[] }[] = [
  { patron: "seminarios", rutas: ["/seminarios/tecnico", "/seminarios/futuro-y-riesgos"] },
  { patron: "sprints", rutas: ["/defacchackathon", "/investigacion#hackathons"] },
  { patron: "lectura", rutas: ["/unete"] },
  { patron: "charlas", rutas: ["/eventos"] },
];

const COLUMNA = "mx-auto w-full max-w-[1448px] px-8 md:px-16";
const ENLACE_SERIF = "text-display-4 md:text-display-4-lg transition-colors hover:text-aisc-coral";

/** El encabezado de sección de aisafety.sg: filete arriba, título a la izquierda, texto a la derecha. */
function Cabecera({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-5 border-t border-aisc-forest/50 pt-8 md:grid-cols-2 md:gap-16 md:pt-10">
      <h2 className="text-display-2 md:text-display-2-lg text-balance">{titulo}</h2>
      <p className="text-body md:text-body-lg max-w-[560px] text-aisc-ink/85">{children}</p>
    </div>
  );
}

export default async function Portada({ idioma }: { idioma: Idioma }) {
  const t = TEXTOS[idioma];
  const ruta = (r: string) => rutaEn(idioma, r);
  const conAncla = (r: string) => {
    const [base, ancla] = r.split("#");
    return ancla ? `${ruta(base)}#${ancla}` : ruta(base);
  };
  /* Los mismos destacados de /eventos, en el mismo orden: del más reciente al más viejo. */
  const destacados = partirEventos(await cargarEventos()).pasados.filter((e) => e.destacado && e.portada).slice(0, 4);

  return (
    <main className="aisc-page flex flex-col">
      {/* ------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden bg-aisc-forest-deep text-aisc-sand">
        <img
          src="/aisc/patterns/aisc-triangulo-haces.svg"
          alt=""
          aria-hidden="true"
          width={1060}
          height={680}
          className="pointer-events-none absolute top-0 -right-[55%] h-full w-auto max-w-none select-none opacity-35 sm:-right-[30%] md:-right-[14%] md:opacity-100 xl:right-0"
        />
        <SiteHeader />
        <div className={`${COLUMNA} relative z-10 flex min-h-[540px] flex-col justify-end pt-32 pb-16 md:min-h-[600px] md:pb-20`}>
          <h1 className="text-display-1 md:text-display-1-lg max-w-[720px] text-balance">{t.hero.titulo}</h1>
          <p className="text-body md:text-body-lg mt-6 max-w-[540px] text-aisc-sand/80">{t.hero.texto}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a className={CTA_LINK_PRIMARY} href="#programas">
              {t.hero.programas}
            </a>
            <Link className={CTA_LINK} href={ruta("/unete")}>
              {t.hero.unete}
            </Link>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- aliados */}
      <section className="border-b border-aisc-line">
        <div className={`${COLUMNA} flex flex-col gap-6 py-9 md:flex-row md:items-center md:gap-10 md:py-10`}>
          <span className="text-kicker shrink-0 text-aisc-muted">{t.aliados}</span>
          <ul className="grid grid-cols-2 items-center gap-x-6 gap-y-6 sm:flex sm:flex-wrap sm:gap-x-8 md:gap-x-10">
            {ALIADOS.map((a) => (
              <li key={a.name}>
                <a href={a.href} target="_blank" rel="noopener noreferrer" className="block w-fit">
                  <img
                    src={a.logo}
                    alt={a.name}
                    className={`${a.alto} w-auto max-w-full object-contain sm:max-w-[170px]`}
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* -------------------------------------------------- banner hackathon */}
      <section className="pt-10 pb-2">
        <div className={COLUMNA}>
          <HackathonBanner />
        </div>
      </section>

      {/* ------------------------------------------------------- programas */}
      <section id="programas" className="scroll-mt-24 pt-14 md:pt-16">
        <div className={COLUMNA}>
          <Cabecera titulo={t.programas.titulo}>{t.programas.texto}</Cabecera>
          <ul className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 xl:grid-cols-4">
            {PROGRAMAS.map((p, i) => {
              const d = t.programas.tarjetas[i];
              const oscura = i === 0;
              return (
                <li
                  key={p.patron}
                  className={`flex flex-col rounded-[var(--radius)] p-7 md:p-8 ${
                    oscura ? "bg-aisc-forest-deep text-aisc-sand" : "border border-aisc-forest-deep/25"
                  }`}
                >
                  <Puntos patron={p.patron} className={`size-9 ${oscura ? "text-aisc-mint" : "text-aisc-forest"}`} />
                  <span className={`text-kicker mt-8 ${oscura ? "text-aisc-mint" : "text-aisc-muted"}`}>{d.kicker}</span>
                  <h3 className="text-display-3 md:text-display-3-lg mt-3">{d.titulo}</h3>
                  <p className={`text-body-sm mt-3 ${oscura ? "text-aisc-sand/80" : "text-aisc-ink/80"}`}>{d.texto}</p>
                  <div className="mt-auto flex flex-wrap gap-x-6 gap-y-1 pt-8">
                    {p.rutas.map((r, j) => (
                      <Link key={r} href={conAncla(r)} className={`${ENLACE_SERIF} ${oscura ? "text-aisc-sand" : "text-aisc-forest"}`}>
                        {d.enlaces[j]}
                      </Link>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------- comunidad */}
      <section className="pt-14 md:pt-16">
        <div className="mx-auto w-full max-w-[1448px] px-4 md:px-8">
          <div className="grid items-center gap-10 rounded-[var(--radius)] bg-aisc-sand px-4 py-10 md:px-8 md:py-14 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-16">
            <ul className="grid grid-cols-2 gap-2 md:gap-3">
              {destacados.map((e) => (
                <li key={e.id}>
                  <Link
                    href={`${ruta("/eventos")}#evento-${e.id}`}
                    aria-label={`${e.titulo}, ${fechaLarga(e.inicio, idioma)}`}
                    title={e.titulo}
                    className="group block aspect-[16/9] overflow-hidden rounded-xl bg-aisc-forest-deep"
                  >
                    <img src={e.portada} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="border-t border-aisc-forest/50 pt-8">
              <h2 className="text-display-2 md:text-display-2-lg text-balance">{t.comunidad.titulo}</h2>
              <p className="text-body md:text-body-lg mt-5 max-w-[520px] text-aisc-ink/85">{t.comunidad.texto}</p>
              <Link className={`${CTA_LINK_VERDE} mt-8`} href={ruta("/eventos")}>
                {t.comunidad.eventos}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- investigación */}
      <section className="pt-14 pb-14 md:pt-16 md:pb-16">
        <div className={COLUMNA}>
          <Cabecera titulo={t.investigacion.titulo}>{t.investigacion.texto}</Cabecera>
          <ul className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3">
            {PUBLICACIONES.map((p, i) => {
              const d = t.investigacion.piezas[i];
              return (
                <li key={p.href} className="flex">
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex w-full flex-col overflow-hidden rounded-[var(--radius)] border border-aisc-forest-deep/25 transition-colors hover:border-aisc-forest-deep/60"
                  >
                    {/* la primera página del documento, como una hoja sobre la mesa:
                        se ve el título y el resto se va por debajo del borde */}
                    <div aria-hidden="true" className="relative aspect-[600/340] w-full overflow-hidden border-b border-aisc-forest-deep/25 bg-aisc-sand">
                      <img
                        src={PORTADAS[p.href]}
                        alt=""
                        width={900}
                        height={1165}
                        loading="lazy"
                        className="absolute top-[14%] left-1/2 w-[58%] -translate-x-1/2 shadow-[0_10px_30px_-8px_rgba(20,54,32,0.35)] ring-1 ring-aisc-forest-deep/10 transition-transform duration-300 group-hover:-translate-y-1.5"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6 md:p-7">
                      <span className="text-meta text-aisc-muted">
                        {d.tipo} · {d.fecha}
                      </span>
                      <h3 className="text-display-4 md:text-display-4-lg mt-3 text-balance transition-colors group-hover:text-aisc-forest">
                        {p.titulo}
                      </h3>
                      <div className="text-body-sm mt-auto flex flex-col gap-0.5 pt-6 text-aisc-muted">
                        <span>{d.venue}</span>
                        <span>{d.autores}</span>
                      </div>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <CtaPanel title={t.cierre.titulo} body={t.cierre.texto}>
        <a className={CTA_LINK_PRIMARY} href={WHATSAPP} target="_blank" rel="noopener noreferrer">
          {t.cierre.whatsapp}
        </a>
        <a className={CTA_LINK} href={AGENDAR} target="_blank" rel="noopener noreferrer">
          {t.cierre.agendar}
        </a>
        <a className={CTA_LINK} href="mailto:equipo@aisafetycolombia.org">
          {t.cierre.escribir}
        </a>
      </CtaPanel>
      <SiteFooter idioma={idioma} />
    </main>
  );
}

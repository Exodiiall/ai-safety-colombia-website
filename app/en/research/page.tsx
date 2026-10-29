import type { Metadata } from "next";
import Link from "next/link";
import CtaPanel from "@/components/cta-panel";
import SiteFooter from "@/components/site-footer";
import PremiadosHackathon, { type Premiado } from "@/components/premiados-hackathon";
import OtrosProyectos from "@/components/otros-proyectos";
import SiteHeader from "@/components/site-header";
import { CTA_LINK, CTA_LINK_PRIMARY, HERO_CORNER_CLASS, HERO_INNER, HERO_SECTION, PAGE_SHELL } from "@/components/ui";
import { alternativas } from "@/lib/idiomas";
import { PORTADAS } from "@/lib/portadas";

export const metadata: Metadata = {
  title: "Research",
  description:
    "What the members of AI Safety Colombia publish: peer-reviewed articles, working papers, research reports and the output of our hackathons.",
  alternates: { canonical: "/en/research", languages: alternativas("/en/research") },
};

/* Publicaciones en las que alguien de la comunidad aparece como autor.
   `miembros` marca en negrilla a quien es de acá dentro de la lista de autores,
   que se transcribe completa y en el orden en que la publicó el editor. Los
   títulos van como los publicó cada editor, sin traducir. */
const PUBLICACIONES = [
  {
    titulo: "AI Benefit-Sharing Framework: Balancing Access and Safety",
    tipo: "Working paper",
    editor: "Oxford Martin AI Governance Initiative, University of Oxford",
    fecha: "December 2025",
    autores: [
      "Sumaya Nur Adan",
      "Joanna Wiaterek",
      "Varun Sen Bahl",
      "Ima Bello",
      "Camila Beltran",
      "Tobias Dierks",
      "Luise Eder",
      "Liam Epstein",
      "Abra Ganz",
      "Natalie Kiilu",
      "Marianne Lu",
      "Chinasa T. Okolo",
      "Sydney Reis",
      "Said Saillant",
      "Krishna Sharma",
      "Marjia Siddik",
      "Jan Pieter Snoeij",
      "José Jaime Villalobos",
      "Anna Yelizarova",
    ],
    miembros: ["Camila Beltran"],
    body: "It proposes a framework for sharing the benefits of AI without lowering the safety standard. It rests on three pieces: redistributing part of the economic returns, sharing technology and technical capacity, and containing the spread of dangerous capabilities. The underlying argument is that current governance does not settle who gets access to those benefits, and that countries of the global majority are the ones left out.",
    href: "https://aigi.ox.ac.uk/publications/ai-benefit-sharing-framework-balancing-access-and-safety/",
  },
  {
    titulo: "Approximating Human Preferences Using a Multi-Judge Learned System",
    tipo: "Workshop paper",
    editor: "arXiv. Accepted at two NeurIPS 2025 workshops: Reliable ML from Unreliable Data and Latinx in AI",
    fecha: "October 2025",
    autores: [
      "Eitán Sprejer",
      "Fernando Avalos",
      "Augusto Bernardi",
      "Jose Pedro Brito de Azevedo Faustino",
      "Jacob Haimes",
      "Narmeen Fatimah Oozeer",
    ],
    miembros: ["Fernando Avalos"],
    body: "Language models are increasingly used as judges that grade the answers of other models. The problem is that they grade badly: they shift criteria depending on how the rubric is worded, they carry biases and they are unstable. The paper proposes not trusting a single judge but combining several, each with its own rubric, and learning how much each one weighs. The resulting system shows which judge weighed most in each decision, so you can check why it graded the way it did.",
    href: "https://arxiv.org/abs/2510.25884",
  },
  {
    titulo: "La securitización de la inteligencia artificial: un análisis de sus impulsores y sus consecuencias",
    tipo: "Peer-reviewed article",
    editor: "Revista de Estudios Sociales no. 93, Universidad de los Andes",
    fecha: "July 2025",
    autores: ["Mónica A. Ulloa Ruiz", "Guillem Bas Graells"],
    miembros: ["Mónica A. Ulloa Ruiz"],
    body: "It studies what happens when artificial intelligence is framed in the United States as a matter of national security. The authors review twenty-five public statements from government agencies, technical organisations and the press, and find two ways of posing the problem: one speaks of threats, points at a specific adversary and serves to justify exceptional measures; the other speaks of risks and fits inside ordinary regulation. The conclusion is that the second sustains long-term cooperation better.",
    href: "https://revistas.uniandes.edu.co/index.php/res/article/view/10754",
  },
];

/* AI Incident Response Sprint, septiembre de 2026. Ningun equipo colombiano
   quedo entre los premiados; van los seis que quedaron en el 25 % mejor segun las
   bandas oficiales de Apart (19 oct 2026), y solo uno en el 10 %. */
const INCIDENTES: Premiado[] = [
  {
    titulo: "Containment Does Not Compose: Provenance Graphs for Tracing Collective Escape in Multi-Agent Systems",
    premio: "Top 10% of 235 submissions",
    ciudad: "Bogotá",
    equipo: "Camilo Cuello, Elkin Cuello, Carlos Sandoval and David Adames",
    body: "Every agent passes the audit of its own container, yet together they assemble a credential none of them holds: 48 escapes in 95 episodes. A provenance graph traces each one back to the containers and messages behind it.",
    href: "https://apartresearch.com/project/containment-does-not-compose-provenance-graphs-for-tracing-collective-escape-in-multiagent-systems-pm4n",
  },
  {
    titulo: "Detecting Sandbox Escape in LLM Agents: Time to Detection, and What the Measurement Hides",
    premio: "Top 25% of 235 submissions",
    ciudad: "Bogotá",
    equipo: "Sergio Castaño, Angie Gutierrez, Juan Triviño, Sofia Rodriguez and Daniel Diab",
    body: "Measures how long it takes to notice that an agent has left its sandbox. In 183 of 197 leaks the data left through file and folder names, a channel a network proxy cannot see.",
    href: "https://apartresearch.com/project/canaryforge-xi71",
  },
  {
    titulo: "Rare Once It Costs Anything: Costly Cooperation Between LLM Agents",
    premio: "Top 25% of 235 submissions",
    ciudad: "Bogotá",
    equipo: "David Daza, Andres Mosquera and Víctor Gelves",
    body: "An experiment in which helping another agent always costs the helper, to measure when models cooperate anyway and how much the price matters.",
    href: "https://apartresearch.com/project/rare-once-it-costs-anything-costly-cooperation-between-llm-agents-loz0",
  },
  {
    titulo: "The Certified Effect: Why Testing AI Agents at Onboarding Shifts Risk Instead of Reducing It",
    premio: "Top 25% of 235 submissions",
    ciudad: "Bogotá",
    equipo: "Carlos Sinuco and Juan Rengifo",
    body: "Simulates what happens when passing the onboarding evaluation gives an agent more privileges: data exfiltration rises two to three times compared with evaluating without a reward.",
    href: "https://apartresearch.com/project/the-certified-effect-why-testing-ai-agents-at-onboarding-shifts-risk-instead-of-reducing-it-9eyr",
  },
  {
    titulo: "Sensing Disruption: Output Entropy as a Channel-Agnostic Monitor for LLM Agents",
    premio: "Top 25% of 235 submissions",
    ciudad: "Bogotá",
    equipo: "Daniel Diaz, Roger Palomeque, Alejandro Sanchez, Sergio Montoya and Juan Melgarejo",
    body: "Measures the entropy of an agent's output to notice when text it shouldn't have received reaches it, without reading its logs or reasoning. Across 539 runs with three models, the signal worked for some and not for others.",
    href: "https://apartresearch.com/project/sensing-disruption-output-entropy-as-a-channelagnostic-monitor-for-llm-agents-n2j2",
  },
  {
    titulo: "Verifiable Containment for AI Agents: An Attestation Schema a Third Party Can Check",
    premio: "Top 25% of 235 submissions",
    ciudad: "Bogotá",
    equipo: "Santiago Contreras and Silvana Alvarez",
    body: "Proposes a signed declaration of what an agent's environment was allowed to do, which a third party can check without access to the lab's network. In the OpenAI–Hugging Face incident it doesn't prevent the escape, but it limits how long it stays invisible from outside.",
    href: "https://apartresearch.com/project/verifiable-containment-for-ai-agents-an-attestation-schema-a-third-party-can-check-sx4m",
  },
];

/* Los otros proyectos del AI Incident Response Sprint con integrantes en
   Colombia, ordenados por el puntaje de los jurados. */
const OTROS_INCIDENTES = [
  {
    titulo: "Declared Isolation Is Not Verified Isolation",
    ciudad: "Bogotá",
    href: "https://apartresearch.com/project/declared-isolation-is-not-verified-isolation-uity",
    equipo: "Marlon Naranjo and Carlos Andrés Romero Orduz",
  },
  {
    titulo: "The Judge Does Not Want the Flag: Reward-Blind Action Gating Stopped a Larger Agent One Step Before the Environment Changed",
    ciudad: "Bogotá",
    href: "https://apartresearch.com/project/the-judge-does-not-want-the-flag-rewardblind-action-gating-stopped-a-larger-agent-one-step-before-the-environment-changed-og9v",
    equipo: "Helen Stefany Penagos, Juan Esteban Leiva, Jhon Bedoya and Valentina Rodriguez",
  },
  {
    titulo: "Observer-Cheat Test: Containment Adequacy under Opaque Intent for Guardrails-Off Agent Evaluations",
    ciudad: "Bogotá",
    href: "https://apartresearch.com/project/observercheat-test-containment-adequacy-under-opaque-intent-for-guardrailsoff-agent-evaluations-ook9",
    equipo: "José Armando Son Rojas",
  },
  {
    titulo: "Limitations in Existing Regulatory Mechanisms When Applied to Attacks by AI Agents",
    ciudad: "Bogotá",
    href: "https://apartresearch.com/project/limitations-in-existing-regulatory-mechanisms-when-applied-to-attacks-by-ai-agents-5olx",
    equipo: "Juan Jeronimo Manriquez and Tomás Cifuentes Clavijo",
  },
  {
    titulo: "Secure-maxxing.txt: A Way for a Website to Say No to a Misused Agent",
    ciudad: "Bogotá",
    href: "https://apartresearch.com/project/securemaxxingtxt-a-way-for-a-website-to-say-no-to-a-misused-agent-m23i",
    equipo: "María José Beltrán Losada, Jairo Torregrosa and Maryury Alexandra Muñoz Burbano",
  },
  {
    titulo: "Convention for Early Notification of AI Incidents",
    ciudad: "Bogotá",
    href: "https://apartresearch.com/project/convention-for-early-notification-of-ai-incidents-x055",
    equipo: "Tomas Antolinez and Mariana Zuluaga Abril",
  },
  {
    titulo: "AI in the First Person Micro Course",
    ciudad: "Bogotá",
    href: "https://apartresearch.com/project/ai-in-the-first-person-micro-course-jhxo",
    equipo: "Erick Santos",
  },
  {
    titulo: "BUDGET-NLA: Risk-Weighted Adaptive Monitoring for Pre-Harm Sabotage Containment",
    ciudad: "Cali",
    href: "https://apartresearch.com/project/budgetnla-riskweighted-adaptive-monitoring-for-preharm-sabotage-containment-x08q",
    equipo: "Juan Felipe Plata Barbosa",
  },
  {
    titulo: "IntegrityGym: Does the Watcher Change the Agent? External Flight Recording, Evaluation Integrity, and the Observer Effect in Autonomous Cyber Agents",
    ciudad: "Bogotá",
    href: "https://apartresearch.com/project/integritygym-does-the-watcher-change-the-agent-external-flight-recording-evaluation-integrity-and-the-observer-effect-in-autonomous-cyber-agents-k1ez",
    equipo: "Alejandro Ortiz Tique",
  },
  {
    titulo: "Reading an Agent’s Report Before It Exists: A Pre-Execution Monitor at the ReAct Commit Point, and Why Most of Its Signal Was an Artifact",
    ciudad: "Cali",
    href: "https://apartresearch.com/project/reading-an-agents-report-before-it-exists-a-preexecution-monitor-at-the-react-commit-point-and-why-most-of-its-signal-was-an-artifac-6zdr",
    equipo: "Juan Camilo Meléndez Torres and Gilber Alexis Corrales Gallego",
  },
  {
    titulo: "The Agent Incident Registry: A Compliance Verifiability Schema and an Article 91 Instrument for Autonomous Agent Incidents",
    ciudad: "Bogotá",
    href: "https://apartresearch.com/project/the-agent-incident-registry-a-compliance-verifiability-schema-and-an-article-91-instrument-for-autonomous-agent-incidents1-h6ew",
    equipo: "Angie Paola Giraldo Ramirez",
  },
  {
    titulo: "Minimum Viable Cross-Border Response Protocol for Agentic AI Incidents (MVCRP)",
    ciudad: "Colombia",
    href: "https://apartresearch.com/project/minimum-viable-crossborder-response-protocol-for-agentic-ai-incidents-mvcrp-qsj8",
    equipo: "Andrés Mogollón and Isabel Salazar",
  },
  {
    titulo: "Evaluación holística y multi-metodológica de propuestas de seguridad en IA",
    ciudad: "Bogotá",
    href: "https://apartresearch.com/project/evaluacin-holstica-y-multimetodolgica-de-propuestas-de-seguridad-en-ia-j9pf",
    equipo: "Mateo Acosta",
  },
];

/* Lo premiado. Cada tarjeta enlaza al reporte publico en Apart, que es donde se
   puede comprobar el premio y leer el trabajo completo. */
const PREMIADOS: Premiado[] = [
  {
    titulo: "Gobernar el uso de drones hoy, las armas autónomas mañana",
    premio: "Latin America prize",
    ciudad: "Bogotá",
    equipo: "Leonardo Párraga, Angie Giraldo and Víctor Gelves",
    body: "An open dataset of 42 commercial drone attacks in Colombia, to establish who picks the target and who pulls the trigger.",
    href: "https://apartresearch.com/project/coldron-lj2w",
  },
  {
    titulo: "Probing Latent Colombian Identity Inferences in Qwen2.5-7B with Natural Language Autoencoders",
    premio: "Latin America prize",
    ciudad: "Cali",
    equipo: "Gilber Corrales, Pablo Potes, Jhoan Mosquera, Nicolás Lozano, María del Mar García and Óscar Pérez",
    body: "Measures whether Qwen2.5-7B internally infers the Colombian identity and social class of whoever writes to it, and whether that carries stereotypes.",
    href: "https://apartresearch.com/project/probing-latent-colombian-identity-inferences-in-qwen257b-with-natural-language-autoencoders-mucf",
  },
  {
    titulo: "Thought Anchors for Social Bias: Which Reasoning Steps Matter in Extended Thinking LLMs on Latin American Scenarios",
    premio: "Latin America prize",
    ciudad: "Bogotá",
    equipo: "Andres Mosquera",
    body: "Identifies which intermediate reasoning steps produce stereotyped answers in Latin American scenarios.",
    href: "https://apartresearch.com/project/thought-anchors-for-social-bias-which-reasoning-steps-matter-in-extended-thinking-llms-on-latin-american-scenarios-27ti",
  },
  {
    titulo: "¿Por qué los agentes obedecen? La dirección de rechazo se debilita en formato agéntico",
    premio: "Honourable mention",
    ciudad: "Bogotá",
    equipo: "Helen Penagos and Juan Leiva",
    body: "Shows that a model's internal refusal mechanism weakens when it operates as an agent with tools.",
    href: "https://apartresearch.com/project/por-qu-los-agentes-obedecen-la-direccin-de-rechazo-se-debilita-en-formato-agntico-ux70",
  },
  {
    titulo: "JusticIA: A Counterfactual Benchmark for Auditing Contextual Biases in Language Models for Transitional Justice",
    premio: "Honourable mention",
    ciudad: "Bogotá",
    equipo: "Lina Gomez, Brenda Barahona and Ernesto Duarte",
    body: "A transitional justice test: change a single piece of context and measure how far the sentence recommended by six models moves.",
    href: "https://apartresearch.com/project/justicia-a-counterfactual-benchmark-for-auditing-contextual-biases-in-language-models-for-transitional-justice-jjvl",
  },
];

/* El resto de equipos con integrantes en Colombia, en el orden en que aparecen
   en el catalogo publico de Apart. */
const OTROS = [
  {
    titulo: "Marco ético para IA aplicada a la preservación lingüística guna de Panamá",
    ciudad: "Bogotá",
    href: "https://apartresearch.com/project/marco-tico-para-ia-aplicada-a-la-preservacin-lingstica-guna-de-panam-6uxw",
    equipo: "Ana María González Aldana, Kelvin Alvarado and Mariana Zuluaga Abril",
  },
  {
    titulo: "Governance Drift Evaluation Framework (GDEF)",
    ciudad: "Colombia",
    href: "https://apartresearch.com/project/governance-drift-evaluation-framework-gdef-vfzj",
    equipo: "Andrés Mogollón, Juan Manuel Cortes Jimenez, Oscar Poveda, Devesh Sawant and Liliana Isabel Salazar",
  },
  {
    titulo: "MnM: Real-Time Behavioral Detection of Prompt Injection via Reasoning Stream Monitoring",
    ciudad: "Bogotá",
    href: "https://apartresearch.com/project/dualclassifier-system-for-llm-security-s491",
    equipo: "Nicolás David Galindo, Daniel Libardo Diaz Gonzalez, Juan Jacobo Izquierdo Becerra and David Andrés Ramírez",
  },
  {
    titulo: "Los peajes de los de abajo",
    ciudad: "Bogotá",
    href: "https://apartresearch.com/project/los-peajes-de-los-de-abajo-i6wx",
    equipo: "Mongui Rogers",
  },
  {
    titulo: "Contestabilidad algorítmica en el Estado colombiano: un canal de objeción asistido por IA",
    ciudad: "Bogotá",
    href: "https://apartresearch.com/project/contestabilidad-algortmica-en-el-estado-colombiano-un-canal-de-objecin-asistido-por-ia-lbsm",
    equipo: "Emely Condor and Federico Perez",
  },
  {
    titulo: "Agentic Commerce and Consumer Protection: Emerging Risks and Regulatory Gaps",
    ciudad: "Bogotá",
    href: "https://apartresearch.com/project/agentic-commerce-and-consumer-protection-emerging-risks-and-regulatory-gaps-be7b",
    equipo: "Francely Carreño, Sofía Botía and Vanessa Reyes",
  },
  {
    titulo: "JurisGuard-LATAM",
    ciudad: "Jamundí",
    href: "https://apartresearch.com/project/jurisguardlatam-sadx",
    equipo: "Jhon Harvey Tejada Tabares",
  },
  {
    titulo: "Honest-Code",
    ciudad: "Bogotá",
    href: "https://apartresearch.com/project/honestcode-8pnk",
    equipo: "Yoel Alfonso",
  },
  {
    titulo: "Mapeo de herramientas (IA) en contextos laborales: el caso de los call centers en Colombia",
    ciudad: "Bogotá",
    href: "https://apartresearch.com/project/mapeo-de-herramientas-ia-en-contextos-laborales-el-caso-de-los-call-centers-en-colombia-k1kk",
    equipo: "Daniel Bravo",
  },
  {
    titulo: "Confía-CO: A Reliability Evaluation for an AI Customer-Service Assistant Operating in Colombian Spanish",
    ciudad: "Bogotá",
    href: "https://apartresearch.com/project/confaco-a-reliability-evaluation-for-an-ai-customerservice-assistant-operating-in-colombian-spanish-vfxt",
    equipo: "Marlon Naranjo",
  },
  {
    titulo: "Herramienta de evaluación y recomendación para la promoción de uso responsable de IA en pymes latinoamericanas",
    ciudad: "Bogotá",
    href: "https://apartresearch.com/project/herramienta-de-evaluacin-y-recomendacin-para-la-promocin-de-uso-responsable-de-ia-en-pymes-latinoamericanas-1gvb",
    equipo: "Diana Marcela Daza Jaimes, David José Daza Jaimes, Juan Camilo Medina Moreno, Luis Carlos Ordoñez Montenegro and Ángela Pinilla Parra",
  },
  {
    titulo: "Beyond English: Assessing the Robustness of LLM Safety Mechanisms Against Structural Jailbreaks in Spanish",
    ciudad: "Cali",
    href: "https://apartresearch.com/project/beyond-english-assessing-the-robustness-of-llm-safety-mechanisms-against-structural-jailbreaks-in-spanish-s4zk",
    equipo: "Jonathan Narvaez",
  },
  {
    titulo: "Guardian LATAM: Early Detection of Hallucination Risk in Spanish-Speaking Multi-Agent AI Systems Using Consensus Geometry",
    ciudad: "Armenia",
    href: "https://apartresearch.com/project/guardian-latam-early-detection-of-hallucination-risk-in-spanishspeaking-multiagent-ai-systems-using-consensus-geometry-5lzw",
    equipo: "Edwin Hernan Cedeño Vargas",
  },
];

const ENLACE =
  "text-aisc-forest transition-colors hover:text-aisc-coral";

export default function Research() {
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
          src="/aisc/patterns/aisc-hero-investigacion.svg"
        />
        <SiteHeader active="/en/research" />
        <div className={HERO_INNER}>
          <div className="flex max-w-[760px] flex-col gap-5">
            <h1 className="text-display-1 md:text-display-1-lg text-balance text-aisc-sand">Research</h1>
            <p className="text-body md:text-body-lg max-w-[660px] text-aisc-sand/90">
              Here is what the people in the community publish: peer-reviewed articles, working papers, research
              reports and the output of our hackathons.
            </p>
          </div>
        </div>
      </section>

      <section id="publicaciones" className="bg-aisc-cream">
        <div className="mx-auto w-full max-w-[1448px] px-8 md:px-16 pt-14 pb-14 md:pb-16">
          <div aria-hidden="true" className="h-px w-full flex-none bg-aisc-forest-deep" />
          <div className="grid grid-cols-1 gap-8 pt-5 pb-12 md:gap-10 md:pt-7 md:pb-14 lg:grid-cols-[minmax(0,1fr)_minmax(400px,0.95fr)] lg:gap-10">
            <h2 className="text-display-2 md:text-display-2-lg text-balance">Publications from the community</h2>
            <div className="text-body md:text-body-lg flex flex-col gap-4 text-aisc-ink">
              <p>
                The list is open. If you are part of the community and you published something,{" "}
                <a className={ENLACE} href="mailto:equipo@aisafetycolombia.org">
                  write to us
                </a>{" "}
                and we will add it.
              </p>
            </div>
          </div>
          <ul className="grid grid-cols-1 gap-[10px]">
            {PUBLICACIONES.map((p) => (
              <li className="flex" key={p.href}>
                <a
                  className="focus-visible:outline-aisc-forest grid w-full grid-cols-1 gap-6 rounded-lg border border-aisc-ink bg-aisc-cream p-6 transition-colors hover:bg-aisc-sand focus-visible:outline-2 focus-visible:outline-offset-[3px] md:p-7 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-10 lg:p-8"
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-kicker text-aisc-forest">{p.tipo}</span>
                    <span className="text-meta text-aisc-muted">{p.editor}</span>
                    <span className="text-meta text-aisc-muted">{p.fecha}</span>
                    {PORTADAS[p.href] ? (
                      <img
                        src={PORTADAS[p.href]}
                        alt=""
                        aria-hidden="true"
                        width={900}
                        height={1165}
                        loading="lazy"
                        className="mt-5 hidden w-full max-w-[200px] shadow-[0_10px_30px_-8px_rgba(20,54,32,0.35)] ring-1 ring-aisc-forest-deep/10 lg:block"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-display-3 md:text-display-3-lg text-balance">{p.titulo}</h3>
                    <p className="text-meta mt-3 text-aisc-muted">
                      {p.autores.map((autor, i) => (
                        <span key={autor}>
                          {i > 0 ? ", " : ""}
                          {p.miembros.includes(autor) ? (
                            <strong className="font-semibold text-aisc-forest">{autor}</strong>
                          ) : (
                            autor
                          )}
                        </span>
                      ))}
                    </p>
                    <p className="text-body-sm mt-4 text-aisc-ink">{p.body}</p>
                    <span className="text-display-4 md:text-display-4-lg mt-6 text-aisc-forest transition-colors hover:text-aisc-coral">
                      Read the document
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="hackathons" className="bg-aisc-cream">
        <div className="mx-auto w-full max-w-[1448px] px-8 md:px-16 pb-14 md:pb-16">
          <div aria-hidden="true" className="h-px w-full flex-none bg-aisc-forest-deep" />
          <div className="grid grid-cols-1 gap-8 pt-5 pb-10 md:gap-10 md:pt-7 md:pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(400px,0.95fr)] lg:gap-10">
            <h2 className="text-display-2 md:text-display-2-lg text-balance">Hackathon projects</h2>
            <p className="text-body md:text-body-lg text-aisc-ink">
              Community teams in the hackathons run by{" "}
              <a className={ENLACE} href="https://apartresearch.com" target="_blank" rel="noopener noreferrer">
                Apart Research
              </a>
              , each with a published report and an evaluation by external judges.
            </p>
          </div>

          <a
            className="text-meta text-aisc-muted transition-colors hover:text-aisc-forest"
            href="https://apartresearch.com/sprints/ai-incident-response-sprint-2026-09-11-to-2026-09-13"
            target="_blank"
            rel="noopener noreferrer"
          >
            AI Incident Response Sprint · September 2026
          </a>
          <div className="mt-4">
            <PremiadosHackathon premiados={INCIDENTES} />
          </div>

          <OtrosProyectos
            className="mt-6 mb-12 md:mb-14"
            etiqueta={`See the other ${OTROS_INCIDENTES.length} Colombian projects from this edition`}
            proyectos={OTROS_INCIDENTES}
          />

          <a
            className="text-meta text-aisc-muted transition-colors hover:text-aisc-forest"
            href="https://apartresearch.com/sprints/global-south-ais-hackathon-2026-06-19-to-2026-06-21"
            target="_blank"
            rel="noopener noreferrer"
          >
            Global South AI Safety Hackathon · June 2026
          </a>
          <div className="mt-4">
            <PremiadosHackathon premiados={PREMIADOS} />
          </div>

          <OtrosProyectos
            className="mt-6"
            etiqueta={`See the other ${OTROS.length} Colombian projects from this edition`}
            proyectos={OTROS}
          />
        </div>
      </section>

      <CtaPanel title="Take part in the next hackathon" body="We open the Bogotá hub for every Apart Research hackathon and announce it first in the WhatsApp group.">
        <a
          className={CTA_LINK_PRIMARY}
          href="https://chat.whatsapp.com/KhjJqDNVviK3aX5S4q79EF"
          target="_blank"
          rel="noopener noreferrer"
        >
          Join the WhatsApp group
        </a>
        <Link className={CTA_LINK} href="/en/join">
          See how to join
        </Link>
      </CtaPanel>
      <SiteFooter idioma="en" />
    </main>
  );
}

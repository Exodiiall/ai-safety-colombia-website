"use client";

import Link from "next/link";
import DefAccClosing from "./defacc-closing";
import SiteHeader from "@/components/site-header";
import type { DatosHackathon } from "@/app/defacchackathon/datos";
import { rutaEn, type Idioma } from "@/lib/idiomas";
import styles from "./defacc.module.css";

export default function DefAccHero({ idioma, datos, onTracks }: {
  idioma: Idioma; datos: DatosHackathon; onTracks: () => void;
}) {
  return (
    <>
      <div className={styles.siteHeader}><SiteHeader active="/defacchackathon" /></div>
      <section className={styles.banner} aria-labelledby="hackathon-title">
        <div className={styles.bannerPanel}>
          <p className={styles.coBrand}>{datos.badge}</p>
          <div className={styles.bannerCopy}>
          <h1 id="hackathon-title" className={styles.bannerTitle}><span>Defensive Acceleration</span><strong>Hackathon</strong></h1>
          <p className={styles.lead}>{datos.lema}</p>
          </div>
          <div className={styles.bannerInfo}>
          <div className={styles.eventDetails}>
            <p>{datos.sidebar.fechaValor}</p>
            <p>{datos.sidebar.lugarValor}</p>
          </div>
          <div className={styles.bannerActions}>
            <button type="button" className={styles.primary} onClick={onTracks}>{datos.ctaVerBases}<span aria-hidden="true">↗</span></button>
            <p className={styles.comingSoon}><span aria-hidden="true" />{datos.ctaAplicar}</p>
          </div>
          <p className={styles.status}>{datos.estadoInscripciones}</p>
          </div>
        </div>
      </section>
      <DefAccClosing idioma={idioma} />
      <section id="defacc-mascota" className={styles.greeting} aria-labelledby="defacc-mascota-title">
        <div className={styles.greetingCopy}>
          <p className={styles.eyebrow}><span />{datos.badge}</p>
          <h2 id="defacc-mascota-title">{datos.resumen.mascotaTitulo}</h2>
          <p>{datos.resumen.mascotaTexto}</p>
        </div>
        <div className={styles.mascotImage}>
          <img src="/aisc/hackathon/cyberbear-presenta.png" alt={idioma === "en" ? "CyberBear presenting his laptop" : idioma === "pt" ? "CyberBear apresentando seu notebook" : "CyberBear presentando su computador"} width={1086} height={1448} loading="lazy" />
        </div>
      </section>
      <dl className={styles.facts}>
        {[
          { icon: "01", value: datos.sidebar.fechaValor, note: datos.sidebar.horarioValor },
          { icon: "02", value: datos.sidebar.lugarValor, note: datos.sidebar.formatoValor },
          { icon: "03", value: datos.sidebar.premiosValor, note: datos.sidebar.comidaValor },
        ].map((fact) => <div key={fact.icon}><span className={styles.factNumber} aria-hidden="true">{fact.icon} /</span><dt>{fact.value}</dt><dd>{fact.note}</dd></div>)}
      </dl>
      <section className={styles.partners}>
        <div className={styles.partnerGroup}>
        <p className={styles.eyebrow}>{datos.sidebar.organizanRotulo}</p>
        <div className={styles.partnerLogos}>
          <Link href={rutaEn(idioma, "/")}><img src="/aisc/logo-lockup-oscuro.png" width={240} height={70} alt="AI Safety Colombia" /></Link>
          <span aria-hidden="true">×</span>
          <a className={styles.ieeeLogo} href="https://www.instagram.com/csuniandes/" target="_blank" rel="noopener noreferrer"><img src="/aisc/aliados/ieee-cs-uniandes-original.svg" width={560} height={167} alt="IEEE Computer Society Uniandes" /></a>
        </div>
        </div>
        <div className={styles.invitingGroup}>
          <p className={styles.eyebrow}>{idioma === "en" ? "Invited by" : idioma === "pt" ? "Convida" : "Invita"}</p>
          <a className={styles.universityLogo} href="https://sistemas.uniandes.edu.co/" target="_blank" rel="noopener noreferrer"><img src="/aisc/aliados/uniandes-disc.png" width={2170} height={725} alt="Universidad de los Andes — Departamento de Ingeniería de Sistemas y Computación" loading="lazy" /></a>
        </div>
      </section>
    </>
  );
}

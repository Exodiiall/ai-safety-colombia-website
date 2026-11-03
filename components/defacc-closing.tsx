"use client";

import { useRef, useState } from "react";
import type { Idioma } from "@/lib/idiomas";
import styles from "./defacc.module.css";

export default function DefAccClosing({ idioma }: { idioma: Idioma }) {
  const video = useRef<HTMLVideoElement>(null);
  const [reproduciendo, setReproduciendo] = useState(false);
  const etiqueta = idioma === "en" ? (reproduciendo ? "Pause video" : "Play video")
    : idioma === "pt" ? (reproduciendo ? "Pausar vídeo" : "Reproduzir vídeo")
    : (reproduciendo ? "Pausar video" : "Reproducir video");

  return (
    <div className={styles.closingBear}>
      <div className={styles.manualPlayer} data-playing={reproduciendo}>
        <video ref={video} controls muted playsInline preload="none" poster="/aisc/hackathon/defacc-banner.jpeg"
          onPlay={() => setReproduciendo(true)} onPause={() => setReproduciendo(false)} onEnded={() => setReproduciendo(false)}
          aria-label={idioma === "en" ? "CyberBear animation" : idioma === "pt" ? "Animação do CyberBear" : "Animación de CyberBear"}>
          <source src="/aisc/hackathon/defacc-logos-juntos.mp4" type="video/mp4" />
        </video>
        {!reproduciendo && <button type="button" className={styles.playToggle} aria-label={etiqueta}
          onClick={() => {
            const player = video.current;
            if (!player) return;
            if (player.paused) void player.play().catch(() => { /* Native controls remain available. */ });
            else player.pause();
          }}>
          <svg viewBox="0 0 32 32" width="32" height="32" fill="currentColor" aria-hidden="true">
            <path d="M10 5v22l18-11z" />
          </svg>
        </button>}
      </div>
    </div>
  );
}

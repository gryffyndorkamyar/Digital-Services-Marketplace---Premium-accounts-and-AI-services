import React from 'react';
import { SEASON_02 } from '../../brand/ovyra';

const OvyraComingSoonSection: React.FC = () => {
  const s = SEASON_02;

  return (
    <section
      id="next-chapter"
      className="ovyra-coming-soon ovyra-coming-soon-frame ovyra-section-defer relative"
      dir="ltr"
      aria-labelledby="coming-soon-title"
    >
      <div className="ovyra-coming-soon-media" aria-hidden>
        <img
          src={s.image}
          alt=""
          className="ovyra-coming-soon-bg"
          width={s.imageWidth}
          height={s.imageHeight}
          loading="lazy"
          decoding="async"
        />
        <div className="ovyra-coming-soon-vignette" />
      </div>

      <div className="ovyra-coming-soon-inner">
        <header className="ovyra-coming-soon-copy ovyra-hero-realm-copy ovyra-fade-in">
          <p className="ovyra-hero-realm-eyebrow ovyra-coming-soon-eyebrow">
            {s.eyebrow}
            <span className="ovyra-coming-soon-dot" aria-hidden>
              ·
            </span>
            <span className="ovyra-coming-soon-label">{s.label}</span>
          </p>

          <h2
            id="coming-soon-title"
            className="ovyra-brand-system-title ovyra-coming-soon-title ovyra-neon-white"
          >
            {s.titleEn}
          </h2>

          <p
            className="ovyra-hero-realm-subtitle font-fa ovyra-coming-soon-fa-title ovyra-neon-gold"
            dir="rtl"
            lang="fa"
          >
            {s.titleFa}
          </p>

          <p className="ovyra-hero-realm-body-fa font-fa ovyra-coming-soon-body" dir="rtl" lang="fa">
            {s.leadFa}
          </p>

          <p className="font-fa ovyra-coming-soon-body-secondary" dir="rtl" lang="fa">
            {s.bodyFa}
          </p>

          <p className="ovyra-coming-soon-whisper-en ovyra-neon-violet">{s.whisperEn}</p>
          <p className="font-fa ovyra-coming-soon-whisper-fa ovyra-neon-violet" dir="rtl" lang="fa">
            {s.whisperFa}
          </p>

          <p className="font-fa ovyra-coming-soon-verse" dir="rtl" lang="fa">
            {s.verseFa}
          </p>

          <p className="ovyra-hero-realm-stats-en ovyra-coming-soon-stats ovyra-neon-violet">{s.statsEn}</p>
          <p
            className="ovyra-hero-realm-stats-fa font-fa ovyra-coming-soon-stats-fa ovyra-neon-gold"
            dir="rtl"
            lang="fa"
          >
            {s.statsFa}
          </p>
        </header>
      </div>
    </section>
  );
};

export default OvyraComingSoonSection;

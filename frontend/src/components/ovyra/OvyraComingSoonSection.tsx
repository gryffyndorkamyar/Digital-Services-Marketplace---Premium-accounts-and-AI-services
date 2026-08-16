import React from 'react';
import { SEASON_02 } from '../../brand/ovyra';

const OvyraComingSoonSection: React.FC = () => {
  const s = SEASON_02;

  return (
    <section
      id="next-chapter"
      className="ovyra-coming-soon ovyra-coming-soon-frame ovyra-section-defer relative overflow-hidden"
      dir="ltr"
      aria-labelledby="coming-soon-title"
    >
      <div className="ovyra-coming-soon-ambient" aria-hidden>
        <div className="ovyra-coming-soon-glow-right" />
        <div className="ovyra-coming-soon-glow-left" />
      </div>

      <div className="ovyra-coming-soon-shell">
        <div className="ovyra-coming-soon-card ovyra-fade-in">
          <div className="ovyra-coming-soon-visual">
            <img
              src={s.image}
              alt={s.imageAlt}
              className="ovyra-coming-soon-img"
              width={s.imageWidth}
              height={s.imageHeight}
              loading="lazy"
              decoding="async"
            />
          </div>

          <header className="ovyra-coming-soon-copy ovyra-hero-realm-copy">
            <div className="ovyra-coming-soon-copy-block" dir="ltr">
              <p className="ovyra-hero-realm-eyebrow ovyra-coming-soon-eyebrow">
                {s.eyebrow}
                <span className="ovyra-coming-soon-label" aria-hidden>
                  {' '}
                  · {s.label}
                </span>
              </p>

              <h2 id="coming-soon-title" className="ovyra-brand-system-title ovyra-coming-soon-title">
                {s.titleEn}
              </h2>

              <p className="ovyra-hero-realm-stats-en ovyra-coming-soon-stats-en">{s.statsEn}</p>

              <p className="ovyra-coming-soon-whisper-en font-display">{s.whisperEn}</p>
            </div>

            <div className="ovyra-coming-soon-divider" aria-hidden />

            <ul className="ovyra-coming-soon-signals" aria-label="Archive 02 signals">
              {s.signals.map((signal) => (
                <li key={signal.en} className="ovyra-coming-soon-signal">
                  <span className="ovyra-coming-soon-signal-en font-display">{signal.en}</span>
                  <span className="ovyra-coming-soon-signal-fa font-fa">{signal.fa}</span>
                </li>
              ))}
            </ul>

            <div className="ovyra-coming-soon-copy-block font-fa" dir="rtl" lang="fa">
              <p className="ovyra-hero-realm-subtitle ovyra-coming-soon-fa-title">{s.titleFa}</p>

              <p className="ovyra-hero-realm-body-fa ovyra-coming-soon-lead">{s.leadFa}</p>

              <p className="ovyra-coming-soon-body-fa">{s.bodyFa}</p>

              <p className="ovyra-hero-realm-stats-fa ovyra-coming-soon-stats-fa">{s.statsFa}</p>

              <p className="ovyra-coming-soon-manifesto">{s.manifestoFa}</p>

              <p className="ovyra-coming-soon-whisper-fa">{s.whisperFa}</p>

              <p className="ovyra-coming-soon-seal font-display" aria-label={`${s.seal} — ${s.eyebrow}`}>
                {s.seal}
              </p>
            </div>
          </header>
        </div>
      </div>
    </section>
  );
};

export default OvyraComingSoonSection;

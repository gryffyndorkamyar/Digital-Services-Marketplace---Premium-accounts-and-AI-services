import React from 'react';
import { Link } from 'react-router-dom';
import { SEASON_02 } from '../../brand/ovyra';

const OvyraComingSoonSection: React.FC = () => {
  const s = SEASON_02;

  return (
    <section
      id="next-chapter"
      className="ovyra-coming-soon ovyra-section-defer ovyra-section-border relative overflow-hidden"
      aria-labelledby="coming-soon-title"
    >
      <div className="ovyra-coming-soon-media" aria-hidden>
        <img
          src={s.image}
          alt=""
          className="ovyra-coming-soon-bg"
          loading="lazy"
          decoding="async"
        />
        <div className="ovyra-coming-soon-vignette" />
        <div className="ovyra-coming-soon-glow-portal" />
        <div className="ovyra-coming-soon-glow-floor" />
        <div className="ovyra-coming-soon-scan" />
        <div className="ovyra-coming-soon-grain" />
      </div>

      <div className="ovyra-coming-soon-orbit ovyra-coming-soon-orbit-a" aria-hidden />
      <div className="ovyra-coming-soon-orbit ovyra-coming-soon-orbit-b" aria-hidden />

      <div className="ovyra-coming-soon-inner">
        <div className="ovyra-coming-soon-badge ovyra-fade-in">
          <span className="ovyra-coming-soon-badge-pulse" aria-hidden />
          <span className="font-display tracking-[0.28em]">{s.label}</span>
          <span className="ovyra-coming-soon-badge-dot" aria-hidden />
          <span className="font-display tracking-[0.22em] text-ovyra-violet">{s.archiveTag}</span>
        </div>

        <header className="ovyra-coming-soon-copy ovyra-fade-in ovyra-fade-in-delay">
          <p className="ovyra-coming-soon-eyebrow font-display" lang="fa" dir="rtl">
            {s.labelFa}
            <span className="ovyra-coming-soon-eyebrow-sep" aria-hidden>
              ·
            </span>
            <span lang="en">{s.archiveTag}</span>
          </p>

          <h2 id="coming-soon-title" className="ovyra-coming-soon-title font-display" lang="en">
            {s.titleEn}
          </h2>
          <p className="ovyra-coming-soon-lead-en font-display" lang="en">
            {s.bodyEn}
          </p>

          <div className="ovyra-coming-soon-divider" aria-hidden>
            <span />
            <span className="ovyra-coming-soon-divider-gem" />
            <span />
          </div>

          <h3 className="ovyra-coming-soon-title-fa font-fa-display" lang="fa" dir="rtl">
            {s.titleFa}
          </h3>
          <p className="ovyra-coming-soon-lead-fa font-fa" lang="fa" dir="rtl">
            {s.bodyFa}
          </p>
        </header>

        <div className="ovyra-coming-soon-actions ovyra-fade-in ovyra-fade-in-delay-2">
          <div className="ovyra-coming-soon-seal">
            <span className="ovyra-coming-soon-seal-ring" aria-hidden />
            <span className="font-display text-[10px] tracking-[0.35em] text-ovyra-gold/90">{s.seal}</span>
            <span className="font-fa text-[11px] text-white/50">{s.sealFa}</span>
          </div>

          <Link to="/contact" className="ovyra-coming-soon-cta ovyra-hero-realm-cta">
            <span className="font-fa">{s.cta}</span>
            <span className="ovyra-coming-soon-cta-shine" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OvyraComingSoonSection;

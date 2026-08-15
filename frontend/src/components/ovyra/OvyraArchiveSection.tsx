import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ARCHIVE_01, COPY, type ArchiveFigure } from '../../brand/ovyra';

const OvyraArchiveSection: React.FC = () => {
  const { archive } = COPY;
  const [focused, setFocused] = useState<ArchiveFigure>(ARCHIVE_01[0]);

  return (
    <section id="archive" className="ovyra-archive ovyra-section-defer ovyra-section-border relative overflow-hidden" dir="ltr">
      <div className="ovyra-archive-ambient" aria-hidden>
        <div className="ovyra-archive-glow-left" />
        <div className="ovyra-archive-glow-center" />
      </div>

      <div className="ovyra-archive-inner">
        <header className="ovyra-archive-head ovyra-fade-in">
          <div className="ovyra-archive-copy">
            <p className="ovyra-hero-realm-eyebrow">{archive.eyebrow}</p>
            <h2 className="ovyra-brand-system-title">{archive.titleEn}</h2>
            <p className="ovyra-hero-realm-subtitle font-fa" dir="rtl" lang="fa">
              {archive.title}
            </p>
            <p className="ovyra-hero-realm-body-fa font-fa" dir="rtl" lang="fa">
              {archive.lead}
            </p>
            <p className="ovyra-hero-realm-stats-en">{archive.statsEn}</p>
            <p className="ovyra-hero-realm-stats-fa font-fa" dir="rtl" lang="fa">
              {archive.statsFa}
            </p>
            <Link to="/products" className="ovyra-hero-realm-cta ovyra-archive-copy-cta">
              <span>{archive.shopCta}</span>
            </Link>
          </div>

          <aside className="ovyra-archive-spotlight ovyra-fade-in ovyra-fade-in-delay" aria-live="polite">
            <div className="ovyra-archive-spotlight-frame">
              <span className="ovyra-archive-spotlight-code">{focused.code}</span>
              <div className="ovyra-archive-spotlight-glow" style={{ ['--spot-accent' as string]: focused.accent }} aria-hidden />
              <img
                key={focused.code}
                src={focused.image}
                alt={`${focused.name} — OVYRA Archive 01`}
                className="ovyra-archive-spotlight-figure"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="ovyra-archive-spotlight-meta">
              <p className="ovyra-archive-spotlight-name">{focused.name}</p>
              <p className="ovyra-archive-spotlight-name-fa font-fa" dir="rtl" lang="fa">
                {focused.nameFa}
              </p>
              <p className="ovyra-archive-spotlight-tagline font-fa" dir="rtl" lang="fa">
                {focused.tagline}
              </p>
              <Link to="/products" className="ovyra-archive-spotlight-link font-fa" dir="rtl" lang="fa">
                {archive.featuredCta}
              </Link>
            </div>
          </aside>
        </header>

        <div className="ovyra-archive-grid ovyra-fade-in ovyra-fade-in-delay">
          <p className="ovyra-archive-grid-hint">{archive.hoverHint}</p>
          <div className="ovyra-archive-grid-inner">
            {ARCHIVE_01.map((figure) => {
              const isFocused = focused.code === figure.code;
              return (
                <article
                  key={figure.code}
                  className={`ovyra-archive-cell ${isFocused ? 'is-focused' : ''}`}
                  style={{ ['--cell-accent' as string]: figure.accent }}
                  onMouseEnter={() => setFocused(figure)}
                  onFocus={() => setFocused(figure)}
                  onClick={() => setFocused(figure)}
                  tabIndex={0}
                >
                  <div className="ovyra-archive-cell-pedestal">
                    <span className="ovyra-archive-cell-code">{figure.code}</span>
                    <div className="ovyra-archive-cell-bloom" aria-hidden />
                    <img
                      src={figure.image}
                      alt=""
                      className="ovyra-archive-cell-figure"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="ovyra-archive-cell-panel">
                    <p className="ovyra-archive-cell-name">{figure.name}</p>
                    <p className="ovyra-archive-cell-name-fa font-fa" dir="rtl" lang="fa">
                      {figure.nameFa}
                    </p>
                    <p className="ovyra-archive-cell-tagline font-fa" dir="rtl" lang="fa">
                      {figure.tagline}
                    </p>
                    <span className="ovyra-archive-cell-cta">{archive.viewLabel}</span>
                  </div>
                  <Link to="/products" className="ovyra-archive-cell-link" aria-label={`${figure.nameFa} — ${archive.featuredCta}`}>
                    <span className="sr-only">
                      {figure.nameFa} — {archive.featuredCta}
                    </span>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OvyraArchiveSection;

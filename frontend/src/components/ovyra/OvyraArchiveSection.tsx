import React, { useState } from 'react';
import { ARCHIVE_01, ARCHIVE_FIGURE_LARGE, COPY, type ArchiveFigure } from '../../brand/ovyra';

const OvyraArchiveSection: React.FC = () => {
  const { archive } = COPY;
  const [focused, setFocused] = useState<ArchiveFigure>(ARCHIVE_01[0]);

  const selectFigure = (figure: ArchiveFigure) => {
    setFocused(figure);
  };

  return (
    <section id="archive" className="ovyra-archive ovyra-section-defer ovyra-section-border relative overflow-hidden" dir="ltr">
      <div className="ovyra-archive-ambient" aria-hidden>
        <div className="ovyra-archive-glow-left" />
        <div className="ovyra-archive-glow-center" />
      </div>

      <div className="ovyra-archive-inner">
        <div className="ovyra-archive-stage">
          <header className="ovyra-archive-copy ovyra-fade-in">
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
          </header>

          <aside
            className="ovyra-archive-showcase ovyra-fade-in ovyra-fade-in-delay"
            style={{ ['--showcase-accent' as string]: focused.accent }}
            aria-live="polite"
          >
            <div className="ovyra-archive-showcase-figure">
              <span className="ovyra-archive-showcase-code">{focused.code}</span>
              <img
                key={focused.code}
                src={focused.image}
                alt={`${focused.name} — OVYRA Archive 01`}
                className={`ovyra-archive-showcase-image${
                  ARCHIVE_FIGURE_LARGE.has(focused.code) ? ' is-figure-large' : ''
                }`}
                loading="lazy"
                decoding="async"
              />
            </div>

            <div key={focused.code} className="ovyra-archive-dossier">
              <div className="ovyra-archive-dossier-head">
                <span className="ovyra-archive-dossier-label">{archive.dossierLabel}</span>
                <span className="ovyra-archive-dossier-id">FIGURE {focused.code}</span>
              </div>
              <h3 className="ovyra-archive-dossier-name font-fa">{focused.name}</h3>
              <p className="ovyra-archive-dossier-name-fa font-fa" dir="rtl" lang="fa">
                {focused.nameFa}
              </p>
              <p className="ovyra-archive-dossier-tagline font-fa" dir="rtl" lang="fa">
                {focused.tagline}
              </p>
              <p className="ovyra-archive-dossier-tagline-en font-fa" dir="ltr" lang="en">
                {focused.taglineEn}
              </p>
              <div className="ovyra-archive-dossier-divider" aria-hidden />
              <p className="ovyra-archive-dossier-lore-fa font-fa" dir="rtl" lang="fa">
                {focused.loreFa}
              </p>
              <p className="ovyra-archive-dossier-lore-en font-fa" dir="ltr" lang="en">
                {focused.loreEn}
              </p>
              <div className="ovyra-archive-dossier-foot">
                <span className="ovyra-archive-dossier-chip font-fa" dir="rtl" lang="fa">
                  {archive.storyChip}
                </span>
                <button type="button" className="ovyra-archive-dossier-story-cta font-fa" dir="rtl" lang="fa">
                  {archive.storyCta}
                </button>
              </div>
            </div>
          </aside>

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
                    onMouseEnter={() => selectFigure(figure)}
                    onFocus={() => selectFigure(figure)}
                    onClick={() => selectFigure(figure)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        selectFigure(figure);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isFocused}
                    aria-label={`${figure.nameFa} — ${figure.name}`}
                  >
                    <span className="ovyra-archive-cell-rim" aria-hidden />
                    <span className="ovyra-archive-cell-hook ovyra-archive-cell-hook-left" aria-hidden />
                    <span className="ovyra-archive-cell-hook ovyra-archive-cell-hook-right" aria-hidden />
                    <div className="ovyra-archive-cell-inner">
                      <div className="ovyra-archive-cell-pedestal">
                        <span className="ovyra-archive-cell-code">{figure.code}</span>
                        <div className="ovyra-archive-cell-bloom" aria-hidden />
                        <div className="ovyra-archive-cell-base" aria-hidden />
                        <img
                          src={figure.image}
                          alt=""
                          className={`ovyra-archive-cell-figure${
                            ARCHIVE_FIGURE_LARGE.has(figure.code) ? ' is-figure-large' : ''
                          }`}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="ovyra-archive-cell-panel">
                        <p className="ovyra-archive-cell-name font-fa">{figure.name}</p>
                        <p className="ovyra-archive-cell-name-fa font-fa" dir="rtl" lang="fa">
                          {figure.nameFa}
                        </p>
                        <p className="ovyra-archive-cell-tagline font-fa" dir="rtl" lang="fa">
                          {figure.tagline}
                        </p>
                        <span className="ovyra-archive-cell-story-cta font-fa" dir="rtl" lang="fa">
                          {archive.storyCta}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OvyraArchiveSection;

import React from 'react';
import { Link } from 'react-router-dom';
import { COPY } from '../../brand/ovyra';

const ASSETS = {
  box: '/brand/system/box-open.png',
  loreCard: '/brand/system/lore-card.png',
  puzzlePiece: '/brand/system/puzzle-piece.png',
  figure: '/brand/system/figure-totem.png',
  eye: '/brand/hero-assets/hero-eye.png',
} as const;

const STEP_ASSETS = [ASSETS.loreCard, ASSETS.puzzlePiece, ASSETS.figure] as const;

const OvyraBrandSystemSection: React.FC = () => {
  const { system } = COPY;

  return (
    <section
      id="how"
      className="ovyra-brand-system ovyra-section-defer ovyra-section-border relative overflow-hidden py-14 sm:py-16 md:py-24"
      dir="ltr"
    >
      <div className="ovyra-brand-system-ambient" aria-hidden>
        <div className="ovyra-brand-system-glow-center" />
      </div>

      <div className="ovyra-section-shell relative">
        <header className="ovyra-brand-system-header ovyra-fade-in">
          <p className="ovyra-hero-realm-eyebrow">{system.eyebrow}</p>
          <h2 className="ovyra-brand-system-title">{system.title}</h2>
          <p className="ovyra-hero-realm-subtitle">{system.subtitle}</p>
          <p className="ovyra-hero-realm-body-fa font-fa mx-auto max-w-md" dir="rtl" lang="fa">
            {system.manifestoFa}
          </p>
          <p className="ovyra-hero-realm-stats-en">{system.statsEn}</p>
          <p className="ovyra-hero-realm-stats-fa font-fa" dir="rtl" lang="fa">
            {system.statsFa}
          </p>
          <p className="ovyra-brand-system-lead font-fa mx-auto max-w-lg" dir="rtl" lang="fa">
            {system.lead}
          </p>
        </header>

        <div className="ovyra-brand-system-showcase ovyra-fade-in ovyra-fade-in-delay">
          <div className="ovyra-brand-system-pedestal" aria-hidden>
            <div className="ovyra-brand-system-pedestal-glow" />
          </div>
          <img
            src={ASSETS.box}
            alt={system.imageAlt}
            className="ovyra-brand-system-hero-image"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="ovyra-brand-system-cards">
          {system.steps.map((item, index) => (
            <article key={item.step} className="ovyra-brand-system-card">
              <div className="ovyra-brand-system-card-inner">
                <div className="ovyra-brand-system-card-asset">
                  <img
                    src={STEP_ASSETS[index]}
                    alt=""
                    className={`ovyra-brand-system-card-image ovyra-brand-system-card-image--${index}`}
                    loading="lazy"
                    decoding="async"
                    aria-hidden
                  />
                  {index === 2 && (
                    <img
                      src={ASSETS.eye}
                      alt=""
                      className="ovyra-brand-system-card-eye"
                      loading="lazy"
                      decoding="async"
                      aria-hidden
                    />
                  )}
                </div>

                <div className="ovyra-brand-system-card-copy">
                  <div className="ovyra-brand-system-card-head">
                    <span className="ovyra-brand-system-card-step">{item.step}</span>
                    <div>
                      <h3 className="ovyra-brand-system-card-title">{item.title}</h3>
                      <p className="ovyra-brand-system-card-fa font-fa" dir="rtl" lang="fa">
                        {item.fa}
                      </p>
                    </div>
                  </div>
                  <p className="ovyra-brand-system-card-body font-fa" dir="rtl" lang="fa">
                    {item.body}
                  </p>
                  <p className="ovyra-brand-system-card-hint">{item.hint}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <footer className="ovyra-brand-system-footer">
          <p className="ovyra-hero-realm-stats-en">{system.closing}</p>
          <p className="ovyra-hero-realm-stats-fa font-fa" dir="rtl" lang="fa">
            {system.closingFa}
          </p>
          <Link to="/products" className="ovyra-hero-realm-cta mx-auto mt-6 lg:mx-0 lg:ms-auto">
            <span>ورود به آرشیو ۰۱</span>
          </Link>
        </footer>
      </div>
    </section>
  );
};

export default OvyraBrandSystemSection;

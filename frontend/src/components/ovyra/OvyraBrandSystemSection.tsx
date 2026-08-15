import React from 'react';
import { Link } from 'react-router-dom';
import { COPY } from '../../brand/ovyra';

const BOX_IMAGE = '/brand/system/box-open.png';
const CHAIN_LINK = '/brand/system/chain-segment.png';

const OvyraBrandSystemSection: React.FC = () => {
  const { system } = COPY;

  return (
    <section id="how" className="ovyra-brand-system ovyra-section-defer ovyra-section-border relative overflow-hidden" dir="ltr">
      <div className="ovyra-brand-system-ambient" aria-hidden>
        <div className="ovyra-brand-system-glow-center" />
      </div>

      <div className="ovyra-brand-system-inner ovyra-section-shell">
        <div className="ovyra-brand-system-stage">
          <header className="ovyra-brand-system-copy ovyra-fade-in">
            <p className="ovyra-hero-realm-eyebrow">{system.eyebrow}</p>
            <h2 className="ovyra-brand-system-title">{system.title}</h2>
            <p className="ovyra-hero-realm-subtitle">{system.subtitle}</p>
            <p className="ovyra-hero-realm-body-fa font-fa" dir="rtl" lang="fa">
              {system.manifestoFa}
            </p>
            <p className="ovyra-hero-realm-stats-en">{system.statsEn}</p>
            <p className="ovyra-hero-realm-stats-fa font-fa" dir="rtl" lang="fa">
              {system.statsFa}
            </p>
          </header>

          <div className="ovyra-brand-system-visual ovyra-fade-in ovyra-fade-in-delay">
            <div className="ovyra-brand-system-showcase">
              <div className="ovyra-brand-system-pedestal-glow" aria-hidden />
              <img
                src={BOX_IMAGE}
                alt={system.imageAlt}
                className="ovyra-brand-system-hero-image"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div className="ovyra-brand-system-chain-row">
            {system.steps.map((item, index) => (
              <React.Fragment key={item.step}>
                <article className="ovyra-brand-system-card">
                  <span className="ovyra-brand-system-card-hook ovyra-brand-system-card-hook-left" aria-hidden />
                  <span className="ovyra-brand-system-card-hook ovyra-brand-system-card-hook-right" aria-hidden />
                  <div className="ovyra-brand-system-card-inner">
                    <div className="ovyra-brand-system-card-slot" aria-hidden />
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

                {index < system.steps.length - 1 && (
                  <div className="ovyra-brand-system-chain-connector" aria-hidden>
                    <img src={CHAIN_LINK} alt="" className="ovyra-brand-system-chain-img" decoding="async" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <footer className="ovyra-brand-system-footer">
          <p className="ovyra-hero-realm-stats-en">{system.closing}</p>
          <p className="ovyra-hero-realm-stats-fa font-fa" dir="rtl" lang="fa">
            {system.closingFa}
          </p>
          <Link to="/products" className="ovyra-hero-realm-cta">
            <span>ورود به آرشیو ۰۱</span>
          </Link>
        </footer>
      </div>
    </section>
  );
};

export default OvyraBrandSystemSection;

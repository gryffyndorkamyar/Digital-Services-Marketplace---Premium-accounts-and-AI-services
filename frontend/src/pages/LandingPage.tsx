import React from 'react';
import { Link } from 'react-router-dom';
import {
  BOX_CONTENTS,
  COMPETITOR_EDGE,
  COPY,
  SEASON_02,
} from '../brand/ovyra';
import OvyraTrustStrip from '../components/ovyra/OvyraTrustStrip';
import OvyraStickyCta from '../components/ovyra/OvyraStickyCta';
import OvyraHeroRealm from '../components/ovyra/OvyraHeroRealm';
import OvyraBrandSystemSection from '../components/ovyra/OvyraBrandSystemSection';
import OvyraArchiveSection from '../components/ovyra/OvyraArchiveSection';

const LandingPage: React.FC = () => {
  return (
    <div className="ovyra-page relative overflow-x-hidden bg-ovyra-void pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] text-ovyra-mist md:pb-0">
      {/* ── 1. HERO (realm mockup) ── */}
      <OvyraHeroRealm />

      <OvyraTrustStrip />

      {/* ── 2. SYSTEM — brand ritual (Collect · Connect · Complete) ── */}
      <OvyraBrandSystemSection />

      {/* ── 3. ARCHIVE — ten beings ── */}
      <OvyraArchiveSection />

      {/* ── 4. INSIDE THE BOX ── */}
      <section className="ovyra-section-defer ovyra-section-border relative py-14 sm:py-20 md:py-24">
        <div className="ovyra-section-shell">
          <p className="ovyra-section-eyebrow font-display">INSIDE THE BOX</p>
          <h2 className="ovyra-section-title font-fa-display">هر جعبه، یک دنیا</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {BOX_CONTENTS.map((item) => (
              <div key={item.title} className="ovyra-neon-panel px-5 py-6">
                <div className="font-display text-sm tracking-[0.22em] text-ovyra-gold">{item.title}</div>
                <p className="font-fa mt-1 text-sm font-medium text-white/90">{item.titleFa}</p>
                <p className="ovyra-hero-sub mt-3 !text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. WHY OVYRA ── */}
      <section className="ovyra-section-defer ovyra-section-border relative py-14 sm:py-20 md:py-28">
        <div className="ovyra-section-shell">
          <div className="max-w-3xl">
            <p className="ovyra-section-eyebrow font-display">{COPY.why.eyebrow}</p>
            <h2 className="ovyra-section-title font-fa-display">
              {COPY.why.title1}
              <span className="ovyra-neon-violet mt-1 block text-ovyra-violet">{COPY.why.title2}</span>
            </h2>
            <p className="ovyra-section-lead">{COPY.why.lead}</p>
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {COMPETITOR_EDGE.map((line) => (
              <li key={line} className="ovyra-neon-panel font-fa flex items-start gap-3 px-5 py-4 text-sm text-ovyra-mist/85">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ovyra-violet shadow-[0_0_12px_rgba(157,78,221,0.9)]" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 6. SEASON 02 ── */}
      <section className="ovyra-section-defer ovyra-section-border relative py-12 sm:py-16 md:py-20">
        <div className="ovyra-section-shell">
          <div className="ovyra-neon-panel flex flex-col items-start gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <div>
              <p className="ovyra-section-eyebrow font-display !text-ovyra-violet">{SEASON_02.label}</p>
              <h3 className="font-fa-display mt-2 text-2xl text-white sm:text-3xl">{SEASON_02.title}</h3>
              <p className="ovyra-hero-sub mt-3 max-w-xl !text-sm">{SEASON_02.body}</p>
            </div>
            <Link to="/contact" className="ovyra-nav-chip ovyra-hero-cta-chip shrink-0 font-fa">
              <span className="ovyra-nav-chip-label">{SEASON_02.cta}</span>
            </Link>
          </div>
        </div>
      </section>

      <OvyraStickyCta />
    </div>
  );
};

export default LandingPage;

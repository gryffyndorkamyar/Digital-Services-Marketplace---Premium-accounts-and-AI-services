import React from 'react';
import {
  BOX_CONTENTS,
} from '../brand/ovyra';import OvyraTrustStrip from '../components/ovyra/OvyraTrustStrip';
import OvyraStickyCta from '../components/ovyra/OvyraStickyCta';
import OvyraHeroRealm from '../components/ovyra/OvyraHeroRealm';
import OvyraBrandSystemSection from '../components/ovyra/OvyraBrandSystemSection';
import OvyraArchiveSection from '../components/ovyra/OvyraArchiveSection';
import OvyraComingSoonSection from '../components/ovyra/OvyraComingSoonSection';

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

      {/* ── 5. NEXT CHAPTER — coming soon (merged season + teaser) ── */}
      <OvyraComingSoonSection />

      <OvyraStickyCta />
    </div>
  );
};

export default LandingPage;

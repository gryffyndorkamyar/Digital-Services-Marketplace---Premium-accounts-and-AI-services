import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ARCHIVE_01,
  BOX_CONTENTS,
  BRAND,
  COMPETITOR_EDGE,
  COPY,
  SEASON_02,
} from '../brand/ovyra';
import OvyraLogo from '../components/OvyraLogo';
import OvyraTrustStrip from '../components/ovyra/OvyraTrustStrip';
import OvyraStickyCta from '../components/ovyra/OvyraStickyCta';

const LandingPage: React.FC = () => {
  const [active, setActive] = useState(1);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % ARCHIVE_01.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

  const featured = ARCHIVE_01[active];

  return (
    <div className="ovyra-page relative overflow-x-hidden bg-ovyra-void pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] text-ovyra-mist md:pb-0">
      {/* ── 1. HERO ── */}
      <section className="ovyra-hero-pro">
        <div className="ovyra-hero-beam" aria-hidden />
        <div className="ovyra-hero-pro-gridlines" aria-hidden />
        <div className="pointer-events-none absolute inset-0">
          <div className="ovyra-neon-orb ovyra-neon-orb-violet" aria-hidden />
          <div className="ovyra-neon-orb ovyra-neon-orb-gold" aria-hidden />
          <div className="ovyra-neon-orb ovyra-neon-orb-eye" aria-hidden />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_24%,rgba(157,78,221,0.28),transparent_58%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_14%_90%,rgba(201,162,39,0.16),transparent_48%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(192,38,211,0.08),transparent_65%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-ovyra-void via-ovyra-void/97 to-ovyra-void" />
          <div className="ovyra-hero-glow" aria-hidden />
        </div>

        <div className="ovyra-hero-shell">
          <div className="ovyra-hero-grid ovyra-fade-in">
            <div className="ovyra-hero-copy">
              <OvyraLogo variant="hero" className="ovyra-hero-logo" priority />

              <div className="ovyra-hero-meta-cluster">
                <span className="ovyra-hero-meta-chip">{BRAND.series}</span>
                <span className="ovyra-header-divider" aria-hidden />
                <span className="ovyra-hero-meta-chip text-white/60">{BRAND.archive}</span>
                <span className="ovyra-header-divider" aria-hidden />
                <span className="ovyra-hero-meta-chip text-ovyra-violet/90">{BRAND.age}</span>
              </div>

              <h1 className="ovyra-hero-headline">
                <span className="ovyra-neon-white block text-white">{COPY.hero.line1}</span>
                <span className="ovyra-neon-gold mt-1 block text-ovyra-gold">{COPY.hero.line2}</span>
                <span className="ovyra-neon-violet mt-1 block text-ovyra-violet">{COPY.hero.line3}</span>
              </h1>

              <div className="ovyra-hero-lead-block">
                <p className="ovyra-hero-lead">{COPY.hero.lead}</p>
                <p className="ovyra-hero-sub">{COPY.hero.sub}</p>
              </div>

              <div className="ovyra-hero-system-strip" aria-label="سیستم OVYRA">
                {COPY.system.steps.map((step) => (
                  <span key={step.step} className="ovyra-hero-system-chip">
                    <span className="font-display text-[10px] tracking-[0.28em] text-ovyra-gold">{step.step}</span>
                    <span className="font-fa text-xs font-medium text-white/85">{step.fa}</span>
                  </span>
                ))}
              </div>

              <div className="ovyra-hero-stats">
                <div className="ovyra-hero-stat">
                  <span className="ovyra-hero-stat-value">10</span>
                  <span className="ovyra-hero-stat-label">{COPY.hero.statFigures}</span>
                </div>
                <div className="ovyra-hero-stat">
                  <span className="ovyra-hero-stat-value">1</span>
                  <span className="ovyra-hero-stat-label">{COPY.hero.statEye}</span>
                </div>
                <div className="ovyra-hero-stat">
                  <span className="ovyra-hero-stat-value">{BRAND.age}</span>
                  <span className="ovyra-hero-stat-label">{COPY.hero.statAge}</span>
                </div>
              </div>

              <div className="ovyra-hero-actions">
                <Link
                  to="/products"
                  className="ovyra-nav-pill ovyra-hero-cta-pill"
                  style={{ '--pill-accent': '#c9a227', '--pill-glow': 'rgba(201,162,39,0.42)' } as React.CSSProperties}
                >
                  <span className="ovyra-nav-pill-dot" aria-hidden />
                  <span className="ovyra-nav-pill-label font-fa">{COPY.hero.ctaPrimary}</span>
                  <span className="ovyra-nav-pill-sheen" aria-hidden />
                </Link>
                <a href="#how" className="ovyra-nav-chip ovyra-hero-cta-chip font-fa">
                  <span className="ovyra-nav-chip-label">{COPY.hero.ctaSecondary}</span>
                  <span className="ovyra-nav-chip-sheen" aria-hidden />
                </a>
                <span className="ovyra-hero-tagline">{BRAND.tagline}</span>
              </div>
            </div>

            <div className="ovyra-hero-media ovyra-fade-in ovyra-fade-in-delay">
              <span className="ovyra-hero-badge">LIMITED ARCHIVE</span>
              <div className="ovyra-hero-figure-stage">
                <div className="ovyra-hero-figure-glow" aria-hidden />
                <img
                  src="/brand/firstfigure.png?v=4"
                  alt="OVYRA Archive 01 — Mood Totem box and figure"
                  className="ovyra-hero-figure-img"
                  fetchPriority="high"
                  decoding="async"
                  loading="eager"
                  width={960}
                  height={720}
                />
              </div>
              <p className="ovyra-hero-caption">{BRAND.eyeLine}</p>
            </div>
          </div>
        </div>
      </section>

      <OvyraTrustStrip />

      {/* ── 2. ARCHIVE — product first for collectible brands ── */}
      <section id="archive" className="ovyra-section-defer ovyra-section-border relative overflow-hidden py-14 sm:py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(157,78,221,0.18),transparent_62%)]" />

        <div className="ovyra-section-shell relative">
          <div className="ovyra-section-head">
            <div>
              <p className="ovyra-section-eyebrow font-display">{COPY.archive.eyebrow}</p>
              <h2 className="ovyra-section-title font-fa-display">{COPY.archive.title}</h2>
              <p className="ovyra-section-lead">{COPY.archive.lead}</p>
            </div>
            <Link
              to="/products"
              className="ovyra-nav-pill ovyra-section-cta-pill shrink-0 self-start"
              style={{ '--pill-accent': '#9d4edd', '--pill-glow': 'rgba(157,78,221,0.42)' } as React.CSSProperties}
            >
              <span className="ovyra-nav-pill-dot" aria-hidden />
              <span className="ovyra-nav-pill-label font-fa">{COPY.archive.shopCta}</span>
              <span className="ovyra-nav-pill-sheen" aria-hidden />
            </Link>
          </div>

          <div className="ovyra-archive-characters-stage mt-10">
            <div className="ovyra-archive-characters-glow" aria-hidden />
            <img
              src="/brand/10character.png?v=1"
              alt="OVYRA Archive 01 — ten characters"
              className="ovyra-archive-characters-img"
              loading="lazy"
              decoding="async"
              width={1536}
              height={1024}
            />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2 md:grid-cols-5 md:gap-2.5">
            {ARCHIVE_01.map((figure, index) => {
              const isActive = index === active;
              return (
                <button
                  key={figure.code}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`ovyra-figure-chip text-right ${isActive ? 'is-active' : ''}`}
                  style={{ ['--chip-accent' as string]: figure.accent }}
                >
                  <div className="font-display text-[10px] tracking-[0.3em]" style={{ color: figure.accent }}>
                    {figure.code}
                  </div>
                  <div className="font-fa mt-1.5 text-sm font-bold text-white sm:mt-2 sm:text-base">{figure.nameFa}</div>
                  <div className="mt-1 truncate font-display text-[10px] tracking-wide text-ovyra-mist/50">
                    {figure.name}
                  </div>
                </button>
              );
            })}
          </div>

          <div key={featured.code} className="ovyra-neon-panel mt-6 px-5 py-5 sm:px-8">
            <p className="font-display text-xs tracking-[0.35em] text-ovyra-gold">
              {featured.code} · {featured.name}
            </p>
            <p className="font-fa-display mt-2 text-xl text-white">{featured.nameFa}</p>
            <p className="ovyra-hero-sub mt-2 !text-base italic">{featured.tagline}</p>
            <Link to="/products" className="ovyra-nav-chip ovyra-hero-cta-chip mt-5 inline-flex !h-9 !px-4 !text-xs font-fa">
              <span className="ovyra-nav-chip-label">{COPY.archive.featuredCta}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. SYSTEM ── */}
      <section id="how" className="ovyra-section-defer ovyra-section-border relative py-14 sm:py-20 md:py-28">
        <div className="ovyra-section-glow" />
        <div className="ovyra-section-shell relative">
          <div className="max-w-2xl">
            <p className="ovyra-section-eyebrow font-display">{COPY.system.eyebrow}</p>
            <h2 className="ovyra-section-title font-display !tracking-[0.1em]">{BRAND.tagline}</h2>
            <p className="ovyra-section-lead">{COPY.system.lead}</p>
          </div>

          <div className="relative mt-14 grid gap-4 md:grid-cols-3 md:gap-5">
            <div className="pointer-events-none absolute left-[8%] right-[8%] top-10 hidden h-px bg-gradient-to-l from-transparent via-ovyra-violet/50 to-transparent md:block" />
            {COPY.system.steps.map((item) => (
              <div key={item.step} className="ovyra-neon-panel relative px-5 py-6 sm:px-6">
                <div className="ovyra-step-ring mb-5">{item.step}</div>
                <h3 className="font-display text-xl tracking-[0.14em] text-white sm:text-2xl">{item.title}</h3>
                <p className="font-fa mt-1 text-sm font-medium text-ovyra-gold">{item.fa}</p>
                <p className="ovyra-hero-sub mt-4 !text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      {/* ── 7. FINAL CTA ── */}
      <section className="ovyra-section-defer ovyra-section-border relative overflow-hidden py-16 sm:py-24 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,38,211,0.28),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(201,162,39,0.14),transparent_45%)]" />

        <div className="ovyra-section-shell relative max-w-3xl text-center">
          <p className="ovyra-section-eyebrow font-display !tracking-[0.28em] text-ovyra-gold sm:!tracking-[0.48em]">{BRAND.closing}</p>
          <h2 className="ovyra-section-title font-fa-display mx-auto mt-4">
            {COPY.cta.title1}
            <span className="ovyra-neon-violet mt-2 block text-ovyra-violet">{COPY.cta.title2}</span>
          </h2>
          <p className="ovyra-section-lead mx-auto mt-5 max-w-lg">{COPY.cta.sub}</p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              to="/products"
              className="ovyra-nav-pill ovyra-hero-cta-pill w-full sm:w-auto"
              style={{ '--pill-accent': '#c9a227', '--pill-glow': 'rgba(201,162,39,0.42)' } as React.CSSProperties}
            >
              <span className="ovyra-nav-pill-dot" aria-hidden />
              <span className="ovyra-nav-pill-label font-fa">{COPY.cta.primary}</span>
              <span className="ovyra-nav-pill-sheen" aria-hidden />
            </Link>
            <Link to="/about" className="ovyra-nav-chip ovyra-hero-cta-chip w-full font-fa sm:w-auto">
              <span className="ovyra-nav-chip-label">{COPY.cta.secondary}</span>
            </Link>
          </div>
        </div>
      </section>

      <OvyraStickyCta />
    </div>
  );
};

export default LandingPage;

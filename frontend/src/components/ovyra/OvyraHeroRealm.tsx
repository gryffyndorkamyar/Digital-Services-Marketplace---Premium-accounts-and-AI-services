import React, { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ARCHIVE_01, COPY } from '../../brand/ovyra';
import {
  HERO_CARD_LAYOUT,
  layoutToStyle,
  pickHeroCardAtPoint,
} from '../../brand/heroCardLayout';

const HERO_MONUMENT = '/brand/ovyaorglanding.png';
const HERO_CARDS = '/brand/ovyracarts1.png';

const RealmOrbIcon: React.FC = () => (
  <span className="ovyra-realm-orb-icon" aria-hidden>
    <span className="ovyra-realm-orb-icon-ring" />
    <span className="ovyra-realm-orb-icon-core" />
  </span>
);

const OvyraHeroRealm: React.FC = () => {
  const { heroRealm } = COPY;
  const deckRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const figureById = (id: number) => ARCHIVE_01.find((f) => f.id === id);

  const updateActiveFromPointer = useCallback((clientX: number, clientY: number) => {
    const deck = deckRef.current;
    if (!deck) return;

    const rect = deck.getBoundingClientRect();
    const xPct = ((clientX - rect.left) / rect.width) * 100;
    const yPct = ((clientY - rect.top) / rect.height) * 100;

    if (xPct < -2 || xPct > 102 || yPct < -2 || yPct > 102) {
      setActiveCard(null);
      return;
    }

    const picked = pickHeroCardAtPoint(xPct, yPct);
    setActiveCard(picked?.id ?? null);
  }, []);

  const handleDeckPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      updateActiveFromPointer(event.clientX, event.clientY);
    },
    [updateActiveFromPointer]
  );

  const handleDeckPointerLeave = useCallback(() => {
    setActiveCard(null);
  }, []);

  return (
    <section className="ovyra-hero-realm" dir="ltr" aria-label="OVYRA — Welcome">
      <div className="ovyra-hero-realm-ambient" aria-hidden>
        <div className="ovyra-hero-realm-vignette" />
        <div className="ovyra-hero-realm-glow-center" />
        <div className="ovyra-hero-realm-orbit ovyra-hero-realm-orbit-a" />
        <div className="ovyra-hero-realm-orbit ovyra-hero-realm-orbit-b" />
        <div className="ovyra-hero-realm-orbit ovyra-hero-realm-orbit-c" />
      </div>

      <div className="ovyra-hero-realm-stage">
        <div className="ovyra-hero-realm-copy ovyra-fade-in">
          <p className="ovyra-hero-realm-eyebrow">{heroRealm.welcome}</p>
          <h1 className="ovyra-hero-realm-title">{heroRealm.title}</h1>
          <p className="ovyra-hero-realm-subtitle">{heroRealm.subtitle}</p>
          <p className="ovyra-hero-realm-body-fa font-fa" dir="rtl" lang="fa">
            {heroRealm.bodyFa}
          </p>
          <p className="ovyra-hero-realm-stats-en">{heroRealm.statsEn}</p>
          <p className="ovyra-hero-realm-stats-fa font-fa" dir="rtl" lang="fa">
            {heroRealm.statsFa}
          </p>
          <Link to="/products" className="ovyra-hero-realm-cta">
            <span>{heroRealm.cta}</span>
            <RealmOrbIcon />
          </Link>
        </div>

        <div className="ovyra-hero-realm-visual ovyra-fade-in ovyra-fade-in-delay">
          <div className="ovyra-hero-realm-scene">
            <img
              src={HERO_MONUMENT}
              alt="The OVYRA archive eye"
              className="ovyra-hero-realm-monument"
              decoding="async"
              fetchPriority="high"
            />
            <div className="ovyra-hero-realm-monument-glow" aria-hidden />

            <div
              ref={deckRef}
              className={`ovyra-hero-realm-cards-deck${activeCard ? ' has-active-card' : ''}`}
              onPointerMove={handleDeckPointerMove}
              onPointerLeave={handleDeckPointerLeave}
            >
              <img
                src={HERO_CARDS}
                alt=""
                className="ovyra-hero-realm-cards-strip"
                loading="lazy"
                decoding="async"
              />

              <div className="ovyra-hero-realm-cards-hotspots" role="list" aria-label="Archive beings">
                {HERO_CARD_LAYOUT.map((layout) => {
                  const figure = figureById(layout.id);
                  if (!figure) return null;

                  const isActive = activeCard === layout.id;
                  const style = {
                    ...layoutToStyle(layout),
                    ['--card-accent' as string]: figure.accent,
                  };

                  return (
                    <React.Fragment key={figure.code}>
                      <div
                        className={`ovyra-hero-realm-card-glow${isActive ? ' is-active' : ''}`}
                        style={style}
                        aria-hidden
                      />
                      <Link
                        to="/products"
                        role="listitem"
                        className={`ovyra-hero-realm-card${isActive ? ' is-active' : ''}`}
                        style={style}
                        onPointerEnter={() => setActiveCard(layout.id)}
                        onFocus={() => setActiveCard(layout.id)}
                        onBlur={() => setActiveCard(null)}
                        aria-label={`${figure.name} — ${figure.nameFa}`}
                        aria-current={isActive ? 'true' : undefined}
                      >
                        <span className="ovyra-hero-realm-card-meta">
                          <span className="ovyra-hero-realm-card-code">{figure.code}</span>
                          <span className="ovyra-hero-realm-card-name">{figure.name}</span>
                          <span className="ovyra-hero-realm-card-name-fa">{figure.nameFa}</span>
                        </span>
                      </Link>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <aside className="ovyra-hero-realm-social ovyra-fade-in ovyra-fade-in-delay" aria-label="Social">
          {heroRealm.social.map((item, index) => (
            <React.Fragment key={item.label}>
              {index > 0 && <span className="ovyra-hero-realm-social-sep" aria-hidden />}
              <a href={item.href} target="_blank" rel="noreferrer noopener" className="ovyra-hero-realm-social-link">
                {item.label}
              </a>
            </React.Fragment>
          ))}
        </aside>
      </div>

      <div className="ovyra-hero-realm-foot">
        <a href="#archive" className="ovyra-hero-realm-scroll">
          <span className="ovyra-hero-realm-scroll-ring" aria-hidden />
          <span className="ovyra-hero-realm-scroll-icon" aria-hidden>
            <span className="ovyra-hero-realm-scroll-wheel" />
          </span>
          <span>{heroRealm.scroll}</span>
        </a>

        <p className="ovyra-hero-realm-closing">
          <span>{heroRealm.closingLine1}</span>
          <span>{heroRealm.closingLine2}</span>
        </p>
      </div>
    </section>
  );
};

export default OvyraHeroRealm;

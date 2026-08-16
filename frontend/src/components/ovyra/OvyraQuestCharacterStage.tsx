import React, { useCallback, useEffect, useState } from 'react';
import { ARCHIVE_01, ARCHIVE_FIGURE_LARGE } from '../../brand/ovyra';

const ROTATE_MS = 2600;

const OvyraQuestCharacterStage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = ARCHIVE_01.length;
  const active = ARCHIVE_01[activeIndex];

  const goTo = useCallback((index: number) => {
    setActiveIndex((index + total) % total);
  }, [total]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % total);
    }, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [total]);

  return (
    <div className="ovyra-quest-char-stage" aria-live="polite">
      <div className="ovyra-quest-char-orbit-track" aria-hidden>
        {ARCHIVE_01.map((figure, index) => {
          const angle = index * (360 / total);
          const isActive = index === activeIndex;
          return (
            <div
              key={figure.code}
              className={`ovyra-quest-char-orbit-slot${isActive ? ' is-active' : ''}`}
              style={{ ['--char-angle' as string]: `${angle}deg`, ['--char-i' as string]: index }}
            >
              <img
                src={figure.image}
                alt=""
                className={`ovyra-quest-char-orbit-img${ARCHIVE_FIGURE_LARGE.has(figure.code) ? ' is-large' : ''}`}
                loading="lazy"
                decoding="async"
              />
            </div>
          );
        })}
      </div>

      <div className="ovyra-quest-char-spotlight">
        <span className="ovyra-quest-char-code font-display">{active.code}</span>
        <div className="ovyra-quest-char-spotlight-glow" aria-hidden />
        {ARCHIVE_01.map((figure, index) => (
          <img
            key={figure.code}
            src={figure.image}
            alt=""
            aria-hidden={index !== activeIndex}
            className={[
              'ovyra-quest-char-hero',
              ARCHIVE_FIGURE_LARGE.has(figure.code) ? 'is-large' : '',
              index === activeIndex ? 'is-visible' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ))}
        <div className="ovyra-quest-char-meta" dir="ltr" lang="en">
          <p className="ovyra-quest-char-name font-display">{active.name}</p>
          <p className="ovyra-quest-char-tagline font-display">{active.taglineEn}</p>
        </div>
      </div>

      <div className="ovyra-quest-char-dots" role="tablist" aria-label="شخصیت‌های آرشیو">
        {ARCHIVE_01.map((figure, index) => (
          <button
            key={figure.code}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`${figure.name} — ${figure.code}`}
            className={`ovyra-quest-char-dot${index === activeIndex ? ' is-active' : ''}`}
            onClick={() => goTo(index)}
          >
            {figure.code}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OvyraQuestCharacterStage;

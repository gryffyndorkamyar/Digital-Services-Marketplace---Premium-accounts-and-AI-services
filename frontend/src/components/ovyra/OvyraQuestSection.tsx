import React, { useCallback, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { BOX_CONTENTS, OVYRA_QUEST, QUEST_BOX_WORLD } from '../../brand/ovyra';
import OvyraQuestCharacterStage from './OvyraQuestCharacterStage';

const OvyraQuestSection: React.FC = () => {
  const q = OVYRA_QUEST;
  const [revealed, setRevealed] = useState(false);
  const boxPanelRef = useRef<HTMLDivElement>(null);

  const handleStartMission = useCallback(() => {
    setRevealed(true);
    toast(q.ctaToast, {
      duration: 4200,
      style: {
        background: 'linear-gradient(135deg, rgba(255,47,214,0.18), rgba(56,189,248,0.12))',
        border: '1px solid rgba(255,47,214,0.45)',
      },
    });
    window.setTimeout(() => {
      boxPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 120);
  }, [q.ctaToast]);

  return (
    <section
      id="ovyra-quest"
      className="ovyra-quest ovyra-quest-frame ovyra-section-border relative overflow-hidden"
      aria-labelledby="ovyra-quest-title"
    >
      <div className="ovyra-quest-ambient" aria-hidden>
        <div className="ovyra-quest-glow ovyra-quest-glow--pink" />
        <div className="ovyra-quest-glow ovyra-quest-glow--cyan" />
        <div className="ovyra-quest-glow ovyra-quest-glow--violet" />
        <div className="ovyra-quest-grid-fade" />
      </div>

      <div className="ovyra-quest-inner">
        <div className="ovyra-quest-stage ovyra-fade-in">
          <div className="ovyra-quest-visual ovyra-fade-in ovyra-fade-in-delay">
            <OvyraQuestCharacterStage />
          </div>

          <div className="ovyra-quest-copy" dir="rtl" lang="fa">
            <p className="ovyra-quest-eyebrow font-display">{q.eyebrow}</p>

            <h2 id="ovyra-quest-title" className="ovyra-quest-title font-display" dir="ltr" lang="en">
              {q.title}
            </h2>

            <p className="ovyra-quest-tagline font-fa">
              ماجراجویی تعاملی برای کودکان دنیای{' '}
              <span className="ovyra-quest-neon ovyra-quest-neon--pink">OVYRA</span>
            </p>

            <div className="ovyra-quest-body">
              <p className="ovyra-quest-paragraph font-fa">
                اینجا جاییه که هر بچه می‌تونه وارد دنیایی بشه که{' '}
                <span className="ovyra-quest-neon ovyra-quest-neon--cyan">هیچ‌کس هنوز کشفش نکرده</span>.
              </p>
              <p className="ovyra-quest-paragraph font-fa">
                <span className="ovyra-quest-neon ovyra-quest-neon--gold">معماها</span> رو حل کن،{' '}
                <span className="ovyra-quest-neon ovyra-quest-neon--pink">موجودات عجیب OVYRA</span> رو پیدا کن و{' '}
                <span className="ovyra-quest-neon ovyra-quest-neon--violet">رازهایی</span> رو کشف کن که بزرگ‌ترها
                ازشون خبر ندارن.
              </p>
              <p className="ovyra-quest-paragraph font-fa">
                <span className="ovyra-quest-neon ovyra-quest-neon--cyan">هر انتخاب تو</span>، بخشی از داستان رو
                تغییر می‌ده…
              </p>
            </div>

            <ul className="ovyra-quest-pillars" aria-label="Quest pillars">
              {q.pillars.map((pillar) => (
                <li key={pillar.en} className="ovyra-quest-pillar">
                  <span className="ovyra-quest-pillar-en font-display">{pillar.en}</span>
                  <span className="ovyra-quest-pillar-fa font-fa">{pillar.fa}</span>
                  <span className="ovyra-quest-pillar-hint font-fa">{pillar.hint}</span>
                </li>
              ))}
            </ul>

            <p className="ovyra-quest-closing font-fa">{q.closing}</p>

            <button type="button" className="ovyra-quest-cta" onClick={handleStartMission}>
              <Sparkles className="ovyra-quest-cta-icon" strokeWidth={2} aria-hidden />
              <span className="font-fa">{q.ctaLabel}</span>
              <span className="ovyra-quest-cta-soon font-display">{q.ctaSoon}</span>
            </button>
          </div>
        </div>

        <div
          ref={boxPanelRef}
          id="quest-box-world"
          className={`ovyra-quest-reveal${revealed ? ' is-open' : ''}`}
          aria-hidden={!revealed}
        >
          <div className="ovyra-quest-reveal-inner">
            <div className="ovyra-quest-reveal-head">
              <p className="ovyra-quest-reveal-eyebrow font-display">{QUEST_BOX_WORLD.eyebrow}</p>
              <h3 className="ovyra-quest-reveal-title font-fa-display">{QUEST_BOX_WORLD.title}</h3>
            </div>

            <div className="ovyra-quest-box-grid">
              {BOX_CONTENTS.map((item, index) => (
                <article
                  key={item.title}
                  className="ovyra-quest-box-card"
                  style={{ ['--quest-card-i' as string]: index }}
                >
                  <span className="ovyra-quest-box-hook ovyra-quest-box-hook-left" aria-hidden />
                  <span className="ovyra-quest-box-hook ovyra-quest-box-hook-right" aria-hidden />
                  <div className="ovyra-quest-box-inner">
                    <div className="ovyra-quest-box-icon-slot">
                      <img src={item.icon} alt="" className="ovyra-quest-box-icon" loading="lazy" decoding="async" />
                    </div>
                    <div className="ovyra-quest-box-copy">
                      <p className="ovyra-quest-box-title font-display">{item.title}</p>
                      <p className="ovyra-quest-box-title-fa font-fa">{item.titleFa}</p>
                      <p className="ovyra-quest-box-desc font-fa">{item.desc}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OvyraQuestSection;

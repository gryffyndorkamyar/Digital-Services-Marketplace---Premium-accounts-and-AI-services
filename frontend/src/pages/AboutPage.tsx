import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND, BOX_CONTENTS, COPY } from '../brand/ovyra';
import OvyraPageShell from '../components/ovyra/OvyraPageShell';
import OvyraPageHeader from '../components/ovyra/OvyraPageHeader';

const AboutPage: React.FC = () => {
  return (
    <OvyraPageShell>
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <OvyraPageHeader
          eyebrow={BRAND.series}
          title="داستان OVYRA"
          description={COPY.about.lead}
        />

        <div className="ovyra-holo-frame relative mb-10 overflow-hidden">
          <img src="/brand/lost-archive-packaging.png" alt="OVYRA packaging" className="w-full" />
          <div className="ovyra-sheen pointer-events-none absolute inset-0" />
        </div>

        <p className="ovyra-copy text-lg">{COPY.about.body}</p>
        <p className="font-fa mt-6 text-base leading-8 text-ovyra-mist/65">
          شعار سیستم:{' '}
          <span className="font-display tracking-wide text-white">{BRAND.tagline}</span>
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {BOX_CONTENTS.map((item) => (
            <div key={item.title} className="ovyra-neon-panel px-4 py-4">
              <p className="font-display text-xs tracking-[0.25em] text-ovyra-gold">{item.title}</p>
              <p className="font-fa-display mt-1 text-sm text-white">{item.titleFa}</p>
              <p className="ovyra-copy mt-2 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 font-display text-sm tracking-[0.35em] text-ovyra-violet">{BRAND.closing}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/products" className="ovyra-btn-neon font-fa">
            ورود به آرشیو
          </Link>
          <Link to="/" className="ovyra-btn-ghost font-fa">
            بازگشت
          </Link>
        </div>
      </div>
    </OvyraPageShell>
  );
};

export default AboutPage;

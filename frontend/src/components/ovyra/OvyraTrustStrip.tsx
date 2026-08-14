import React from 'react';
import { TRUST_SIGNALS } from '../../brand/ovyra';

const OvyraTrustStrip: React.FC = () => (
  <div className="ovyra-trust-neon">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2.5 px-4 py-4 sm:gap-x-12 sm:px-8 sm:py-5">
      {TRUST_SIGNALS.map((signal) => (
        <span
          key={signal}
          className="font-fa flex items-center gap-2.5 text-xs font-medium tracking-wide text-ovyra-mist/80 sm:text-sm"
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-ovyra-gold shadow-[0_0_12px_rgba(201,162,39,0.95)]" />
          {signal}
        </span>
      ))}
    </div>
  </div>
);

export default OvyraTrustStrip;

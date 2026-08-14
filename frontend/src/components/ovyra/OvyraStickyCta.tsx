import React from 'react';
import { Link } from 'react-router-dom';

import { COPY } from '../../brand/ovyra';

interface OvyraStickyCtaProps {
  label?: string;
  to?: string;
}

const OvyraStickyCta: React.FC<OvyraStickyCtaProps> = ({
  label = COPY.sticky,
  to = '/products',
}) => (
  <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t border-ovyra-violet/30 bg-ovyra-void/90 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] backdrop-blur-xl md:hidden">
    <Link to={to} className="ovyra-btn-neon pointer-events-auto flex w-full justify-center !py-3.5 font-fa">
      {label}
    </Link>
  </div>
);

export default OvyraStickyCta;

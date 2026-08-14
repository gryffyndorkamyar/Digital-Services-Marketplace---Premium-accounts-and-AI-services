import React from 'react';
import OvyraLogo from './OvyraLogo';

/** @deprecated use OvyraLogo — kept so older imports keep working */
const MignumLogo: React.FC<{ className?: string }> = ({ className }) => (
  <OvyraLogo className={className} />
);

export default MignumLogo;

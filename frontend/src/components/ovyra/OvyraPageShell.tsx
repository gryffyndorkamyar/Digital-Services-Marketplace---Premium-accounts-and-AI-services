import React from 'react';

interface OvyraPageShellProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

const OvyraPageShell: React.FC<OvyraPageShellProps> = ({ children, className = '', glow = true }) => (
  <div className={`relative min-h-screen overflow-hidden bg-ovyra-void pb-20 text-ovyra-mist ${className}`} style={{ paddingTop: 'var(--ovyra-header-h)' }}>
    {glow && (
      <>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(157,78,221,0.12),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_100%,rgba(201,162,39,0.08),transparent_45%)]" />
      </>
    )}
    <div className="relative z-10">{children}</div>
  </div>
);

export default OvyraPageShell;

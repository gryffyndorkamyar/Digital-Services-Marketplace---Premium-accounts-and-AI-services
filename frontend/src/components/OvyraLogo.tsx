import React from 'react';

interface OvyraLogoProps {
  className?: string;
  showWordmark?: boolean;
  variant?: 'nav' | 'hero';
  priority?: boolean;
}

const OvyraLogo: React.FC<OvyraLogoProps> = ({
  className = 'h-10 w-auto',
  showWordmark = false,
  variant = 'nav',
  priority = false,
}) => {
  return (
    <span
      className={`inline-flex items-center gap-2 ${
        variant === 'hero' ? 'ovyra-logo-hero' : 'ovyra-logo-nav'
      } ${className}`}
    >
      <img
        src="/brand/ovyra-logo.png"
        alt="OVYRA"
        className="h-full w-auto max-h-full object-contain"
        width={640}
        height={240}
        decoding="async"
        {...(priority ? { fetchPriority: 'high' as const } : {})}
      />
      {showWordmark && (
        <span className="font-display tracking-[0.35em] text-sm text-ovyra-metal hidden sm:inline">
          OVYRA
        </span>
      )}
    </span>
  );
};

export default OvyraLogo;

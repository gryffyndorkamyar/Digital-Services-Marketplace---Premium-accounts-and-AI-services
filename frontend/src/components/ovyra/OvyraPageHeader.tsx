import React from 'react';

interface OvyraPageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  action?: React.ReactNode;
}

const OvyraPageHeader: React.FC<OvyraPageHeaderProps> = ({ eyebrow, title, description, action }) => (
  <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
    <div className="max-w-2xl">
      <p className="font-display text-[11px] tracking-[0.42em] text-ovyra-gold">{eyebrow}</p>
      <h1 className="font-fa-display mt-3 text-3xl leading-tight text-white sm:text-4xl md:text-5xl">{title}</h1>
      {description && <p className="ovyra-copy mt-4 text-base">{description}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export default OvyraPageHeader;

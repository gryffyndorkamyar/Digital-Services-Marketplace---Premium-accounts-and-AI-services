import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import type { NavPillItem } from '../../brand/ovyra';

interface OvyraNavPillProps {
  item: NavPillItem;
  onClick?: () => void;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  asButton?: boolean;
}

const OvyraNavPill: React.FC<OvyraNavPillProps> = ({ item, onClick, fullWidth, icon, asButton }) => {
  const className = [
    'ovyra-nav-pill',
    item.comingSoon ? 'is-soon' : '',
    item.variant === 'kids' ? 'is-kids' : '',
    fullWidth ? 'w-full justify-center' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const style = {
    ['--pill-accent' as string]: item.accent,
    ['--pill-glow' as string]: item.glow,
  };

  const inner = (
    <>
      {item.comingSoon && item.variant !== 'kids' && (
        <span className="ovyra-soon-tag">
          <Sparkles className="h-2.5 w-2.5" strokeWidth={2} aria-hidden />
          به‌زودی
        </span>
      )}
      {item.variant === 'kids' && (
        <span className="ovyra-kids-tag" aria-hidden>
          <Sparkles className="h-2.5 w-2.5" strokeWidth={2} />
          SOON
        </span>
      )}
      <span className="ovyra-nav-pill-dot" aria-hidden />
      {icon && <span className="ovyra-nav-pill-icon">{icon}</span>}
      <span className="ovyra-nav-pill-label">{item.label}</span>
      <span className="ovyra-nav-pill-sheen" aria-hidden />
    </>
  );

  if (asButton) {
    return (
      <button type="button" onClick={onClick} className={className} style={style}>
        {inner}
      </button>
    );
  }

  if (item.comingSoon || !item.to) {
    return (
      <span className={className} style={style} aria-disabled>
        {inner}
      </span>
    );
  }

  return (
    <Link to={item.to} onClick={onClick} className={className} style={style}>
      {inner}
    </Link>
  );
};

export default OvyraNavPill;

import React from 'react';
import { Link } from 'react-router-dom';

export type NavChipItem = {
  id: string;
  label: string;
  to: string;
  icon?: React.ReactNode;
};

interface OvyraNavChipProps {
  item: NavChipItem;
  onClick?: () => void;
  fullWidth?: boolean;
  active?: boolean;
}

const OvyraNavChip: React.FC<OvyraNavChipProps> = ({ item, onClick, fullWidth, active }) => {
  const className = ['ovyra-nav-chip', active ? 'is-active' : '', fullWidth ? 'w-full justify-center' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <Link to={item.to} onClick={onClick} className={className}>
      {item.icon && <span className="ovyra-nav-chip-icon">{item.icon}</span>}
      <span className="ovyra-nav-chip-label">{item.label}</span>
      <span className="ovyra-nav-chip-sheen" aria-hidden />
    </Link>
  );
};

export default OvyraNavChip;

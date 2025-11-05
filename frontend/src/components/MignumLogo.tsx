import React from 'react';

interface MignumLogoProps {
  className?: string;
}

const MignumLogo: React.FC<MignumLogoProps> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* حرف M با طراحی نئونی */}
      <path
        d="M20 80 L20 20 L35 20 L50 50 L65 20 L80 20 L80 80 L65 80 L65 45 L50 70 L35 45 L35 80 Z"
        fill="#ff6b35"
        stroke="#ff6b35"
        strokeWidth="2"
        className="neon-pulse"
      />
      {/* افکت glow */}
      <path
        d="M20 80 L20 20 L35 20 L50 50 L65 20 L80 20 L80 80 L65 80 L65 45 L50 70 L35 45 L35 80 Z"
        fill="none"
        stroke="#ff6b35"
        strokeWidth="4"
        opacity="0.3"
        className="neon-pulse"
      />
    </svg>
  );
};

export default MignumLogo;


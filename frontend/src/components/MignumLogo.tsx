import React from 'react';

interface MignumLogoProps {
  className?: string;
}

const MignumLogo: React.FC<MignumLogoProps> = ({ className = '' }) => {
  // URL لوگوی واقعی از Django media
  const logoUrl = 'http://localhost:8000/media/avatars/mignum.png';
  
  return (
    <img
      src={logoUrl}
      alt="MIGNUM Logo"
      className={`${className} neon-pulse`}
      style={{
        filter: 'drop-shadow(0 0 5px #ff6b35) drop-shadow(0 0 10px #ff6b35)',
      }}
      onError={(e) => {
        // اگر تصویر لود نشد، یک fallback SVG نمایش بده
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.innerHTML = `
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
            <path d="M20 80 L20 20 L35 20 L50 50 L65 20 L80 20 L80 80 L65 80 L65 45 L50 70 L35 45 L35 80 Z" 
                  fill="#ff6b35" stroke="#ff6b35" stroke-width="2"/>
          </svg>
        `;
        target.parentElement?.appendChild(fallback);
      }}
    />
  );
};

export default MignumLogo;


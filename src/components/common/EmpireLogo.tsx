import React from 'react';

interface EmpireLogoProps {
  className?: string;
  /** Taille du côté en pixels */
  size?: number;
}

// Logo de l'organisateur (fichier public/logo-empire.png)
export const EmpireLogo: React.FC<EmpireLogoProps> = ({ className = '', size = 64 }) => (
  <img
    src="/logo-empire.png"
    alt="Logo Empire Informatique"
    width={size}
    height={size}
    loading="lazy"
    className={`rounded-xl bg-[#F4F1EA] object-cover shadow-[0_6px_20px_rgba(0,0,0,0.35)] ring-1 ring-[#E8C98A]/60 ${className}`}
    style={{ width: size, height: size }}
  />
);

import React, { useMemo } from 'react';
import QRCode from 'qrcode';

interface QRCodeSvgProps {
  value: string;
  size?: number;
  className?: string;
  /** Rend le code plus pâle (billet déjà utilisé) */
  dimmed?: boolean;
}

// Vrai QR code (scannable avec un téléphone), noir sur blanc pour un contraste maximal.
export const QRCodeSvg: React.FC<QRCodeSvgProps> = ({ value, size = 180, className = '', dimmed = false }) => {
  const { count, path } = useMemo(() => {
    const qr = QRCode.create(value, { errorCorrectionLevel: 'M' });
    const n = qr.modules.size;
    const data = qr.modules.data;
    let d = '';
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (data[r * n + c]) d += `M${c} ${r}h1v1h-1z`;
      }
    }
    return { count: n, path: d };
  }, [value]);

  const quiet = 2; // marge blanche obligatoire autour du code

  return (
    <svg
      role="img"
      aria-label="QR code du billet"
      width={size}
      height={size}
      viewBox={`${-quiet} ${-quiet} ${count + quiet * 2} ${count + quiet * 2}`}
      shapeRendering="crispEdges"
      className={`bg-white rounded-lg ${dimmed ? 'opacity-30' : ''} ${className}`}
    >
      <path d={path} fill="#111111" />
    </svg>
  );
};

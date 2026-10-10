import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { Camera, CameraOff } from 'lucide-react';

interface QrCameraProps {
  /** Appelé à chaque QR code lu (le même code n'est pas relu pendant 3 secondes) */
  onDetected: (text: string) => void;
  /** Met la lecture en pause (ex. pendant l'affichage d'un résultat) */
  paused?: boolean;
  className?: string;
}

// Caméra arrière + lecture des QR codes (jsQR). Nécessite https (ou localhost) : sinon le navigateur refuse la caméra.
export const QrCamera: React.FC<QrCameraProps> = ({ onDetected, paused = false, className = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [on, setOn] = useState(false);
  const [error, setError] = useState('');
  const last = useRef<{ text: string; at: number }>({ text: '', at: 0 });
  const pausedRef = useRef(paused);
  const onDetectedRef = useRef(onDetected);
  pausedRef.current = paused;
  onDetectedRef.current = onDetected;

  useEffect(() => {
    if (!on) return;
    let stream: MediaStream | null = null;
    let frame = 0;
    let stopped = false;

    const tick = () => {
      if (stopped) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState >= 2 && !pausedRef.current) {
        const w = 480;
        const h = Math.round((video.videoHeight / video.videoWidth) * w) || 360;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(video, 0, 0, w, h);
          const code = jsQR(ctx.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: 'dontInvert' });
          const now = Date.now();
          if (code?.data && (code.data !== last.current.text || now - last.current.at > 3000)) {
            last.current = { text: code.data, at: now };
            if (navigator.vibrate) navigator.vibrate(80);
            onDetectedRef.current(code.data);
          }
        }
      }
      frame = requestAnimationFrame(tick);
    };

    (async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('La caméra n\'est pas disponible ici. Ouvre le site en https (lien en ligne) ou saisis le code à la main.');
        setOn(false);
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
        if (stopped) return stream.getTracks().forEach((t) => t.stop());
        const video = videoRef.current!;
        video.srcObject = stream;
        await video.play();
        frame = requestAnimationFrame(tick);
      } catch {
        setError('Accès à la caméra refusé. Autorise la caméra dans les réglages du navigateur, ou saisis le code à la main.');
        setOn(false);
      }
    })();

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [on]);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-black ${className}`}>
      <video ref={videoRef} playsInline muted className={`w-full h-full object-cover ${on ? '' : 'hidden'}`} />
      <canvas ref={canvasRef} className="hidden" />
      {on ? (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="w-3/5 aspect-square max-w-64 rounded-3xl border-4 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
          </div>
          <button
            onClick={() => setOn(false)}
            className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/60 text-white text-xs font-semibold cursor-pointer"
          >
            <CameraOff className="w-4 h-4" /> Arrêter
          </button>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <button
            onClick={() => { setError(''); setOn(true); }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-b from-[#FFB43A] to-[#F2761B] text-[#3D0A04] font-bold text-sm cursor-pointer hover:brightness-110"
          >
            <Camera className="w-5 h-5" /> Activer la caméra
          </button>
          <p className="text-xs text-stone-400 max-w-xs">{error || 'Vise le QR code de l\'invitation : la vérification est automatique.'}</p>
        </div>
      )}
    </div>
  );
};

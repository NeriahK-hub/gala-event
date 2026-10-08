import QRCode from 'qrcode';
import { GalaInfo, IssuedTicket } from '../types';

// Invitation téléchargeable : ticket horizontal (QR code à gauche, affiche à droite),
// dessiné sur un canvas puis exporté en PNG. Format 3 : 1 comme l'affiche de la billetterie.
const W = 2160;
const H = 730;
const LEFT = 566; // largeur du volet blanc

const SANS = '"Plus Jakarta Sans", system-ui, sans-serif';
const SCRIPT = '"Great Vibes", "Pinyon Script", cursive';

interface InvitationData {
  ticket: IssuedTicket;
  info: GalaInfo;
}

const loadFonts = async () => {
  try {
    await Promise.all([
      document.fonts.load(`800 120px ${SANS}`),
      document.fonts.load(`700 40px ${SANS}`),
      document.fonts.load(`120px ${SCRIPT}`),
    ]);
  } catch {
    // polices indisponibles : les polices de secours sont utilisées
  }
};

// Texte étiré horizontalement pour occuper une largeur exacte (effet affiche « extra gras »)
const fitText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  baseline: number,
  capHeight: number,
  width: number,
  weight = 800
) => {
  const size = capHeight / 0.72;
  ctx.font = `${weight} ${size}px ${SANS}`;
  const measured = ctx.measureText(text).width || 1;
  ctx.save();
  ctx.translate(x, baseline);
  ctx.scale(width / measured, 1);
  ctx.fillStyle = '#FFFFFF';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(text, 0, 0);
  // léger contour pour épaissir les lettres
  ctx.lineWidth = size * 0.035;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineJoin = 'round';
  ctx.strokeText(text, 0, 0);
  ctx.restore();
};

export const renderInvitation = async ({ ticket, info }: InvitationData): Promise<HTMLCanvasElement> => {
  await loadFonts();
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  /* ---------- Volet gauche : QR code ---------- */
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, LEFT, H);

  const qr = QRCode.create(ticket.qrPayload, { errorCorrectionLevel: 'M' });
  const n = qr.modules.size;
  const quiet = 2;
  const qrSize = 400;
  const cell = qrSize / (n + quiet * 2);
  const qx = (LEFT - qrSize) / 2;
  const qy = 56;
  ctx.fillStyle = '#111111';
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.modules.data[r * n + c]) {
        ctx.fillRect(qx + (c + quiet) * cell, qy + (r + quiet) * cell, Math.ceil(cell), Math.ceil(cell));
      }
    }
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#111111';
  ctx.font = `800 46px ${SANS}`;
  ctx.fillText('SCANNEZ-MOI !', LEFT / 2, 560);
  ctx.font = `600 30px ${SANS}`;
  ctx.fillStyle = '#444444';
  ctx.fillText(ticket.ticketNumber, LEFT / 2, 624);
  ctx.font = `500 28px ${SANS}`;
  ctx.fillStyle = '#666666';
  const holder = ticket.attendeeName.length > 26 ? `${ticket.attendeeName.slice(0, 25)}…` : ticket.attendeeName;
  ctx.fillText(holder, LEFT / 2, 676);

  /* ---------- Volet droit : rideau rouge ---------- */
  const rw = W - LEFT;
  const base = ctx.createLinearGradient(LEFT, 0, W, 0);
  base.addColorStop(0, '#9A0C16');
  base.addColorStop(0.45, '#4A0509');
  base.addColorStop(0.55, '#4A0509');
  base.addColorStop(1, '#9A0C16');
  ctx.fillStyle = base;
  ctx.fillRect(LEFT, 0, rw, H);

  // plis du rideau
  for (let x = LEFT; x < W; x += 150) {
    const fold = ctx.createLinearGradient(x, 0, x + 150, 0);
    fold.addColorStop(0, 'rgba(0,0,0,0.30)');
    fold.addColorStop(0.5, 'rgba(255,70,60,0.10)');
    fold.addColorStop(1, 'rgba(0,0,0,0.30)');
    ctx.fillStyle = fold;
    ctx.fillRect(x, 0, 150, H);
  }
  const vignette = ctx.createLinearGradient(0, 0, 0, H);
  vignette.addColorStop(0, 'rgba(0,0,0,0.25)');
  vignette.addColorStop(0.5, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.35)');
  ctx.fillStyle = vignette;
  ctx.fillRect(LEFT, 0, rw, H);

  const x0 = 790; // début du texte
  const textW = 1140;

  // « Anniversaire » en script orange/or, légèrement incliné
  ctx.save();
  ctx.translate(x0 + textW / 2, 250);
  ctx.rotate(-0.075);
  ctx.textAlign = 'center';
  ctx.font = `220px ${SCRIPT}`;
  const grad = ctx.createLinearGradient(0, -170, 0, 40);
  grad.addColorStop(0, '#FFE9A8');
  grad.addColorStop(0.55, '#FFB43A');
  grad.addColorStop(1, '#F2761B');
  ctx.fillStyle = grad;
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 14;
  ctx.fillText('Anniversaire', 0, 0);
  ctx.restore();

  // EMPIRE / INFORMATIQUE
  ctx.textAlign = 'left';
  ctx.shadowColor = 'transparent';
  fitText(ctx, 'EMPIRE', x0, 420, 150, textW);
  fitText(ctx, 'INFORMATIQUE', x0, 530, 82, textW - 10);

  // téléphone
  const py = 618;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x0 + 30, py, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.translate(x0 + 30 - 15, py - 15);
  ctx.scale(1.25, 1.25);
  ctx.fillStyle = '#8E0A18';
  ctx.fill(
    new Path2D(
      'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'
    )
  );
  ctx.restore();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `800 58px ${SANS}`;
  ctx.fillText(info.whatsappNumber, x0 + 80, py + 20);

  // date
  ctx.font = `600 32px ${SANS}`;
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText(`${info.dateText}  •  ${info.city}`, x0 + 2, py + 76);

  return canvas;
};

export const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('png'))), 'image/png'));

export const downloadInvitation = async (data: InvitationData) => {
  const blob = await canvasToBlob(await renderInvitation(data));
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invitation-${data.ticket.ticketNumber}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
};

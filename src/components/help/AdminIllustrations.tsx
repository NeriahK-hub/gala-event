import React from 'react';
import {
  Check,
  Clock,
  Copy,
  Download,
  History,
  KeyRound,
  Link2,
  LogOut,
  Plus,
  ScanLine,
  Send,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { QrGlyph } from './ClientIllustrations';

// Illustrations des tutos de la console : mini-écrans dans le style de l'admin (brun sombre, or doux).

const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";
const GOLD = '#E6C78A';
const INK = '#2B1B0A';
const PANEL = '#2A221E';
const GREEN = '#34D399';

const Svg: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <svg viewBox="0 0 300 180" role="img" aria-label={title} className="w-full h-auto" style={{ fontFamily: FONT }}>
    {children}
  </svg>
);

const Panel: React.FC<{ x: number; y: number; w: number; h: number; fill?: string; shadow?: boolean }> = ({ x, y, w, h, fill = PANEL, shadow = true }) => (
  <>
    {shadow && <rect x={x} y={y + 6} width={w} height={h} rx={14} fill="#000" opacity="0.28" />}
    <rect x={x} y={y} width={w} height={h} rx={14} fill={fill} stroke="rgba(255,255,255,0.08)" />
  </>
);

const Bar: React.FC<{ x: number; y: number; w: number; o?: number; h?: number }> = ({ x, y, w, o = 0.25, h = 5 }) => (
  <rect x={x} y={y} width={w} height={h} rx={h / 2} fill="#fff" opacity={o} />
);

const Btn: React.FC<{ x: number; y: number; w: number; label: string; tone?: 'gold' | 'ghost' | 'green' | 'red' }> = ({ x, y, w, label, tone = 'gold' }) => {
  const s = {
    gold: { fill: GOLD, stroke: 'none', text: INK },
    ghost: { fill: 'transparent', stroke: 'rgba(255,255,255,0.2)', text: '#E7E5E4' },
    green: { fill: '#25D366', stroke: 'none', text: '#052E16' },
    red: { fill: 'transparent', stroke: 'rgba(248,113,113,0.5)', text: '#FCA5A5' },
  }[tone];
  return (
    <g>
      <rect x={x} y={y} width={w} height={20} rx={7} fill={s.fill} stroke={s.stroke} />
      <text x={x + w / 2} y={y + 13.5} textAnchor="middle" fontSize="7.5" fontWeight="700" fill={s.text}>
        {label}
      </text>
    </g>
  );
};

const Avatar: React.FC<{ cx: number; cy: number; text: string; r?: number }> = ({ cx, cy, text, r = 11 }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill="rgba(230,199,138,0.16)" stroke="rgba(230,199,138,0.35)" />
    <text x={cx} y={cy + 3} textAnchor="middle" fontSize={r * 0.75} fontWeight="700" fill="#F5F5F4">
      {text}
    </text>
  </g>
);

const Pill: React.FC<{ x: number; y: number; label: string; tone: 'amber' | 'green' | 'grey' | 'red'; w?: number }> = ({ x, y, label, tone, w }) => {
  const c = {
    amber: ['rgba(245,158,11,0.15)', '#FCD34D'],
    green: ['rgba(16,185,129,0.15)', '#6EE7B7'],
    grey: ['rgba(255,255,255,0.06)', '#78716C'],
    red: ['rgba(239,68,68,0.15)', '#FCA5A5'],
  }[tone];
  const width = w ?? label.length * 4.4 + 14;
  return (
    <g>
      <rect x={x} y={y} width={width} height={13} rx={6.5} fill={c[0]} />
      <text x={x + width / 2} y={y + 9} textAnchor="middle" fontSize="6.5" fontWeight="700" fill={c[1]}>
        {label}
      </text>
    </g>
  );
};

// Pointeur de souris (clic)
const Cursor: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={13} fill="#fff" opacity="0.12" />
    <path d="M0 0 L0 15 L4 11 L7 18 L10 16.5 L7 10 L12.5 10 Z" fill="#fff" stroke="#1C1917" strokeWidth="1.2" strokeLinejoin="round" />
  </g>
);

const Badge: React.FC<{ cx: number; cy: number; r?: number; fill?: string; children: React.ReactNode }> = ({ cx, cy, r = 16, fill = GREEN, children }) => (
  <g>
    <circle cx={cx} cy={cy} r={r + 6} fill={fill} opacity="0.15" />
    <circle cx={cx} cy={cy} r={r} fill={fill} />
    {children}
  </g>
);

const Glow: React.FC<{ id: string; cx?: number; cy?: number; color?: string }> = ({ id, cx = 150, cy = 90, color = GOLD }) => (
  <>
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor={color} stopOpacity="0.18" />
        <stop offset="1" stopColor={color} stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx={cx} cy={cy} r={110} fill={`url(#${id})`} />
  </>
);

/** Valider un paiement */
export const ArtValidate: React.FC = () => (
  <Svg title="Une commande en attente et le bouton Valider">
    <Glow id="g-val" />
    <Panel x={30} y={42} w={190} h={96} />
    <Avatar cx={56} cy={70} text="CD" />
    <text x={74} y={68} fontSize="9" fontWeight="700" fill="#F5F5F4">Client démo</text>
    <Pill x={136} y={59} label="En attente" tone="amber" />
    <text x={74} y={80} fontSize="7" fill="#A8A29E">3 billets · 30 $ · GALA-0002</text>
    <Bar x={44} y={96} w={162} o={0.06} h={1} />
    <Btn x={44} y={106} w={66} label="Valider" />
    <Btn x={116} y={106} w={54} label="Refuser" tone="red" />
    <Cursor x={88} y={116} />
    <Badge cx={246} cy={70}>
      <Check x={236} y={60} width={20} height={20} color="#053527" strokeWidth={3} />
    </Badge>
    <g>
      <rect x={214} y={98} width={68} height={26} rx={9} fill={PANEL} stroke="rgba(255,255,255,0.1)" />
      <Link2 x={221} y={104} width={14} height={14} color={GOLD} />
      <text x={239} y={114} fontSize="7" fontWeight="700" fill="#E7E5E4">Lien créé</text>
    </g>
  </Svg>
);

/** Ajouter une commande reçue sur WhatsApp */
export const ArtAddOrder: React.FC = () => (
  <Svg title="Le message WhatsApp du client devient une commande">
    <Glow id="g-add" color="#25D366" />
    <g>
      <rect x={18} y={40} width={108} height={74} rx={12} fill="#0E5C47" />
      <path d="M30 114 l-5 10 l14 -10 z" fill="#0E5C47" />
      <Bar x={28} y={50} w={60} o={0.7} />
      <Bar x={28} y={60} w={84} o={0.4} />
      <rect x={26} y={72} width={92} height={30} rx={6} fill="rgba(0,0,0,0.3)" />
      <text x={32} y={84} fontSize="6" fill="#9AF0C4" fontFamily="ui-monospace, monospace">Code commande</text>
      <text x={32} y={95} fontSize="7" fill="#D1FAE5" fontFamily="ui-monospace, monospace">eyJpZCI6IkdB…</text>
    </g>
    <path d="M132 82 h26" stroke={GOLD} strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
    <path d="M154 76 l7 6 l-7 6" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Panel x={170} y={44} w={112} h={92} />
    <rect x={180} y={54} width={18} height={18} rx={6} fill={GOLD} />
    <Plus x={183} y={57} width={12} height={12} color={INK} strokeWidth={3} />
    <text x={204} y={66} fontSize="8" fontWeight="700" fill="#F5F5F4">Commande</text>
    <text x={180} y={88} fontSize="7" fill="#A8A29E">Client</text>
    <Bar x={220} y={83} w={50} o={0.35} />
    <text x={180} y={102} fontSize="7" fill="#A8A29E">Billets</text>
    <text x={270} y={102} textAnchor="end" fontSize="7.5" fontWeight="700" fill="#F5F5F4">3</text>
    <text x={180} y={116} fontSize="7" fill="#A8A29E">Total</text>
    <text x={270} y={116} textAnchor="end" fontSize="8" fontWeight="800" fill={GOLD}>30 $</text>
  </Svg>
);

/** Envoyer le lien d'invitations */
export const ArtSendLink: React.FC = () => (
  <Svg title="Le lien d'invitations est copié ou envoyé sur WhatsApp">
    <Glow id="g-send" color="#25D366" />
    <Panel x={24} y={40} w={170} h={100} />
    <Badge cx={44} cy={62} r={9} fill={GREEN}>
      <Check x={38} y={56} width={12} height={12} color="#053527" strokeWidth={3} />
    </Badge>
    <text x={60} y={65} fontSize="8" fontWeight="700" fill="#F5F5F4">Paiement validé</text>
    <rect x={36} y={80} width={110} height={20} rx={7} fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.1)" />
    <text x={44} y={93} fontSize="6.5" fill="#A8A29E" fontFamily="ui-monospace, monospace">…/?billet=eyJv…</text>
    <rect x={150} y={80} width={32} height={20} rx={7} fill="none" stroke="rgba(255,255,255,0.2)" />
    <Copy x={159} y={84} width={12} height={12} color="#E7E5E4" />
    <rect x={36} y={108} width={146} height={22} rx={11} fill="#25D366" />
    <text x={109} y={122} textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#052E16">Envoyer sur WhatsApp</text>
    <path d="M200 112 C222 112 226 86 244 84" fill="none" stroke="#25D366" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
    <Badge cx={258} cy={78} r={18} fill="#25D366">
      <Send x={248} y={68} width={20} height={20} color="#052E16" strokeWidth={2.4} />
    </Badge>
  </Svg>
);

/** Relancer ou refuser */
export const ArtFollowUp: React.FC = () => (
  <Svg title="Relancer un client en attente, ou refuser une commande">
    <Glow id="g-fu" color="#F59E0B" />
    <Panel x={30} y={34} w={240} h={50} />
    <Avatar cx={54} cy={59} text="JM" />
    <text x={72} y={56} fontSize="8.5" fontWeight="700" fill="#F5F5F4">Jean M.</text>
    <text x={72} y={67} fontSize="6.5" fill="#A8A29E">2 billets · 20 $</text>
    <Pill x={128} y={47} label="En attente" tone="amber" />
    <Btn x={196} y={49} w={62} label="Relancer" tone="ghost" />
    <Panel x={30} y={100} w={240} h={50} />
    <Avatar cx={54} cy={125} text="AK" />
    <text x={72} y={122} fontSize="8.5" fontWeight="700" fill="#F5F5F4">Aline K.</text>
    <text x={72} y={133} fontSize="6.5" fill="#A8A29E">1 billet · 10 $</text>
    <Pill x={128} y={113} label="Refusée" tone="red" />
    <Btn x={176} y={115} w={82} label="Remettre en attente" tone="ghost" />
  </Svg>
);

/** Contrôler les entrées */
export const ArtScan: React.FC = () => (
  <Svg title="Le téléphone scanne le QR code de l'invitation et affiche Billet valide">
    <Glow id="g-scan" color={GREEN} />
    <g transform="rotate(-8 70 96)">
      <rect x={30} y={44} width={78} height={96} rx={12} fill="#fff" />
      <rect x={30} y={44} width={78} height={20} rx={12} fill="#8E1B26" />
      <rect x={30} y={54} width={78} height={10} fill="#8E1B26" />
      <QrGlyph x={46} y={74} size={46} />
    </g>
    <rect x={150} y={16} width={104} height={152} rx={20} fill="#1C1917" stroke="rgba(255,255,255,0.18)" />
    <rect x={158} y={30} width={88} height={78} rx={12} fill="#0A0A0A" />
    <g stroke={GREEN} strokeWidth="3" fill="none" strokeLinecap="round">
      <path d="M170 48 v-8 h8" />
      <path d="M234 48 v-8 h-8" />
      <path d="M170 98 v8 h8" />
      <path d="M234 98 v8 h-8" />
    </g>
    <QrGlyph x={184} y={52} size={36} color="#1a1a1a" />
    <rect x={170} y={70} width={64} height={2} rx={1} fill={GREEN} className="help-scanline" />
    <rect x={158} y={116} width={88} height={40} rx={10} fill="#065F46" />
    <circle cx={174} cy={136} r={8} fill={GREEN} />
    <Check x={168} y={130} width={12} height={12} color="#053527" strokeWidth={3.2} />
    <text x={187} y={134} fontSize="7.5" fontWeight="800" fill="#fff">Billet valide</text>
    <text x={187} y={144} fontSize="6" fill="rgba(255,255,255,0.7)">Convive suivant</text>
  </Svg>
);

/** Créer un lien de scan pour un contrôleur */
export const ArtScanLink: React.FC = () => (
  <Svg title="Un lien de contrôle nominatif avec sa date limite">
    <Glow id="g-sl" />
    <Panel x={26} y={36} w={190} h={108} />
    <rect x={40} y={50} width={22} height={22} rx={7} fill="rgba(230,199,138,0.14)" />
    <ScanLine x={45} y={55} width={12} height={12} color={GOLD} />
    <text x={70} y={60} fontSize="8.5" fontWeight="700" fill="#F5F5F4">Porte A – Jean</text>
    <text x={70} y={70} fontSize="6.5" fill="#A8A29E">38 entrées</text>
    <rect x={40} y={82} width={162} height={18} rx={6} fill="rgba(0,0,0,0.22)" />
    <Clock x={46} y={86} width={10} height={10} color="#A8A29E" />
    <text x={61} y={94} fontSize="6.5" fill="#D6D3D1">Valable jusqu'au 13 déc. 06:00</text>
    <Btn x={40} y={110} w={58} label="Copier" tone="ghost" />
    <Btn x={104} y={110} w={58} label="Envoyer" tone="green" />
    {/* interrupteur */}
    <rect x={168} y={112} width={30} height={16} rx={8} fill="rgba(16,185,129,0.75)" />
    <circle cx={190} cy={120} r={6} fill="#fff" />
    <Avatar cx={256} cy={78} text="J" r={20} />
    <path d="M222 90 C232 90 234 84 236 82" fill="none" stroke={GOLD} strokeWidth="2" strokeDasharray="3 4" strokeLinecap="round" />
    <Pill x={232} y={104} label="Scanner seul" tone="green" w={50} />
  </Svg>
);

/** Inviter un admin */
export const ArtInvite: React.FC = () => (
  <Svg title="Inviter un admin et cocher ce qu'il peut faire">
    <Glow id="g-inv" />
    <Panel x={22} y={30} w={170} h={120} />
    <rect x={36} y={44} width={22} height={22} rx={7} fill={GOLD} />
    <UserPlus x={41} y={49} width={12} height={12} color={INK} strokeWidth={2.6} />
    <text x={66} y={58} fontSize="8.5" fontWeight="700" fill="#F5F5F4">Inviter un admin</text>
    <rect x={36} y={74} width={142} height={16} rx={5} fill="rgba(0,0,0,0.22)" />
    <text x={42} y={85} fontSize="7" fill="#E7E5E4">Christelle</text>
    {[
      ['Commandes', true],
      ['Valider', true],
      ['Contenu', false],
    ].map(([label, on], i) => (
      <g key={String(label)} transform={`translate(${36 + i * 48} 100)`}>
        <rect width={44} height={15} rx={7.5} fill={on ? 'rgba(16,185,129,0.15)' : 'transparent'} stroke={on ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.12)'} />
        <text x={22} y={10} textAnchor="middle" fontSize="6" fontWeight="600" fill={on ? '#A7F3D0' : '#78716C'}>
          {String(label)}
        </text>
      </g>
    ))}
    <Btn x={36} y={124} w={142} label="Créer le lien d'invitation" />
    <path d="M198 92 h18" stroke={GOLD} strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
    <g>
      <rect x={222} y={62} width={64} height={64} rx={16} fill={PANEL} stroke="rgba(255,255,255,0.1)" />
      <KeyRound x={240} y={74} width={28} height={28} color={GOLD} strokeWidth={1.8} />
      <text x={254} y={116} textAnchor="middle" fontSize="6.5" fill="#A8A29E">24 h · 1 fois</text>
    </g>
  </Svg>
);

/** Modifier le contenu du site */
export const ArtContent: React.FC = () => (
  <Svg title="Modifier un texte dans l'admin : le site change aussitôt">
    <Glow id="g-ct" color="#F2761B" />
    <Panel x={18} y={40} w={136} h={100} />
    <text x={30} y={58} fontSize="6.5" fontWeight="700" fill={GOLD}>Titre</text>
    <rect x={30} y={64} width={112} height={20} rx={6} fill="rgba(0,0,0,0.25)" stroke="rgba(230,199,138,0.5)" />
    <text x={36} y={77} fontSize="7.5" fill="#F5F5F4">Réserve ton billet</text>
    <rect x={110} y={68} width={1.5} height={12} fill={GOLD} />
    <text x={30} y={100} fontSize="6.5" fontWeight="700" fill={GOLD}>Sous-titre</text>
    <rect x={30} y={106} width={112} height={22} rx={6} fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.1)" />
    <Bar x={36} y={113} w={90} o={0.3} h={3} />
    <Bar x={36} y={120} w={64} o={0.3} h={3} />
    <path d="M160 90 h16" stroke={GOLD} strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
    <path d="M172 84 l7 6 l-7 6" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {/* aperçu du site */}
    <rect x={186} y={40} width={98} height={104} rx={12} fill="#7A1420" />
    <rect x={186} y={40} width={98} height={104} rx={12} fill="url(#g-pleat)" />
    <defs>
      <linearGradient id="g-pleat" x1="0" x2="1">
        <stop offset="0" stopColor="#000" stopOpacity="0.25" />
        <stop offset="0.5" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.25" />
      </linearGradient>
    </defs>
    <text x={235} y={64} textAnchor="middle" fontSize="6" fontWeight="700" fill="#FFB43A">Billetterie</text>
    <rect x={196} y={70} width={78} height={18} rx={5} fill="rgba(255,255,255,0.12)" stroke="#FFB43A" strokeDasharray="3 2" />
    <text x={235} y={82} textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#fff">Réserve ton billet</text>
    <Bar x={202} y={96} w={66} o={0.4} h={3} />
    <Bar x={210} y={103} w={50} o={0.4} h={3} />
    <rect x={208} y={116} width={54} height={14} rx={7} fill="#FBA53C" />
  </Svg>
);

/** Ventes et compte à rebours */
export const ArtSettings: React.FC = () => (
  <Svg title="Ouvrir ou fermer les ventes et régler la fin de la billetterie">
    <Glow id="g-set" />
    <Panel x={40} y={30} w={220} h={120} />
    {[
      ['Ventes ouvertes', true, 52],
      ['Fermeture automatique', true, 82],
      ['Dress code', false, 112],
    ].map(([label, on, y]) => (
      <g key={String(label)}>
        <text x={56} y={Number(y) + 12} fontSize="8" fontWeight="600" fill="#E7E5E4">{String(label)}</text>
        <rect x={216} y={Number(y) + 2} width={28} height={15} rx={7.5} fill={on ? 'rgba(16,185,129,0.75)' : 'rgba(255,255,255,0.15)'} />
        <circle cx={on ? 236.5 : 223.5} cy={Number(y) + 9.5} r={5.5} fill="#fff" />
        {Number(y) < 112 && <Bar x={56} y={Number(y) + 24} w={188} o={0.06} h={1} />}
      </g>
    ))}
    <g>
      <rect x={180} y={8} width={102} height={26} rx={13} fill={PANEL} stroke="rgba(255,255,255,0.12)" />
      <Clock x={190} y={14} width={14} height={14} color={GOLD} />
      <text x={209} y={25} fontSize="7.5" fontWeight="700" fill="#F5F5F4">Fin : 62 j 10 h</text>
    </g>
  </Svg>
);

/** Sauvegarder les commandes */
export const ArtBackup: React.FC = () => (
  <Svg title="Télécharger une sauvegarde des commandes">
    <Glow id="g-bk" />
    <g>
      <rect x={70} y={36} width={84} height={106} rx={12} fill="#000" opacity="0.28" transform="translate(0 6)" />
      <path d="M70 48 a12 12 0 0 1 12 -12 h48 l24 24 v70 a12 12 0 0 1 -12 12 h-60 a12 12 0 0 1 -12 -12 z" fill="#F6EEDC" />
      <path d="M130 36 v14 a10 10 0 0 0 10 10 h14" fill="#E3D5B8" />
      <text x={112} y={96} textAnchor="middle" fontSize="13" fontWeight="800" fill="#8E1B26">.json</text>
      <text x={112} y={112} textAnchor="middle" fontSize="6.5" fill="#7A4A2A">42 commandes</text>
    </g>
    <Badge cx={190} cy={108} r={20} fill={GOLD}>
      <Download x={178} y={96} width={24} height={24} color={INK} strokeWidth={2.4} />
    </Badge>
    <g>
      <rect x={196} y={36} width={76} height={26} rx={13} fill={PANEL} stroke="rgba(255,255,255,0.12)" />
      <ShieldCheck x={205} y={42} width={14} height={14} color={GREEN} />
      <text x={224} y={53} fontSize="7" fontWeight="700" fill="#F5F5F4">À l'abri</text>
    </g>
  </Svg>
);

/** Se connecter / code oublié */
export const ArtAccount: React.FC = () => (
  <Svg title="Se connecter avec son identifiant et son code, ou se déconnecter">
    <Glow id="g-acc" />
    <Panel x={60} y={22} w={150} h={136} />
    <circle cx={135} cy={48} r={13} fill="rgba(230,199,138,0.14)" />
    <KeyRound x={127} y={40} width={16} height={16} color={GOLD} />
    <rect x={76} y={72} width={118} height={20} rx={7} fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.1)" />
    <text x={135} y={85} textAnchor="middle" fontSize="7.5" fill="#F5F5F4" fontFamily="ui-monospace, monospace">christelle</text>
    <rect x={76} y={98} width={118} height={20} rx={7} fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.1)" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <circle key={i} cx={113 + i * 9} cy={108} r={2.3} fill="#F5F5F4" />
    ))}
    <Btn x={76} y={126} w={118} label="Ouvrir la console" />
    <g>
      <rect x={220} y={110} width={64} height={26} rx={13} fill={PANEL} stroke="rgba(255,255,255,0.12)" />
      <LogOut x={229} y={116} width={14} height={14} color="#E7E5E4" />
      <text x={248} y={126} fontSize="6.5" fontWeight="700" fill="#E7E5E4">Quitter</text>
    </g>
  </Svg>
);

/** Lire l'historique */
export const ArtHistory: React.FC = () => (
  <Svg title="L'historique détaillé des actions de l'équipe">
    <Glow id="g-hi" />
    <Panel x={30} y={22} w={240} h={140} />
    <History x={44} y={34} width={14} height={14} color={GOLD} />
    <text x={64} y={45} fontSize="8.5" fontWeight="700" fill="#F5F5F4">Historique</text>
    <line x1={49} y1={60} x2={49} y2={150} stroke="rgba(255,255,255,0.1)" />
    {[
      { y: 64, who: 'Christelle', what: 'a validé GALA-0012', d: '3 billets · 30 $', c: '#A8A29E' },
      { y: 98, who: 'Patrick', what: 'a modifié les droits', d: 'Ajouté : Valider les paiements', c: '#6EE7B7' },
      { y: 132, who: 'Scan · Porte A', what: 'scan refusé', d: 'Billet déjà utilisé à 19:42', c: '#FCA5A5' },
    ].map((e) => (
      <g key={e.y}>
        <circle cx={49} cy={e.y + 3} r={4} fill="#1F1916" stroke={GOLD} strokeWidth="1.5" />
        <text x={62} y={e.y + 6} fontSize="7.5" fill="#D6D3D1">
          <tspan fontWeight="700" fill="#F5F5F4">{e.who}</tspan> {e.what}
        </text>
        <rect x={62} y={e.y + 11} width={190} height={14} rx={5} fill="rgba(0,0,0,0.22)" />
        <text x={68} y={e.y + 20.5} fontSize="6.5" fill={e.c}>{e.d}</text>
      </g>
    ))}
  </Svg>
);

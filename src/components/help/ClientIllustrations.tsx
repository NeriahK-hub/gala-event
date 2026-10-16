import React, { useId } from 'react';
import { Link2 } from 'lucide-react';

// Illustrations dessinées pour expliquer le parcours client (section « Comment ça marche »).
// Pas d'images externes : tout est en SVG, aux couleurs du gala (velours, orange, or).

const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";

// Petit QR code décoratif (motif fixe) : 3 carrés de repère + modules
const QR_BITS = [
  '1011010', '0110101', '1101001', '0010110', '1011011', '0101100', '1100101',
];
export const QrGlyph: React.FC<{ x: number; y: number; size: number; color?: string }> = ({ x, y, size, color = '#2B1206' }) => {
  const c = size / 21;
  const finder = (fx: number, fy: number) => (
    <g key={`${fx}-${fy}`}>
      <rect x={x + fx * c} y={y + fy * c} width={7 * c} height={7 * c} rx={c * 1.4} fill={color} />
      <rect x={x + (fx + 1) * c} y={y + (fy + 1) * c} width={5 * c} height={5 * c} rx={c} fill="#fff" />
      <rect x={x + (fx + 2) * c} y={y + (fy + 2) * c} width={3 * c} height={3 * c} rx={c * 0.6} fill={color} />
    </g>
  );
  const modules: React.ReactNode[] = [];
  for (let r = 0; r < 21; r++) {
    for (let col = 0; col < 21; col++) {
      const inFinder = (r < 8 && col < 8) || (r < 8 && col > 12) || (r > 12 && col < 8);
      if (inFinder) continue;
      if (QR_BITS[(r * 3 + col) % 7][(col * 5 + r) % 7] === '1') {
        modules.push(<rect key={`${r}-${col}`} x={x + col * c} y={y + r * c} width={c * 0.92} height={c * 0.92} rx={c * 0.25} fill={color} />);
      }
    }
  }
  return (
    <g>
      <rect x={x - c} y={y - c} width={size + 2 * c} height={size + 2 * c} rx={c * 2} fill="#fff" />
      {modules}
      {finder(0, 0)}
      {finder(14, 0)}
      {finder(0, 14)}
    </g>
  );
};

// Téléphone (cadre + écran)
const Phone: React.FC<{ id: string; x?: number; children: React.ReactNode }> = ({ id, x = 82, children }) => (
  <g>
    <rect x={x - 4} y={14} width={124} height={204} rx={26} fill="#000" opacity="0.35" transform="translate(4 6)" />
    <rect x={x - 4} y={10} width={124} height={204} rx={26} fill="#1B0B0D" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
    <rect x={x + 2} y={16} width={112} height={192} rx={21} fill={`url(#${id}-screen)`} />
    <rect x={x + 43} y={21} width={30} height={7} rx={3.5} fill="#000" opacity="0.6" />
    <defs>
      <linearGradient id={`${id}-screen`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3A0C12" />
        <stop offset="1" stopColor="#1E0709" />
      </linearGradient>
    </defs>
    {children}
  </g>
);

const Svg: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <svg viewBox="0 0 280 228" role="img" aria-label={title} className="w-full h-auto" style={{ fontFamily: FONT }}>
    {children}
  </svg>
);

const Glow: React.FC<{ id: string; cx: number; cy: number; r: number; color: string }> = ({ id, cx, cy, r, color }) => (
  <>
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor={color} stopOpacity="0.55" />
        <stop offset="1" stopColor={color} stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} />
  </>
);

/** 1. Je choisis mes billets */
export const IllustrationChoose: React.FC = () => {
  const id = useId().replace(/:/g, '');
  return (
    <Svg title="Un téléphone affiche le billet à 10 $ et le choix du nombre de places">
      <Glow id={`${id}-g`} cx={140} cy={118} r={120} color="#F2761B" />
      {/* billet papier posé derrière le téléphone */}
      <defs>
        <mask id={`${id}-cut`}>
          <rect x={14} y={66} width={86} height={50} rx={6} fill="#fff" />
          <circle cx={14} cy={91} r={6} fill="#000" />
          <circle cx={100} cy={91} r={6} fill="#000" />
        </mask>
      </defs>
      <g transform="rotate(-12 57 91)">
        <g mask={`url(#${id}-cut)`}>
          <rect x={14} y={66} width={86} height={50} rx={6} fill="#F6EEDC" />
          <rect x={14} y={66} width={86} height={13} fill="#8E1B26" />
          <text x={57} y={75.5} textAnchor="middle" fontSize="6" fontWeight="800" fill="#FFD27A" letterSpacing="1.2">ENTRÉE</text>
          <text x={22} y={97} fontSize="9" fontWeight="800" fill="#3D0A04">GALA</text>
          <text x={22} y={108} fontSize="6" fill="#7A4A2A">12 déc. 2026</text>
          <line x1={74} y1={82} x2={74} y2={113} stroke="#C9B48E" strokeWidth="1" strokeDasharray="1.5 2.5" />
          <text x={88} y={104} textAnchor="middle" fontSize="9" fontWeight="800" fill="#8E1B26">10$</text>
        </g>
      </g>
      <Phone id={id}>
        <text x={140} y={48} textAnchor="middle" fontSize="9" fontWeight="600" fill="rgba(255,255,255,0.6)">Choisis ton billet</text>
        {/* billet principal */}
        <defs>
          <linearGradient id={`${id}-t`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFC25A" />
            <stop offset="1" stopColor="#F2761B" />
          </linearGradient>
        </defs>
        <rect x={94} y={58} width={92} height={62} rx={12} fill={`url(#${id}-t)`} />
        <circle cx={94} cy={89} r={6} fill="#2A0A0D" />
        <circle cx={186} cy={89} r={6} fill="#2A0A0D" />
        <text x={106} y={77} fontSize="7.5" fontWeight="700" fill="#5A1A05" letterSpacing="0.6">SOIRÉE GALA</text>
        <text x={106} y={106} fontSize="24" fontWeight="800" fill="#3D0A04">10 $</text>
        {/* quantité */}
        <rect x={100} y={132} width={80} height={26} rx={13} fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.18)" />
        <circle cx={114} cy={145} r={9} fill="rgba(255,255,255,0.12)" />
        <rect x={110} y={144} width={8} height={2} rx={1} fill="#fff" />
        <text x={140} y={150} textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">2</text>
        <circle cx={166} cy={145} r={9} fill="#FFB43A" />
        <rect x={162} y={144} width={8} height={2} rx={1} fill="#3D0A04" />
        <rect x={165} y={141} width={2} height={8} rx={1} fill="#3D0A04" />
        {/* bouton */}
        <rect x={96} y={172} width={88} height={24} rx={12} fill="#fff" />
        <text x={140} y={188} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#3D0A04">Réserver · 20 $</text>
      </Phone>
      {/* doigt (point de toucher) */}
      <circle cx={176} cy={186} r={11} fill="#fff" opacity="0.18" />
      <circle cx={176} cy={186} r={5} fill="#fff" opacity="0.55" />
    </Svg>
  );
};

/** 2. Je confirme sur WhatsApp et je paie */
export const IllustrationWhatsApp: React.FC = () => {
  const id = useId().replace(/:/g, '');
  return (
    <Svg title="Une conversation WhatsApp : le message de commande et la confirmation du paiement">
      <Glow id={`${id}-g`} cx={140} cy={118} r={120} color="#25D366" />
      <Phone id={id}>
        {/* barre de conversation */}
        <rect x={84} y={16} width={112} height={30} rx={21} fill="#123B2A" />
        <rect x={84} y={30} width={112} height={16} fill="#123B2A" />
        <circle cx={100} cy={36} r={7} fill="#E8C98A" />
        <text x={112} y={35} fontSize="7.5" fontWeight="700" fill="#fff">Équipe du gala</text>
        <text x={112} y={43} fontSize="6" fill="rgba(255,255,255,0.6)">en ligne</text>
        {/* message envoyé (commande) */}
        <rect x={110} y={56} width={80} height={62} rx={10} fill="#0E5C47" />
        <rect x={117} y={63} width={44} height={4} rx={2} fill="rgba(255,255,255,0.75)" />
        <rect x={117} y={71} width={60} height={4} rx={2} fill="rgba(255,255,255,0.45)" />
        <rect x={116} y={81} width={68} height={22} rx={5} fill="rgba(0,0,0,0.3)" />
        <text x={121} y={95} fontSize="7" fontFamily="ui-monospace, monospace" fill="#9AF0C4">CODE·GALA-0147</text>
        <text x={182} y={113} textAnchor="end" fontSize="5.5" fill="rgba(255,255,255,0.55)">14:02 ✓✓</text>
        {/* réponse (paiement reçu) */}
        <rect x={90} y={128} width={84} height={36} rx={10} fill="#2A2F33" />
        <circle cx={102} cy={146} r={7} fill="#25D366" />
        <path d="M98.5 146 l2.4 2.4 l4.6 -4.8" fill="none" stroke="#06331B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <text x={113} y={144} fontSize="7.5" fontWeight="700" fill="#fff">Paiement reçu</text>
        <text x={113} y={154} fontSize="6" fill="rgba(255,255,255,0.6)">Merci, ton lien arrive</text>
        {/* barre de saisie */}
        <rect x={92} y={180} width={74} height={18} rx={9} fill="rgba(255,255,255,0.1)" />
        <circle cx={180} cy={189} r={9} fill="#25D366" />
        <path d="M176.5 189 h7 M181 186 l3 3 l-3 3" fill="none" stroke="#06331B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </Phone>
      {/* jeton Mobile Money */}
      <g transform="translate(212 150)">
        <circle r={22} fill="#FFB43A" />
        <circle r={17} fill="none" stroke="#3D0A04" strokeOpacity="0.35" strokeWidth="1.5" />
        <text y={6} textAnchor="middle" fontSize="16" fontWeight="800" fill="#3D0A04">$</text>
      </g>
    </Svg>
  );
};

/** 3. Je reçois mon lien d'invitations */
export const IllustrationLink: React.FC = () => {
  const id = useId().replace(/:/g, '');
  return (
    <Svg title="Le lien reçu ouvre l'invitation avec son QR code">
      <Glow id={`${id}-g`} cx={140} cy={118} r={120} color="#E8C98A" />
      {/* bulle avec l'aperçu du lien (comme dans WhatsApp) */}
      <g>
        <rect x={16} y={38} width={120} height={60} rx={12} fill="#0E5C47" />
        <path d="M30 98 l-5 10 l14 -10 z" fill="#0E5C47" />
        <rect x={22} y={44} width={108} height={30} rx={8} fill="rgba(0,0,0,0.25)" />
        <rect x={28} y={50} width={18} height={18} rx={5} fill="#E8C98A" />
        <Link2 x={31} y={53} width={12} height={12} color="#3D0A04" strokeWidth={2.4} />
        <text x={52} y={58} fontSize="7.5" fontWeight="700" fill="#fff">Tes invitations</text>
        <text x={52} y={67} fontSize="6" fill="rgba(255,255,255,0.6)">Soirée gala · 2 billets</text>
        <text x={24} y={88} fontSize="6.5" fill="#7DD3FC" textDecoration="underline">galaempire.cd/billet…</text>
      </g>
      {/* flèche */}
      <path d="M128 112 C150 112 150 132 168 134" fill="none" stroke="#E8C98A" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
      <path d="M163 129 l6 5 l-7 3" fill="none" stroke="#E8C98A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* invitation */}
      <g transform="rotate(6 205 150)">
        <rect x={150} y={96} width={112} height={112} rx={16} fill="#000" opacity="0.3" transform="translate(3 5)" />
        <rect x={150} y={96} width={112} height={112} rx={16} fill="#fff" />
        <rect x={150} y={96} width={112} height={30} rx={16} fill="#8E1B26" />
        <rect x={150} y={110} width={112} height={16} fill="#8E1B26" />
        <text x={206} y={115} textAnchor="middle" fontSize="8" fontWeight="800" fill="#FFD27A" letterSpacing="0.8">INVITATION</text>
        <QrGlyph x={180} y={134} size={52} />
      </g>
      {/* cadenas ouvert */}
      <g transform="translate(244 92)">
        <circle r={17} fill="#FFB43A" />
        <path d="M-6 -2 v-5 a6 6 0 0 1 11.5 -2" fill="none" stroke="#3D0A04" strokeWidth="2.2" strokeLinecap="round" />
        <rect x={-8} y={-2} width={16} height={12} rx={3} fill="#3D0A04" />
      </g>
    </Svg>
  );
};

/** 4. Je présente mon QR code à l'entrée */
export const IllustrationDoor: React.FC = () => {
  const id = useId().replace(/:/g, '');
  return (
    <Svg title="À l'entrée, le QR code de l'invitation est scanné et l'accès est validé">
      <Glow id={`${id}-g`} cx={140} cy={118} r={120} color="#34D399" />
      {/* invitation tendue */}
      <g transform="rotate(-8 70 130)">
        <rect x={20} y={70} width={96} height={118} rx={14} fill="#000" opacity="0.3" transform="translate(3 5)" />
        <rect x={20} y={70} width={96} height={118} rx={14} fill="#fff" />
        <rect x={20} y={70} width={96} height={26} rx={14} fill="#8E1B26" />
        <rect x={20} y={82} width={96} height={14} fill="#8E1B26" />
        <text x={68} y={87} textAnchor="middle" fontSize="7" fontWeight="800" fill="#FFD27A" letterSpacing="0.8">INVITATION</text>
        <QrGlyph x={40} y={106} size={56} />
        <text x={68} y={180} textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#5A1A05">TKT-0147-01</text>
      </g>
      {/* téléphone du contrôleur */}
      <Phone id={id} x={142}>
        <rect x={150} y={46} width={96} height={96} rx={14} fill="#0A0A0A" />
        {/* coins de visée */}
        <g stroke="#34D399" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M162 66 v-8 h8" />
          <path d="M234 66 v-8 h-8" />
          <path d="M162 122 v8 h8" />
          <path d="M234 122 v8 h-8" />
        </g>
        <QrGlyph x={176} y={72} size={44} color="#1a1a1a" />
        <rect x={162} y={92} width={72} height={2} rx={1} fill="#34D399" opacity="0.9" className="help-scanline" />
        {/* résultat */}
        <rect x={150} y={152} width={96} height={44} rx={12} fill="#065F46" />
        <circle cx={168} cy={174} r={9} fill="#34D399" />
        <path d="M163.5 174 l3 3 l5.5 -6" fill="none" stroke="#053527" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x={182} y={171} fontSize="8" fontWeight="800" fill="#fff">Bienvenue</text>
        <text x={182} y={182} fontSize="6" fill="rgba(255,255,255,0.7)">Billet valide</text>
      </Phone>
    </Svg>
  );
};

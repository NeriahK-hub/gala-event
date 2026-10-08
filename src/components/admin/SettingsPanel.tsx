import React, { useRef, useState } from 'react';
import { Download, KeyRound, Lock, Upload } from 'lucide-react';
import { useContent } from '../../content/ContentContext';
import { Order } from '../../types';
import { checkAdminCode, setAdminCode } from '../../lib/adminLock';

const panel = 'rounded-2xl border border-white/10 bg-white/[0.03]';

export const SECTION_TOGGLES: { id: string; label: string; hint?: string }[] = [
  { id: 'countdown', label: 'Compte à rebours' },
  { id: 'about', label: 'Le gala' },
  { id: 'programme', label: 'Programme' },
  { id: 'invites', label: 'Invités & artistes', hint: 'Visible seulement si tu as ajouté des invités' },
  { id: 'billets', label: 'Billets' },
  { id: 'dresscode', label: 'Dress code' },
  { id: 'galerie', label: 'Galerie', hint: 'Visible seulement si tu as ajouté des photos' },
  { id: 'lieu', label: 'Le lieu' },
  { id: 'sponsors', label: 'Partenaires' },
  { id: 'faq', label: 'Questions fréquentes' },
  { id: 'contact', label: 'Équipe & contact' },
];

const Switch: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string }> = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative shrink-0 w-12 h-7 rounded-full transition-colors cursor-pointer ${checked ? 'bg-emerald-500' : 'bg-white/20'}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : ''}`} />
  </button>
);

const Row: React.FC<{ title: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }> = ({ title, hint, checked, onChange }) => (
  <div className="flex items-center gap-4 py-3.5">
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-[#F9F5EC]">{title}</p>
      {hint && <p className="text-xs text-stone-400 mt-0.5">{hint}</p>}
    </div>
    <span className={`text-xs font-semibold w-14 text-right ${checked ? 'text-emerald-300' : 'text-stone-500'}`}>{checked ? 'Activé' : 'Désactivé'}</span>
    <Switch checked={checked} onChange={onChange} label={title} />
  </div>
);

interface SettingsPanelProps {
  orders: Order[];
  onImportOrders: (orders: Order[]) => void;
  onLock: () => void;
  notify: (message: string) => void;
}

const field =
  'w-full px-3.5 py-3 rounded-lg border border-white/15 bg-black/30 text-sm text-[#F9F5EC] focus:border-[#E8C98A] focus:outline-none focus:ring-2 focus:ring-[#E8C98A]/20';

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ orders, onImportOrders, onLock, notify }) => {
  const { content, setContent } = useContent();
  const { salesOpen, hiddenSections } = content.settings;
  const fileRef = useRef<HTMLInputElement>(null);

  const [oldCode, setOldCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const [codeError, setCodeError] = useState('');

  const setSettings = (patch: Partial<typeof content.settings>) =>
    setContent((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));

  const toggleSection = (id: string, visible: boolean) =>
    setSettings({ hiddenSections: visible ? hiddenSections.filter((s) => s !== id) : [...new Set([...hiddenSections, id])] });

  const changeCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkAdminCode(oldCode)) return setCodeError('Le code actuel est incorrect.');
    if (newCode.length < 4) return setCodeError('Le nouveau code doit faire au moins 4 caractères.');
    setAdminCode(newCode);
    setOldCode('');
    setNewCode('');
    setCodeError('');
    notify('Code d\'accès modifié');
  };

  const exportBackup = () => {
    const blob = new Blob([JSON.stringify({ app: 'gala-empire', version: 1, exportedAt: new Date().toISOString(), orders }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sauvegarde-commandes-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('Sauvegarde téléchargée');
  };

  const importBackup = async (file: File | undefined) => {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const list: Order[] = Array.isArray(data) ? data : data?.orders;
      if (!Array.isArray(list) || list.some((o) => !o || typeof o.id !== 'string' || !Array.isArray(o.tickets))) throw new Error('format');
      onImportOrders(list);
      notify(`${list.length} commande${list.length > 1 ? 's' : ''} importée${list.length > 1 ? 's' : ''}`);
    } catch {
      notify('Fichier non reconnu : choisis une sauvegarde exportée ici');
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <section className={`${panel} p-5 sm:p-6`}>
        <h2 className="font-semibold text-[#F3E5AB] mb-1">Billetterie</h2>
        <p className="text-sm text-stone-400 mb-2">Ferme les ventes quand c'est complet ou terminé : les clients voient un message à la place du formulaire.</p>
        <div className="divide-y divide-white/10">
          <Row
            title="Ventes ouvertes"
            hint={salesOpen ? 'Les clients peuvent commander.' : 'Les commandes sont bloquées. Le texte du message se modifie dans « Contenu du site » → Billets.'}
            checked={salesOpen}
            onChange={(v) => setSettings({ salesOpen: v })}
          />
        </div>
      </section>

      <section className={`${panel} p-5 sm:p-6`}>
        <h2 className="font-semibold text-[#F3E5AB] mb-1">Sections du site</h2>
        <p className="text-sm text-stone-400 mb-2">Désactive une section pour la cacher de la page d'accueil et du menu. Rien n'est supprimé : tu peux la réactiver à tout moment.</p>
        <div className="divide-y divide-white/10">
          {SECTION_TOGGLES.map((s) => (
            <Row key={s.id} title={s.label} hint={s.hint} checked={!hiddenSections.includes(s.id)} onChange={(v) => toggleSection(s.id, v)} />
          ))}
        </div>
      </section>

      <section className={`${panel} p-5 sm:p-6`}>
        <h2 className="font-semibold text-[#F3E5AB] mb-1">Sauvegarde des commandes</h2>
        <p className="text-sm text-stone-400 mb-4">
          Les commandes sont enregistrées uniquement dans ce navigateur. Télécharge une sauvegarde régulièrement, et importe-la pour retrouver tes commandes sur un autre appareil.
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportBackup} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-b from-[#FFB43A] to-[#F2761B] text-[#3D0A04] text-sm font-bold hover:brightness-110 cursor-pointer">
            <Download className="w-4 h-4" /> Télécharger la sauvegarde
          </button>
          <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 text-sm text-stone-100 hover:bg-white/10 cursor-pointer">
            <Upload className="w-4 h-4" /> Importer une sauvegarde
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => importBackup(e.target.files?.[0])} />
        </div>
      </section>

      <section className={`${panel} p-5 sm:p-6`}>
        <h2 className="font-semibold text-[#F3E5AB] mb-1 flex items-center gap-2">
          <KeyRound className="w-4 h-4" /> Code d'accès
        </h2>
        <p className="text-sm text-stone-400 mb-4">Ce code protège la console sur cet appareil.</p>
        <form onSubmit={changeCode} className="grid sm:grid-cols-2 gap-3">
          <input type="password" autoComplete="current-password" value={oldCode} onChange={(e) => { setOldCode(e.target.value); setCodeError(''); }} placeholder="Code actuel" aria-label="Code actuel" className={field} />
          <input type="password" autoComplete="new-password" value={newCode} onChange={(e) => { setNewCode(e.target.value); setCodeError(''); }} placeholder="Nouveau code" aria-label="Nouveau code" className={field} />
          {codeError && <p role="alert" className="sm:col-span-2 text-sm text-red-300">{codeError}</p>}
          <div className="sm:col-span-2 flex flex-wrap gap-2">
            <button type="submit" className="px-4 py-2.5 rounded-lg border border-white/20 text-sm text-stone-100 hover:bg-white/10 cursor-pointer">Changer le code</button>
            <button type="button" onClick={onLock} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-stone-300 hover:bg-white/10 cursor-pointer">
              <Lock className="w-4 h-4" /> Verrouiller maintenant
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

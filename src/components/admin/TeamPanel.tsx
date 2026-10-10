import React, { useState } from 'react';
import { Check, Copy, History, KeyRound, Link2, Plus, ScanLine, ShieldCheck, Trash2, UserPlus, Users } from 'lucide-react';
import { AdminAccount, AdminPermission, AdminRole } from '../../types';
import { ALL_PERMISSIONS, ROLE_LABELS, useTeam } from '../../team/TeamContext';
import { copyText } from '../../lib/clipboard';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { useAdminAuth } from './AdminAuth';
import { Modal } from './Modal';

const panel = 'rounded-2xl border border-white/[0.07] bg-white/[0.025]';
const field =
  'w-full px-3.5 py-3 rounded-lg border border-white/10 bg-black/20 text-sm text-stone-100 placeholder-stone-500 focus:border-[#E6C78A]/60 focus:outline-none focus:ring-2 focus:ring-[#E6C78A]/10';
const btn = 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm cursor-pointer';
const primary = `${btn} bg-[#E6C78A] text-[#2B1B0A] font-bold hover:bg-[#EFD6A2]`;
const ghost = `${btn} border border-white/20 text-stone-100 hover:bg-white/10`;

const ROLE_BADGE: Record<AdminRole, string> = {
  super: 'bg-violet-500/15 text-violet-200 border-violet-400/30',
  owner: 'bg-[#E6C78A]/10 text-stone-100 border-[#E8C98A]/30',
  admin: 'bg-white/10 text-stone-200 border-white/10',
};

const scanUrl = (token: string) => `${window.location.origin}${window.location.pathname}?scan=${token}`;

export const TeamPanel: React.FC<{ notify: (message: string) => void }> = ({ notify }) => {
  const team = useTeam();
  const { accounts, scanLinks, activity, current } = team;
  const { authorize } = useAdminAuth();
  const isSuper = current?.role === 'super';
  const hasOwner = accounts.some((a) => a.role === 'owner');

  const [creating, setCreating] = useState<AdminRole | null>(null);
  const [editingCode, setEditingCode] = useState<AdminAccount | null>(null);
  const [linkLabel, setLinkLabel] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // L'admin n°1 gère ses admins ; le super admin gère tout le monde sauf lui-même (son code se change via « Mon code »)
  const canManage = (a: AdminAccount) => a.id !== current?.id && (isSuper ? a.role !== 'super' : a.role === 'admin');

  const togglePermission = (a: AdminAccount, perm: AdminPermission) =>
    team.updateAccount(a.id, {
      permissions: a.permissions.includes(perm) ? a.permissions.filter((p) => p !== perm) : [...a.permissions, perm],
    });

  const removeAccount = async (a: AdminAccount) => {
    if (!confirm(`Supprimer le compte de ${a.name} ? Il ne pourra plus ouvrir la console.`)) return;
    if (!(await authorize(`le compte de ${a.name}`))) return;
    team.deleteAccount(a.id);
    notify(`Compte de ${a.name} supprimé`);
  };

  const addLink = (e: React.FormEvent) => {
    e.preventDefault();
    const link = team.createScanLink(linkLabel);
    setLinkLabel('');
    notify(`Lien « ${link.label} » créé`);
  };

  const copyLink = async (id: string, token: string) => {
    if (await copyText(scanUrl(token))) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } else notify('Copie impossible : sélectionne le lien et copie-le à la main');
  };

  const shareLink = (label: string, token: string) =>
    `https://wa.me/?text=${encodeURIComponent(
      `Bonjour ${label},\n\nVoici ton lien pour contrôler les entrées du gala. Ouvre-le sur ton téléphone le jour J, autorise la caméra et scanne le QR code de chaque invitation :\n\n${scanUrl(token)}\n\n_Ne partage pas ce lien._`
    )}`;

  const removeLink = async (id: string, label: string) => {
    if (!confirm(`Supprimer le lien « ${label} » ? Il ne fonctionnera plus.`)) return;
    if (!(await authorize(`le lien « ${label} »`))) return;
    team.deleteScanLink(id);
    notify('Lien supprimé');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* ===== Comptes ===== */}
      <section className={`${panel} p-5 sm:p-6`}>
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="font-semibold text-stone-100 flex items-center gap-2">
              <Users className="w-4 h-4" /> Comptes de la console
            </h2>
            <p className="text-sm text-stone-400 mt-1">
              Chaque personne a son propre code. L'admin n°1 crée les admins de son équipe et choisit ce qu'ils peuvent faire. Pour supprimer quoi que ce soit, un admin doit avoir l'accord de l'admin n°1.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isSuper && !hasOwner && (
              <button onClick={() => setCreating('owner')} className={primary}>
                <ShieldCheck className="w-4 h-4" /> Créer l'admin n°1
              </button>
            )}
            <button onClick={() => setCreating('admin')} className={hasOwner || !isSuper ? primary : ghost}>
              <UserPlus className="w-4 h-4" /> Ajouter un admin
            </button>
          </div>
        </div>

        <ul className="divide-y divide-white/10">
          {accounts.map((a) => (
            <li key={a.id} className="py-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <p className={`font-semibold ${a.active ? 'text-stone-100' : 'text-stone-500 line-through'}`}>{a.name}</p>
                <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold ${ROLE_BADGE[a.role]}`}>{ROLE_LABELS[a.role]}</span>
                {a.id === current?.id && <span className="text-xs text-emerald-300">C'est toi</span>}
                {!a.active && <span className="text-xs text-red-300">Suspendu</span>}
                <div className="ml-auto flex flex-wrap items-center gap-1.5">
                  {(a.id === current?.id || canManage(a)) && (
                    <button onClick={() => setEditingCode(a)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-stone-200 hover:bg-white/10 cursor-pointer">
                      <KeyRound className="w-3.5 h-3.5" /> {a.id === current?.id ? 'Mon code' : 'Changer le code'}
                    </button>
                  )}
                  {canManage(a) && (
                    <>
                      <button
                        onClick={() => team.updateAccount(a.id, { active: !a.active })}
                        className="px-3 py-2 rounded-lg text-xs text-stone-200 hover:bg-white/10 cursor-pointer"
                      >
                        {a.active ? 'Suspendre' : 'Réactiver'}
                      </button>
                      <button
                        onClick={() => removeAccount(a)}
                        aria-label={`Supprimer le compte de ${a.name}`}
                        className="p-2 rounded-lg text-stone-500 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {a.role === 'admin' ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {ALL_PERMISSIONS.map((p) => {
                    const on = a.permissions.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        disabled={!canManage(a)}
                        title={p.hint}
                        aria-pressed={on}
                        onClick={() => togglePermission(a, p.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-colors disabled:cursor-default cursor-pointer ${
                          on ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200' : 'border-white/10 text-stone-500 hover:text-stone-300'
                        }`}
                      >
                        {on && <Check className="w-3.5 h-3.5" />}
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-1.5 text-xs text-stone-400">{a.role === 'super' ? 'Accès complet, maintenance et dépannage.' : 'Accès complet, donne les accès à l\'équipe.'}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* ===== Liens de scan ===== */}
      <section className={`${panel} p-5 sm:p-6`}>
        <h2 className="font-semibold text-stone-100 flex items-center gap-2">
          <ScanLine className="w-4 h-4" /> Liens de contrôle d'entrée
        </h2>
        <p className="text-sm text-stone-400 mt-1 mb-4">
          Crée un lien par personne à l'entrée. Le lien ouvre seulement le scanner : la personne ne voit ni les commandes, ni l'argent, ni les réglages. Tu peux le couper à tout moment.
        </p>

        <form onSubmit={addLink} className="flex flex-col sm:flex-row gap-3 mb-5">
          <input value={linkLabel} onChange={(e) => setLinkLabel(e.target.value)} placeholder="Nom ou poste (ex. Porte A – Jean)" aria-label="Nom du lien" className={field} />
          <button type="submit" className={`${primary} shrink-0`}>
            <Plus className="w-4 h-4" /> Créer le lien
          </button>
        </form>

        {scanLinks.length === 0 ? (
          <p className="text-sm text-stone-500 text-center py-4">Aucun lien pour le moment.</p>
        ) : (
          <ul className="space-y-3">
            {scanLinks.map((l) => (
              <li key={l.id} className="rounded-xl bg-black/25 p-4">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Link2 className="w-4 h-4 text-[#E6C78A]" />
                  <p className={`font-semibold ${l.active ? 'text-stone-100' : 'text-stone-500 line-through'}`}>{l.label}</p>
                  <span className="text-xs text-stone-400">
                    {l.scanCount} entrée{l.scanCount > 1 ? 's' : ''}
                    {l.lastUsedAt ? ` · dernier scan ${l.lastUsedAt}` : ''}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => copyLink(l.id, l.token)} className={ghost}>
                    {copiedId === l.id ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    {copiedId === l.id ? 'Copié' : 'Copier le lien'}
                  </button>
                  <a href={shareLink(l.label, l.token)} target="_blank" rel="noopener noreferrer" className={`${btn} bg-[#25D366]/15 text-[#4ade80] font-semibold hover:bg-[#25D366]/25`}>
                    <WhatsAppIcon className="w-4 h-4" /> Envoyer
                  </a>
                  <button onClick={() => team.updateScanLink(l.id, { active: !l.active })} className={`${btn} text-stone-200 hover:bg-white/10`}>
                    {l.active ? 'Désactiver' : 'Réactiver'}
                  </button>
                  <button
                    onClick={() => removeLink(l.id, l.label)}
                    aria-label={`Supprimer le lien ${l.label}`}
                    className="p-2.5 rounded-lg text-stone-500 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-xs text-stone-500">
          Tant que la base de données n'est pas branchée, un lien de scan ne fonctionne que sur l'appareil où se trouve la console (là où sont les commandes).
        </p>
      </section>

      {/* ===== Historique ===== */}
      <section className={`${panel} p-5 sm:p-6`}>
        <h2 className="font-semibold text-stone-100 flex items-center gap-2 mb-4">
          <History className="w-4 h-4" /> Historique des actions
        </h2>
        {activity.length === 0 ? (
          <p className="text-sm text-stone-500">Rien pour le moment.</p>
        ) : (
          <ul className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {activity.slice(0, 100).map((e) => (
              <li key={e.id} className="flex gap-3 text-sm">
                <span className="shrink-0 w-32 text-xs text-stone-500 tabular-nums pt-0.5">{e.at}</span>
                <p className="text-stone-300">
                  <strong className="text-stone-100 font-semibold">{e.actor}</strong> {e.action.charAt(0).toLowerCase() + e.action.slice(1)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {creating && <CreateAccountModal role={creating} onClose={() => setCreating(null)} notify={notify} />}
      {editingCode && <CodeModal account={editingCode} onClose={() => setEditingCode(null)} notify={notify} />}
    </div>
  );
};

const CreateAccountModal: React.FC<{ role: AdminRole; onClose: () => void; notify: (m: string) => void }> = ({ role, onClose, notify }) => {
  const { createAccount } = useTeam();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [perms, setPerms] = useState<AdminPermission[]>(['orders', 'scanner']);
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = createAccount({ name, code, role, permissions: perms });
    if (!res.ok) return setError(res.error);
    notify(`Compte de ${name.trim()} créé : donne-lui son code`);
    onClose();
  };

  return (
    <Modal onClose={onClose} title={role === 'owner' ? 'Créer l\'admin n°1' : 'Ajouter un admin'} kicker="Nouveau compte">
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="block text-xs font-semibold text-[#E6C78A] mb-1.5">Nom</span>
          <input autoFocus value={name} onChange={(e) => { setName(e.target.value); setError(''); }} placeholder="Ex. Christelle" className={field} />
        </label>
        <label className="block">
          <span className="block text-xs font-semibold text-[#E6C78A] mb-1.5">Code d'accès (à lui transmettre)</span>
          <input value={code} onChange={(e) => { setCode(e.target.value); setError(''); }} placeholder="Au moins 4 caractères" autoComplete="off" className={`${field} font-mono`} />
        </label>
        {role === 'admin' ? (
          <fieldset>
            <legend className="text-xs font-semibold text-[#E6C78A] mb-2">Ce qu'il peut faire</legend>
            <div className="space-y-2">
              {ALL_PERMISSIONS.map((p) => (
                <label key={p.id} className="flex items-start gap-3 rounded-lg bg-black/25 p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={perms.includes(p.id)}
                    onChange={() => setPerms((cur) => (cur.includes(p.id) ? cur.filter((x) => x !== p.id) : [...cur, p.id]))}
                    className="mt-0.5 w-4 h-4 accent-[#E6C78A]"
                  />
                  <span>
                    <span className="block text-sm text-stone-100">{p.label}</span>
                    <span className="block text-xs text-stone-400">{p.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : (
          <p className="text-sm text-stone-300">L'admin n°1 a accès à tout et donne les accès à son équipe.</p>
        )}
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        <button type="submit" className={`${primary} w-full py-3.5 rounded-full`}>
          Créer le compte
        </button>
      </form>
    </Modal>
  );
};

const CodeModal: React.FC<{ account: AdminAccount; onClose: () => void; notify: (m: string) => void }> = ({ account, onClose, notify }) => {
  const { resetCode, current } = useTeam();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const self = account.id === current?.id;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = resetCode(account.id, code);
    if (!res.ok) return setError(res.error);
    notify(self ? 'Ton code a été changé' : `Nouveau code enregistré pour ${account.name}`);
    onClose();
  };

  return (
    <Modal onClose={onClose} title={self ? 'Changer mon code' : `Code de ${account.name}`} kicker="Code d'accès">
      <form onSubmit={submit} className="space-y-4">
        {!self && <p className="text-sm text-stone-300">Utile si {account.name} a oublié son code : choisis-en un nouveau et transmets-le-lui.</p>}
        <input autoFocus value={code} onChange={(e) => { setCode(e.target.value); setError(''); }} placeholder="Nouveau code" autoComplete="off" className={`${field} font-mono`} />
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        <button type="submit" className={`${primary} w-full py-3.5 rounded-full`}>
          Enregistrer
        </button>
      </form>
    </Modal>
  );
};

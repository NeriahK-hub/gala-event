import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Clock, Lightbulb, Search } from 'lucide-react';
import { useTeam } from '../../team/TeamContext';
import { CHECKLISTS, HelpCategory, HelpTab, Tutorial, TUTORIALS } from '../help/tutorials';
import { panel } from './ui';

const CATEGORIES: ('Tout' | HelpCategory)[] = ['Tout', 'Commandes', 'Entrée', 'Site', 'Équipe', 'Mon compte'];

// [[Texte]] → pastille qui ressemble à un bouton de l'interface
const RichText: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split(/\[\[(.+?)\]\]/g).map((part, i) =>
      i % 2 ? (
        <span key={i} className="inline-flex items-center mx-0.5 px-2 py-0.5 rounded-md border border-white/15 bg-white/[0.06] text-[0.92em] font-semibold text-stone-100 whitespace-nowrap">
          {part}
        </span>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      )
    )}
  </>
);

const plain = (s: string) => s.replace(/\[\[|\]\]/g, '');

export const HelpPanel: React.FC<{ onGo: (tab: HelpTab) => void }> = ({ onGo }) => {
  const { current, can, isManager } = useTeam();
  const allowed = (perm?: Tutorial['perm']) => !perm || (perm === 'manager' ? isManager : can(perm));
  const tutorials = useMemo(() => TUTORIALS.filter((t) => allowed(t.perm)), [current]); // eslint-disable-line react-hooks/exhaustive-deps

  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('Tout');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const list = tutorials.filter(
    (t) =>
      (category === 'Tout' || t.category === category) &&
      (!q || `${t.title} ${t.summary} ${t.steps.map(plain).join(' ')}`.toLowerCase().includes(q))
  );
  const categories = CATEGORIES.filter((c) => c === 'Tout' || tutorials.some((t) => t.category === c));
  const open = tutorials.find((t) => t.id === openId) ?? null;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [openId]);

  if (open) {
    const idx = tutorials.indexOf(open);
    const next = tutorials[(idx + 1) % tutorials.length];
    return <TutorialView tutorial={open} next={next !== open ? next : null} onBack={() => setOpenId(null)} onOpen={setOpenId} onGo={onGo} />;
  }

  return (
    <div className="space-y-8 max-w-6xl">
      {/* En-tête + recherche */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[#2B1E18] via-[#1E1714] to-[#18120F] p-6 sm:p-8">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 w-72 h-72 rounded-full bg-[#E6C78A]/[0.07] blur-3xl" />
        <p className="text-sm text-[#E6C78A]">Aide & tutos</p>
        <h2 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-stone-50">
          Que veux-tu faire{current ? `, ${current.name.split(' ')[0]}` : ''} ?
        </h2>
        <p className="mt-1.5 text-sm text-stone-400 max-w-xl">
          Des fiches courtes, étape par étape. Tu ne vois que celles qui concernent ce que tu as le droit de faire.
        </p>
        <div className="relative mt-5 max-w-lg">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex. valider, scanner, code oublié, sauvegarde…"
            aria-label="Rechercher un tuto"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-black/25 text-sm text-stone-100 placeholder-stone-500 focus:border-[#E6C78A]/60 focus:outline-none focus:ring-2 focus:ring-[#E6C78A]/10"
          />
        </div>
      </section>

      {/* Catégories */}
      <div className="flex gap-1.5 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none]" role="tablist" aria-label="Catégories de tutos">
        {categories.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={category === c}
            onClick={() => setCategory(c)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm transition-colors cursor-pointer ${
              category === c ? 'bg-[#E6C78A] text-[#2B1B0A] font-semibold' : 'bg-white/[0.04] text-stone-300 hover:bg-white/[0.08]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Fiches */}
      {list.length === 0 ? (
        <p className={`${panel} p-10 text-center text-sm text-stone-400`}>Aucun tuto ne correspond à ta recherche.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => setOpenId(t.id)}
                className={`${panel} group w-full h-full text-left overflow-hidden flex flex-col hover:border-white/15 hover:bg-white/[0.04] transition-colors cursor-pointer`}
              >
                <div className="bg-black/20 px-4 pt-3 transition-transform duration-500 group-hover:scale-[1.02]">
                  <t.Art />
                </div>
                <div className="flex-1 flex flex-col p-5">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-stone-300">{t.category}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {t.minutes} min
                    </span>
                  </div>
                  <h3 className="mt-2.5 text-base font-semibold text-stone-50 leading-snug">{t.title}</h3>
                  <p className="mt-1 text-sm text-stone-400 leading-relaxed flex-1">{t.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#E6C78A]">
                    Voir le tuto <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Checklists />
    </div>
  );
};

const TutorialView: React.FC<{
  tutorial: Tutorial;
  next: Tutorial | null;
  onBack: () => void;
  onOpen: (id: string) => void;
  onGo: (tab: HelpTab) => void;
}> = ({ tutorial: t, next, onBack, onOpen, onGo }) => (
  <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-5xl">
    <button onClick={onBack} className="mb-5 inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-100 cursor-pointer">
      <ArrowLeft className="w-4 h-4" /> Tous les tutos
    </button>

    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-6 lg:gap-8 items-start">
      <div className="lg:sticky lg:top-24 space-y-4">
        <div className={`${panel} overflow-hidden`}>
          <div className="bg-black/20 px-4 pt-3">
            <t.Art />
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-stone-300">{t.category}</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {t.minutes} min
              </span>
            </div>
            <h2 className="mt-2.5 text-xl sm:text-2xl font-semibold tracking-tight text-stone-50 leading-snug">{t.title}</h2>
            <p className="mt-1.5 text-sm text-stone-400 leading-relaxed">{t.summary}</p>
            {t.goto && (
              <button
                onClick={() => onGo(t.goto!.tab)}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#E6C78A] text-[#2B1B0A] text-sm font-bold hover:bg-[#EFD6A2] cursor-pointer"
              >
                {t.goto.label} <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <ol className={`${panel} p-5 sm:p-6 space-y-5`}>
          {t.steps.map((s, i) => (
            <li key={i} className="flex gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-[#E6C78A]/12 border border-[#E6C78A]/30 text-[#E6C78A] text-sm font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="pt-1 text-[15px] text-stone-200 leading-relaxed">
                <RichText text={s} />
              </p>
            </li>
          ))}
        </ol>

        {t.warning && (
          <div className="flex gap-3 rounded-2xl border border-amber-400/25 bg-amber-500/[0.07] p-4 text-sm text-amber-100/90 leading-relaxed">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-300" />
            <p>
              <strong className="text-amber-200">Attention : </strong>
              <RichText text={t.warning} />
            </p>
          </div>
        )}
        {t.tip && (
          <div className="flex gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.06] p-4 text-sm text-emerald-50/90 leading-relaxed">
            <Lightbulb className="w-5 h-5 shrink-0 text-emerald-300" />
            <p>
              <strong className="text-emerald-200">Astuce : </strong>
              <RichText text={t.tip} />
            </p>
          </div>
        )}

        {next && (
          <button
            onClick={() => onOpen(next.id)}
            className={`${panel} w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.04] cursor-pointer`}
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs text-stone-500">Tuto suivant</p>
              <p className="text-sm font-semibold text-stone-100 truncate">{next.title}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-[#E6C78A] shrink-0" />
          </button>
        )}
      </div>
    </div>
  </motion.div>
);

// Listes à cocher pour préparer l'événement (enregistrées sur cet appareil, par compte)
const Checklists: React.FC = () => {
  const { current, can, isManager } = useTeam();
  const key = `gala-help-checklist-v1-${current?.id ?? 'anon'}`;
  const [done, setDone] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(key) ?? '[]');
    } catch {
      return [];
    }
  });
  const [groupId, setGroupId] = useState(CHECKLISTS[0].id);

  const toggle = (id: string) =>
    setDone((cur) => {
      const nextList = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      try {
        localStorage.setItem(key, JSON.stringify(nextList));
      } catch {
        // ignore
      }
      return nextList;
    });

  const allowed = (perm?: string) => !perm || (perm === 'manager' ? isManager : can(perm as never));
  const groups = CHECKLISTS.map((g) => ({ ...g, items: g.items.filter((i) => allowed(i.perm)) })).filter((g) => g.items.length);
  const group = groups.find((g) => g.id === groupId) ?? groups[0];
  if (!group) return null;

  return (
    <section className={`${panel} p-5 sm:p-6`}>
      <h2 className="text-lg font-semibold text-stone-50">Prépare le jour J</h2>
      <p className="text-sm text-stone-400 mt-1 mb-5">Coche au fur et à mesure. Tes coches restent enregistrées sur cet appareil.</p>

      <div className="grid grid-cols-3 gap-2 mb-5">
        {groups.map((g) => {
          const n = g.items.filter((i) => done.includes(`${g.id}.${i.id}`)).length;
          const pct = Math.round((n / g.items.length) * 100);
          const active = g.id === group.id;
          return (
            <button
              key={g.id}
              onClick={() => setGroupId(g.id)}
              aria-pressed={active}
              className={`text-left rounded-xl p-3 sm:p-4 border transition-colors cursor-pointer ${
                active ? 'border-[#E6C78A]/40 bg-[#E6C78A]/[0.07]' : 'border-white/[0.07] bg-black/20 hover:bg-white/[0.04]'
              }`}
            >
              <p className={`text-sm font-semibold ${active ? 'text-stone-50' : 'text-stone-300'}`}>{g.title}</p>
              <p className="hidden sm:block text-xs text-stone-500">{g.hint}</p>
              <div className="mt-2.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-400/80 transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-1.5 text-[11px] text-stone-500 tabular-nums">
                {n} / {g.items.length}
              </p>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.ul key={group.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-2">
          {group.items.map((item) => {
            const id = `${group.id}.${item.id}`;
            const on = done.includes(id);
            return (
              <li key={id}>
                <button
                  onClick={() => toggle(id)}
                  aria-pressed={on}
                  className="w-full flex items-center gap-3 rounded-xl bg-black/20 px-4 py-3 text-left hover:bg-white/[0.04] cursor-pointer"
                >
                  <span
                    className={`shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                      on ? 'bg-emerald-500/80 border-emerald-400/60' : 'border-white/20'
                    }`}
                  >
                    {on && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                  </span>
                  <span className={`text-sm ${on ? 'text-stone-500 line-through' : 'text-stone-200'}`}>{item.text}</span>
                </button>
              </li>
            );
          })}
        </motion.ul>
      </AnimatePresence>
    </section>
  );
};

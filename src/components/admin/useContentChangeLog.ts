import { useEffect, useRef } from 'react';
import { SiteContent } from '../../types';
import { useContent } from '../../content/ContentContext';
import { TEXT_FIELDS, TEXT_SECTIONS } from '../../content/textSchema';
import { useTeam } from '../../team/TeamContext';

// Historique détaillé des modifications du contenu du site.
// Les changements sont regroupés : une ligne d'historique après 3 secondes sans nouvelle frappe.

const LIST_LABELS: Record<string, string> = {
  tiers: 'Billets',
  program: 'Programme',
  guests: 'Invités & artistes',
  gallery: 'Galerie',
  faq: 'Questions fréquentes',
  sponsors: 'Partenaires',
};

const GALA_LABELS: Record<string, string> = {
  name: 'Nom du gala',
  edition: 'Édition',
  theme: 'Thème',
  slogan: 'Slogan',
  dateText: 'Date affichée',
  timeText: 'Horaires affichés',
  isoDate: 'Date de l\'événement',
  city: 'Ville',
  venueName: 'Nom du lieu',
  venueRoom: 'Salle',
  venueAddress: 'Adresse',
  whatsappNumber: 'Numéro WhatsApp des commandes',
  organizersName: 'Nom de l\'organisateur',
  organizersBio: 'Présentation de l\'organisateur',
};

const short = (v: unknown): string => {
  if (typeof v !== 'string') return JSON.stringify(v ?? '').slice(0, 60);
  if (v.startsWith('data:image')) return '(image)';
  const t = v.replace(/\s+/g, ' ').trim();
  return t.length > 60 ? `« ${t.slice(0, 57)}… »` : `« ${t} »`;
};

const itemName = (item: Record<string, unknown>) =>
  String(item.name ?? item.title ?? item.question ?? item.label ?? item.id ?? 'élément');

export const diffContent = (before: SiteContent, after: SiteContent): string[] => {
  const out: string[] = [];

  // Textes
  for (const f of TEXT_FIELDS) {
    if ((before.texts[f.key] ?? '') !== (after.texts[f.key] ?? '')) {
      const section = TEXT_SECTIONS.find((s) => s.id === f.section)?.label ?? f.section;
      out.push(`Texte ${section} › ${f.label} : ${short(before.texts[f.key])} → ${short(after.texts[f.key])}`);
    }
  }

  // Infos générales
  const bg = before.galaInfo as unknown as Record<string, unknown>;
  const ag = after.galaInfo as unknown as Record<string, unknown>;
  for (const key of new Set([...Object.keys(bg), ...Object.keys(ag)])) {
    if (JSON.stringify(bg[key]) === JSON.stringify(ag[key])) continue;
    const label = GALA_LABELS[key] ?? (key === 'dressCode' ? 'Dress code' : key);
    if (typeof ag[key] === 'object') out.push(`Infos générales › ${label} : modifié`);
    else out.push(`Infos générales › ${label} : ${short(bg[key])} → ${short(ag[key])}`);
  }

  // Listes (billets, programme, invités…)
  for (const [key, label] of Object.entries(LIST_LABELS)) {
    const b = (before as unknown as Record<string, Record<string, unknown>[]>)[key] ?? [];
    const a = (after as unknown as Record<string, Record<string, unknown>[]>)[key] ?? [];
    if (JSON.stringify(b) === JSON.stringify(a)) continue;
    const bIds = new Map(b.map((i) => [String(i.id), i]));
    const aIds = new Map(a.map((i) => [String(i.id), i]));
    a.filter((i) => !bIds.has(String(i.id))).forEach((i) => out.push(`${label} : ajouté ${short(itemName(i))}`));
    b.filter((i) => !aIds.has(String(i.id))).forEach((i) => out.push(`${label} : supprimé ${short(itemName(i))}`));
    a.forEach((i) => {
      const old = bIds.get(String(i.id));
      if (!old || JSON.stringify(old) === JSON.stringify(i)) return;
      const fields = Object.keys(i).filter((k) => JSON.stringify(old[k]) !== JSON.stringify(i[k]));
      const changes = fields.map((k) => `${k} ${short(old[k])} → ${short(i[k])}`).join(' ; ');
      out.push(`${label} › ${short(itemName(i))} : ${changes}`);
    });
    const order = (l: Record<string, unknown>[]) => l.map((i) => String(i.id)).filter((id) => aIds.has(id) && bIds.has(id)).join();
    if (order(b) !== order(a)) out.push(`${label} : ordre modifié`);
  }
  return out;
};

export const useContentChangeLog = () => {
  const { content } = useContent();
  const { log } = useTeam();
  const prev = useRef(content);
  const batchStart = useRef<SiteContent | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logRef = useRef(log);
  logRef.current = log;

  const flush = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    const start = batchStart.current;
    batchStart.current = null;
    if (!start) return;
    const details = diffContent(start, prev.current);
    if (details.length) logRef.current('A modifié le contenu du site', undefined, details.slice(0, 20));
  };

  useEffect(() => {
    if (prev.current === content) return;
    // Les réglages (ventes, sections…) ont leur propre ligne d'historique
    const { settings: _a, ...restBefore } = prev.current;
    const { settings: _b, ...restAfter } = content;
    const onlySettings = JSON.stringify(restBefore) === JSON.stringify(restAfter);
    if (!onlySettings && !batchStart.current) batchStart.current = prev.current;
    prev.current = content;
    if (onlySettings) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, 3000);
  }, [content]);

  // En quittant la console : on enregistre ce qui reste
  useEffect(() => () => flush(), []);
};

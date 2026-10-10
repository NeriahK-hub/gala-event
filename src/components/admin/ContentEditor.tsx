import React, { useRef, useState } from 'react';
import { Download, ExternalLink, RotateCcw, Upload, Info } from 'lucide-react';
import { useContent } from '../../content/ContentContext';
import { TEXT_FIELDS, TEXT_SECTIONS } from '../../content/textSchema';
import {
  GalaInfo,
  GalleryItem,
  GuestArtist,
  FaqItem,
  PartnerSponsor,
  ProgramItem,
  SiteContent,
  TicketTier,
} from '../../types';
import { useAdminAuth } from './AdminAuth';
import { FieldDef, ListEditor, ObjectFields, TextInput } from './fields';

type SectionId = 'infos' | (typeof TEXT_SECTIONS)[number]['id'];

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'infos', label: 'Infos générales' },
  ...TEXT_SECTIONS,
];

const galaFields: FieldDef<GalaInfo>[] = [
  { key: 'name', label: 'Nom du gala' },
  { key: 'edition', label: 'Édition' },
  { key: 'theme', label: 'Thème' },
  { key: 'slogan', label: 'Slogan', type: 'textarea' },
  { key: 'dateText', label: 'Date affichée' },
  { key: 'timeText', label: 'Horaires affichés' },
  { key: 'isoDate', label: 'Date de l\'événement', type: 'datetime', hint: 'Le compte à rebours de la billetterie se règle dans Réglages.' },
  { key: 'city', label: 'Ville' },
  { key: 'venueName', label: 'Nom du lieu' },
  { key: 'venueRoom', label: 'Salle' },
  { key: 'venueAddress', label: 'Adresse' },
];

const contactFields: FieldDef<GalaInfo>[] = [
  { key: 'organizersName', label: 'Nom de l\'organisateur' },
  { key: 'organizersBio', label: 'Présentation de l\'organisateur', type: 'textarea' },
  { key: 'whatsappNumber', label: 'Numéro WhatsApp de la billetterie', hint: 'Les commandes des clients arrivent sur ce numéro. Avec l\'indicatif, ex. +243 994 047 745' },
  { key: 'contactEmail', label: 'E-mail de contact' },
  { key: 'instagram', label: 'Compte Instagram' },
];

const statFields: FieldDef<GalaInfo['keyStats'][number]>[] = [
  { key: 'value', label: 'Chiffre' },
  { key: 'label', label: 'Libellé' },
  { key: 'desc', label: 'Description' },
];

const dressFields: FieldDef<GalaInfo['dressCode']>[] = [
  { key: 'title', label: 'Titre' },
  { key: 'subtitle', label: 'Sous-titre' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'womenGuidelines', label: 'Consignes — dames', type: 'textarea' },
  { key: 'menGuidelines', label: 'Consignes — messieurs', type: 'textarea' },
];

const colorFields: FieldDef<GalaInfo['dressCode']['colors'][number]>[] = [
  { key: 'name', label: 'Nom de la couleur' },
  { key: 'desc', label: 'Description' },
  { key: 'hex', label: 'Couleur', type: 'color' },
];

const tierFields: FieldDef<TicketTier>[] = [
  { key: 'name', label: 'Nom du billet' },
  { key: 'subtitle', label: 'Sous-titre' },
  { key: 'price', label: 'Prix (USD)', type: 'number' },
  { key: 'availableCount', label: 'Places restantes', type: 'number' },
  { key: 'badge', label: 'Badge (ex. Le plus prisé)', hint: 'Laisse vide pour ne rien afficher' },
  { key: 'highlighted', label: 'Mettre cette formule en avant', type: 'checkbox' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'perks', label: 'Avantages inclus', type: 'lines' },
];

const programFields: FieldDef<ProgramItem>[] = [
  { key: 'time', label: 'Heure' },
  { key: 'category', label: 'Catégorie' },
  { key: 'title', label: 'Titre' },
  { key: 'description', label: 'Description', type: 'textarea' },
];

const guestFields: FieldDef<GuestArtist>[] = [
  { key: 'name', label: 'Nom' },
  { key: 'role', label: 'Rôle' },
  { key: 'title', label: 'Titre / fonction' },
  { key: 'imageUrl', label: 'Photo', type: 'image' },
  { key: 'bio', label: 'Biographie', type: 'textarea' },
];

const galleryFields: FieldDef<GalleryItem>[] = [
  { key: 'title', label: 'Titre' },
  { key: 'category', label: 'Catégorie' },
  { key: 'imageUrl', label: 'Photo', type: 'image' },
  { key: 'caption', label: 'Légende', type: 'textarea' },
];

const sponsorFields: FieldDef<PartnerSponsor>[] = [
  { key: 'logoText', label: 'Nom affiché' },
  { key: 'logoUrl', label: 'Logo ou image', type: 'image' },
  { key: 'category', label: 'Catégorie' },
  { key: 'name', label: 'Nom complet (interne)' },
];

const faqFields: FieldDef<FaqItem>[] = [
  { key: 'question', label: 'Question' },
  { key: 'answer', label: 'Réponse', type: 'textarea' },
];

const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}`;

interface ContentEditorProps {
  onViewSite: () => void;
  notify: (message: string) => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({ onViewSite, notify }) => {
  const { content, setContent, replaceContent, resetAll, isCustomized } = useContent();
  const { authorize } = useAdminAuth();
  const [section, setSection] = useState<SectionId>('infos');
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (patch: Partial<SiteContent>) => setContent((prev) => ({ ...prev, ...patch }));
  const setGala = (g: GalaInfo) => update({ galaInfo: g });
  const setText = (key: string, value: string) =>
    setContent((prev) => ({ ...prev, texts: { ...prev.texts, [key]: value } }));

  const resetSectionTexts = async (id: string) => {
    if (!confirm('Remettre les textes de cette section à leur valeur d\'origine ?')) return;
    if (!(await authorize('les modifications de cette section'))) return;
    setContent((prev) => {
      const texts = { ...prev.texts };
      TEXT_FIELDS.filter((f) => f.section === id).forEach((f) => (texts[f.key] = f.value));
      return { ...prev, texts };
    });
    notify('Textes de la section réinitialisés');
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contenu-gala-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('Contenu exporté');
  };

  const importJson = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text());
      if (!parsed || typeof parsed !== 'object' || !parsed.galaInfo) throw new Error('format');
      replaceContent(parsed as SiteContent);
      notify('Contenu importé');
    } catch {
      notify('Fichier invalide : choisis un export de ce site');
    }
  };

  const sectionTexts = TEXT_FIELDS.filter((f) => f.section === section);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-xl border border-[#E8C98A]/30 bg-[#E8C98A]/10 p-4 text-sm text-stone-100">
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Tes modifications sont <strong>enregistrées automatiquement dans ce navigateur</strong> et visibles tout de suite
          sur le site. Pour les garder en sécurité ou les copier sur un autre appareil, utilise <strong>Exporter</strong>.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onViewSite}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E6C78A] text-[#2B1B0A] text-sm font-bold cursor-pointer hover:bg-[#EFD6A2]"
        >
          <ExternalLink className="w-4 h-4" /> Voir le site
        </button>
        <button onClick={exportJson} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-sm text-stone-100 hover:bg-white/10 cursor-pointer">
          <Download className="w-4 h-4" /> Exporter
        </button>
        <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-sm text-stone-100 hover:bg-white/10 cursor-pointer">
          <Upload className="w-4 h-4" /> Importer
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) importJson(f);
            e.target.value = '';
          }}
        />
        <button
          disabled={!isCustomized}
          onClick={async () => {
            if (confirm('Effacer toutes tes modifications et revenir au contenu d\'origine ?') && (await authorize('toutes les modifications du site'))) {
              resetAll();
              notify('Contenu d\'origine rétabli');
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-400/40 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ml-auto"
        >
          <RotateCcw className="w-4 h-4" /> Tout réinitialiser
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        {/* Sélecteur de section : liste sur grand écran, menu déroulant sur mobile */}
        <div>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value as SectionId)}
            aria-label="Section à modifier"
            className="lg:hidden w-full px-3.5 py-3 rounded-lg border border-white/10 bg-black/20 text-sm text-stone-100"
          >
            {SECTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <nav className="hidden lg:flex flex-col gap-1 sticky top-24" aria-label="Sections du site">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={`text-left px-3.5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                  section === s.id
                    ? 'bg-[#E6C78A]/10 text-stone-100 font-semibold'
                    : 'text-stone-300 hover:bg-white/5'
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="min-w-0 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-7 space-y-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold tracking-tight text-xl text-stone-100">{SECTIONS.find((s) => s.id === section)?.label}</h2>
            {sectionTexts.length > 0 && (
              <button
                onClick={() => resetSectionTexts(section)}
                className="text-xs text-stone-400 hover:text-stone-100 underline underline-offset-4 cursor-pointer"
              >
                Réinitialiser les textes
              </button>
            )}
          </div>

          {section === 'infos' && (
            <>
              <ObjectFields item={content.galaInfo} fields={galaFields} onChange={setGala} />
              <div>
                <h3 className="text-sm font-semibold text-[#E6C78A] mb-3">Chiffres clés (section « Le gala »)</h3>
                <ListEditor
                  items={content.galaInfo.keyStats}
                  onChange={(keyStats) => setGala({ ...content.galaInfo, keyStats })}
                  fields={statFields}
                  title={(s) => `${s.value} — ${s.label}`}
                  createItem={() => ({ value: '0', label: 'Nouveau chiffre', desc: '' })}
                  addLabel="Ajouter un chiffre"
                />
              </div>
            </>
          )}

          {sectionTexts.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {sectionTexts.map((f) => (
                <TextInput
                  key={f.key}
                  label={f.label}
                  value={content.texts[f.key] ?? f.value}
                  onChange={(v) => setText(f.key, v)}
                  multiline={f.multiline}
                />
              ))}
            </div>
          )}

          {section === 'program' && (
            <ListEditor
              items={content.program}
              onChange={(program) => update({ program })}
              fields={programFields}
              title={(p) => `${p.time} — ${p.title}`}
              createItem={() => ({ id: newId('p'), time: '00:00', title: 'Nouvelle étape', description: '', category: 'Étape' })}
              addLabel="Ajouter une étape"
            />
          )}

          {section === 'guests' && (
            <ListEditor
              items={content.guests}
              onChange={(guests) => update({ guests })}
              fields={guestFields}
              title={(g) => g.name}
              createItem={() => ({ id: newId('art'), name: 'Nouvel invité', role: 'Rôle', title: '', bio: '', imageUrl: '' })}
              addLabel="Ajouter un invité"
            />
          )}

          {section === 'tickets' && (
            <ListEditor
              items={content.tiers}
              onChange={(tiers) => update({ tiers })}
              fields={tierFields}
              title={(t) => `${t.name} — ${t.price} USD`}
              canRemove={false}
            />
          )}

          {section === 'dresscode' && (
            <>
              <ObjectFields
                item={content.galaInfo.dressCode}
                fields={dressFields}
                onChange={(dressCode) => setGala({ ...content.galaInfo, dressCode })}
              />
              <div>
                <h3 className="text-sm font-semibold text-[#E6C78A] mb-3">Nuancier de couleurs</h3>
                <ListEditor
                  items={content.galaInfo.dressCode.colors}
                  onChange={(colors) => setGala({ ...content.galaInfo, dressCode: { ...content.galaInfo.dressCode, colors } })}
                  fields={colorFields}
                  title={(c) => c.name}
                  createItem={() => ({ name: 'Nouvelle couleur', hex: '#D4A857', desc: '' })}
                  addLabel="Ajouter une couleur"
                />
              </div>
            </>
          )}

          {section === 'gallery' && (
            <ListEditor
              items={content.gallery}
              onChange={(gallery) => update({ gallery })}
              fields={galleryFields}
              title={(g) => g.title}
              createItem={() => ({ id: newId('gal'), title: 'Nouvelle photo', caption: '', category: 'Ambiance', imageUrl: '' })}
              addLabel="Ajouter une photo"
            />
          )}

          {section === 'sponsors' && (
            <ListEditor
              items={content.sponsors}
              onChange={(sponsors) => update({ sponsors })}
              fields={sponsorFields}
              title={(s) => s.logoText}
              createItem={() => ({ id: newId('sp'), name: 'Nouveau partenaire', category: 'Partenaire', logoText: 'NOUVEAU PARTENAIRE' })}
              addLabel="Ajouter un partenaire"
            />
          )}

          {section === 'faq' && (
            <ListEditor
              items={content.faq}
              onChange={(faq) => update({ faq })}
              fields={faqFields}
              title={(q) => q.question}
              createItem={() => ({ id: newId('faq'), question: 'Nouvelle question ?', answer: '' })}
              addLabel="Ajouter une question"
            />
          )}

          {section === 'contact' && (
            <ObjectFields item={content.galaInfo} fields={contactFields} onChange={setGala} />
          )}

        </div>
      </div>
    </div>
  );
};

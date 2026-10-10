import React from 'react';
import { useAdminAuth } from './AdminAuth';
import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2 } from 'lucide-react';

const inputCls =
  'w-full px-3.5 py-2.5 rounded-lg border border-white/15 bg-black/25 text-sm text-[#F9F5EC] placeholder-stone-500 focus:border-[#E8C98A] focus:outline-none focus:ring-2 focus:ring-[#E8C98A]/20 transition';

export type FieldType = 'text' | 'textarea' | 'number' | 'checkbox' | 'lines' | 'color' | 'image';

export interface FieldDef<T> {
  key: keyof T & string;
  label: string;
  type?: FieldType;
  hint?: string;
}

interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({ label, hint, children }) => (
  <label className="block">
    <span className="block text-xs font-semibold text-[#E8C98A] mb-1.5">{label}</span>
    {children}
    {hint && <span className="block text-xs text-stone-400 mt-1">{hint}</span>}
  </label>
);

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  hint?: string;
}

export const TextInput: React.FC<TextFieldProps> = ({ label, value, onChange, multiline, hint }) => (
  <Field label={label} hint={hint}>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={Math.min(8, Math.max(3, Math.ceil(value.length / 70)))}
        className={`${inputCls} resize-y leading-relaxed`}
      />
    ) : (
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    )}
  </Field>
);

// Redimensionne une image importée (1200 px max, JPEG) pour qu'elle tienne dans le stockage du navigateur
const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('lecture'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('image'));
      img.onload = () => {
        const scale = Math.min(1, 1200 / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });

const ImageField: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => {
  const { authorize } = useAdminAuth();
  const [error, setError] = React.useState('');
  return (
    <Field label={label} hint="Colle un lien, ou importe une image depuis ton appareil.">
      <div className="flex flex-col sm:flex-row gap-3">
        {value && <img src={value} alt="" className="h-20 w-20 rounded-lg object-cover border border-white/15 shrink-0" />}
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value.startsWith('data:') ? '(image importée)' : value}
            readOnly={value.startsWith('data:')}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://…"
            className={inputCls}
          />
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/20 text-sm text-stone-100 hover:bg-white/10 cursor-pointer">
              <ImagePlus className="w-4 h-4" /> Importer une image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  e.target.value = '';
                  if (!f) return;
                  try {
                    setError('');
                    onChange(await fileToDataUrl(f));
                  } catch {
                    setError("Impossible de lire cette image.");
                  }
                }}
              />
            </label>
            {value && (
              <button type="button" onClick={async () => { if (await authorize('cette image')) onChange(''); }} className="text-xs text-stone-400 hover:text-red-300 underline underline-offset-4 cursor-pointer">
                Retirer l'image
              </button>
            )}
          </div>
          {error && <p className="text-xs text-red-300">{error}</p>}
        </div>
      </div>
    </Field>
  );
};

// Édition d'un objet à partir d'une liste de champs
interface ObjectFieldsProps<T> {
  item: T;
  fields: FieldDef<T>[];
  onChange: (next: T) => void;
}

export function ObjectFields<T extends object>({ item, fields, onChange }: ObjectFieldsProps<T>) {
  const set = (key: string, value: unknown) => onChange({ ...item, [key]: value } as T);
  const get = (key: string) => (item as Record<string, unknown>)[key];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {fields.map((f) => {
        const type = f.type ?? 'text';
        const wide = type === 'textarea' || type === 'lines' || type === 'image';
        const raw = get(f.key);
        return (
          <div key={f.key} className={wide ? 'sm:col-span-2' : ''}>
            {type === 'checkbox' ? (
              <label className="flex items-center gap-2.5 text-sm text-[#F9F5EC] cursor-pointer pt-6">
                <input
                  type="checkbox"
                  checked={!!raw}
                  onChange={(e) => set(f.key, e.target.checked)}
                  className="w-4 h-4 accent-[#E8C98A]"
                />
                {f.label}
              </label>
            ) : type === 'image' ? (
              <ImageField label={f.label} value={String(raw ?? '')} onChange={(v) => set(f.key, v)} />
            ) : type === 'lines' ? (
              <Field label={f.label} hint={f.hint ?? 'Une ligne par élément'}>
                <textarea
                  value={Array.isArray(raw) ? (raw as string[]).join('\n') : ''}
                  onChange={(e) => set(f.key, e.target.value.split('\n'))}
                  rows={6}
                  className={`${inputCls} resize-y leading-relaxed`}
                />
              </Field>
            ) : type === 'textarea' ? (
              <TextInput label={f.label} value={String(raw ?? '')} onChange={(v) => set(f.key, v)} multiline hint={f.hint} />
            ) : type === 'number' ? (
              <Field label={f.label} hint={f.hint}>
                <input
                  type="number"
                  min={0}
                  value={Number(raw ?? 0)}
                  onChange={(e) => set(f.key, Number(e.target.value))}
                  className={inputCls}
                />
              </Field>
            ) : type === 'color' ? (
              <Field label={f.label} hint={f.hint}>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={String(raw ?? '#000000')}
                    onChange={(e) => set(f.key, e.target.value)}
                    className="h-10 w-12 rounded-lg border border-white/15 bg-transparent cursor-pointer"
                  />
                  <input type="text" value={String(raw ?? '')} onChange={(e) => set(f.key, e.target.value)} className={inputCls} />
                </div>
              </Field>
            ) : (
              <TextInput label={f.label} value={String(raw ?? '')} onChange={(v) => set(f.key, v)} hint={f.hint} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Liste d'éléments modifiables (ajout, suppression, réorganisation)
interface ListEditorProps<T> {
  items: T[];
  onChange: (next: T[]) => void;
  fields: FieldDef<T>[];
  title: (item: T, index: number) => string;
  createItem?: () => T;
  addLabel?: string;
  canRemove?: boolean;
}

export function ListEditor<T extends object>({
  items,
  onChange,
  fields,
  title,
  createItem,
  addLabel = 'Ajouter',
  canRemove = true,
}: ListEditorProps<T>) {
  const { authorize } = useAdminAuth();
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <details
          key={(item as { id?: string }).id ?? index}
          className="group rounded-xl border border-white/10 bg-black/20 open:bg-black/30"
          open={items.length <= 3}
        >
          <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none">
            <span className="text-sm font-semibold text-[#F9F5EC] truncate">
              <span className="text-[#E8C98A] mr-2 tabular-nums">{index + 1}.</span>
              {title(item, index) || 'Sans titre'}
            </span>
            <span className="flex items-center gap-1 shrink-0" onClick={(e) => e.preventDefault()}>
              {createItem && (
                <>
                  <button
                    type="button"
                    onClick={() => move(index, index - 1)}
                    disabled={index === 0}
                    aria-label="Monter"
                    className="p-1.5 rounded-md text-stone-300 hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, index + 1)}
                    disabled={index === items.length - 1}
                    aria-label="Descendre"
                    className="p-1.5 rounded-md text-stone-300 hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </>
              )}
              {canRemove && (
                <button
                  type="button"
                  onClick={async () => {
                    const name = title(item, index) || 'cet élément';
                    if (confirm(`Supprimer « ${name} » ?`) && (await authorize(`« ${name} »`))) {
                      onChange(items.filter((_, i) => i !== index));
                    }
                  }}
                  aria-label="Supprimer"
                  className="p-1.5 rounded-md text-red-300 hover:bg-red-500/15 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </span>
          </summary>
          <div className="px-4 pb-4 pt-1 border-t border-white/10">
            <div className="pt-4">
              <ObjectFields
                item={item}
                fields={fields}
                onChange={(next) => onChange(items.map((it, i) => (i === index ? next : it)))}
              />
            </div>
          </div>
        </details>
      ))}

      {createItem && (
        <button
          type="button"
          onClick={() => onChange([...items, createItem()])}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-[#E8C98A]/60 text-sm font-semibold text-[#F3E5AB] hover:bg-[#E8C98A]/10 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {addLabel}
        </button>
      )}
    </div>
  );
}

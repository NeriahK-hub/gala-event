import React, { useState } from 'react';
import { ClipboardPaste, PencilLine } from 'lucide-react';
import { Order, TicketTier } from '../../types';
import { buildOrder, decodeOrderRequest, newOrderId } from '../../lib/ticketLink';
import { Modal } from './Modal';

interface AddOrderModalProps {
  tiers: TicketTier[];
  existingIds: string[];
  onAdd: (order: Order) => void;
  onClose: () => void;
}

const inputCls =
  'w-full px-3.5 py-3 rounded-lg border border-white/15 bg-black/30 text-sm text-[#F9F5EC] placeholder-stone-500 focus:border-[#E8C98A] focus:outline-none focus:ring-2 focus:ring-[#E8C98A]/20';

export const AddOrderModal: React.FC<AddOrderModalProps> = ({ tiers, existingIds, onAdd, onClose }) => {
  const [mode, setMode] = useState<'paste' | 'manual'>('paste');
  const [error, setError] = useState('');

  // Collage du message WhatsApp
  const [pasted, setPasted] = useState('');
  const tierName = (id: string) => tiers.find((t) => t.id === id)?.name ?? id;
  const parsed = pasted.trim() ? decodeOrderRequest(pasted, tierName) : null;

  // Saisie manuelle
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tierId, setTierId] = useState(tiers[0]?.id ?? 'standard');
  const [quantity, setQuantity] = useState(1);

  const submitPasted = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsed) {
      setError("Je ne trouve pas de code de commande dans ce message. Colle le message complet du client (la dernière ligne contient « Code commande »).");
      return;
    }
    if (existingIds.includes(parsed.id)) {
      setError(`La commande ${parsed.id} existe déjà.`);
      return;
    }
    onAdd(parsed);
  };

  const submitManual = (e: React.FormEvent) => {
    e.preventDefault();
    const tier = tiers.find((t) => t.id === tierId) ?? tiers[0];
    if (!name.trim() || !phone.trim() || !tier) {
      setError('Renseigne le nom et le numéro WhatsApp du client.');
      return;
    }
    onAdd(
      buildOrder({
        id: newOrderId(),
        name: name.trim(),
        phone: phone.trim(),
        tierId: tier.id,
        tierName: tier.name,
        quantity: Math.max(1, Math.min(50, quantity)),
        unitPrice: tier.price,
      })
    );
  };

  return (
    <Modal onClose={onClose} title="Ajouter une commande" kicker="Nouvelle commande">
      <div className="flex gap-1 p-1 rounded-xl bg-black/30 mb-5" role="tablist">
        {([
          ['paste', 'Depuis WhatsApp', <ClipboardPaste key="a" className="w-4 h-4" />],
          ['manual', 'À la main', <PencilLine key="b" className="w-4 h-4" />],
        ] as const).map(([id, label, icon]) => (
          <button
            key={id}
            role="tab"
            aria-selected={mode === id}
            onClick={() => {
              setMode(id);
              setError('');
            }}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors ${
              mode === id ? 'bg-[#E8C98A] text-[#3D030B]' : 'text-stone-300 hover:bg-white/10'
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="mb-4 text-sm text-red-200 bg-red-500/10 border border-red-400/30 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {mode === 'paste' ? (
        <form onSubmit={submitPasted} className="space-y-4">
          <label className="block">
            <span className="block text-xs font-semibold text-[#E8C98A] mb-1.5">Message reçu du client</span>
            <textarea
              value={pasted}
              onChange={(e) => {
                setPasted(e.target.value);
                setError('');
              }}
              rows={6}
              placeholder="Colle ici le message WhatsApp du client (avec la ligne « Code commande »)"
              className={`${inputCls} resize-y`}
            />
          </label>

          {parsed && (
            <dl className="rounded-xl bg-black/30 p-4 text-sm space-y-1.5">
              <div className="flex justify-between gap-4"><dt className="text-stone-400">Commande</dt><dd className="font-mono text-[#F3E5AB]">{parsed.id}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-stone-400">Client</dt><dd>{parsed.customerName}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-stone-400">Téléphone</dt><dd className="font-mono">{parsed.customerPhone}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-stone-400">Billets</dt><dd>{parsed.quantity} × {tierName(parsed.tierId)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-stone-400">Total</dt><dd className="font-bold text-[#F3E5AB]">{parsed.totalAmount} USD</dd></div>
            </dl>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-gradient-to-b from-[#FFB43A] to-[#F2761B] text-[#3D0A04] font-bold text-sm hover:brightness-110 cursor-pointer"
          >
            Ajouter la commande
          </button>
        </form>
      ) : (
        <form onSubmit={submitManual} className="space-y-4">
          <label className="block">
            <span className="block text-xs font-semibold text-[#E8C98A] mb-1.5">Nom du client</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-[#E8C98A] mb-1.5">Numéro WhatsApp</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="+243 …" className={inputCls} />
          </label>
          <div className="grid grid-cols-[1fr_110px] gap-3">
            <label className="block">
              <span className="block text-xs font-semibold text-[#E8C98A] mb-1.5">Billet</span>
              <select value={tierId} onChange={(e) => setTierId(e.target.value as typeof tierId)} className={inputCls}>
                {tiers.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#1a0a0d]">
                    {t.name} — {t.price} USD
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-[#E8C98A] mb-1.5">Quantité</span>
              <input type="number" min={1} max={50} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className={inputCls} />
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-gradient-to-b from-[#FFB43A] to-[#F2761B] text-[#3D0A04] font-bold text-sm hover:brightness-110 cursor-pointer"
          >
            Ajouter la commande
          </button>
        </form>
      )}
    </Modal>
  );
};

import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { INITIAL_ORDERS } from './data/mockData';
import { Order, TicketTierId, OrderStatus } from './types';
import { Header } from './components/common/Header';
import { HeroSection } from './components/vitrine/HeroSection';
import { CountdownSection } from './components/vitrine/CountdownSection';
import { AboutSection } from './components/vitrine/AboutSection';
import { ProgramSection } from './components/vitrine/ProgramSection';
import { GuestsSection } from './components/vitrine/GuestsSection';
import { TicketsSection } from './components/vitrine/TicketsSection';
import { DressCodeSection } from './components/vitrine/DressCodeSection';
import { GallerySection } from './components/vitrine/GallerySection';
import { VenueSection } from './components/vitrine/VenueSection';
import { SponsorsSection } from './components/vitrine/SponsorsSection';
import { FaqSection } from './components/vitrine/FaqSection';
import { TeamContactSection } from './components/vitrine/TeamContactSection';
import { Footer } from './components/common/Footer';
import { ReservationFlow } from './components/reservation/ReservationFlow';
import { TicketViewPage } from './components/tickets/TicketViewPage';
import { useContent } from './content/ContentContext';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminGate } from './components/admin/AdminGate';
import { AdminRole, getAdminRole } from './lib/adminLock';
import { FloatingActions } from './components/common/FloatingActions';
import { DevNavSwitcher, ActiveView } from './components/common/DevNavSwitcher';
import { decodeTicketToken, loadMyTickets, saveMyTicket } from './lib/ticketLink';

// Le sélecteur de vues n'est visible que si l'URL contient ?demo (mode démo : commandes d'exemple, rien n'est enregistré)
const SHOW_DEMO_NAV = new URLSearchParams(window.location.search).has('demo');

// Lien d'invitations reçu du client : ?billet=…
const TICKET_TOKEN = new URLSearchParams(window.location.search).get('billet');

const ORDERS_KEY = 'gala-orders-v1';
const MY_ORDERS_KEY = 'gala-my-orders-v1';

const loadOrders = (): Order[] => {
  if (SHOW_DEMO_NAV) return INITIAL_ORDERS;
  try {
    const raw = JSON.parse(localStorage.getItem(ORDERS_KEY) ?? '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};

const loadMyOrderIds = (): string[] => {
  try {
    const raw = JSON.parse(localStorage.getItem(MY_ORDERS_KEY) ?? '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};

type Viewed = { kind: 'local' | 'unlocked'; id: string } | null;

export default function App() {
  const { isSectionVisible: show } = useContent();
  // Current active view
  const [activeView, setActiveView] = useState<ActiveView>(TICKET_TOKEN ? 'tickets' : 'vitrine');

  // Commandes (enregistrées dans ce navigateur, sauf en mode démo)
  const [orders, setOrders] = useState<Order[]>(loadOrders);
  const [myOrderIds, setMyOrderIds] = useState<string[]>(loadMyOrderIds);
  // Code d'accès de l'espace équipe (ignoré en mode démo)
  const [adminRole, setAdminRole] = useState<AdminRole | null>(() => (SHOW_DEMO_NAV ? 'owner' : getAdminRole()));

  // Invitations débloquées par un lien sur cet appareil
  const [unlockedTokens, setUnlockedTokens] = useState<string[]>(() => {
    if (TICKET_TOKEN && decodeTicketToken(TICKET_TOKEN)) saveMyTicket(TICKET_TOKEN);
    return loadMyTickets();
  });
  const unlocked = useMemo(
    () => unlockedTokens.map(decodeTicketToken).filter((o): o is Order => o !== null),
    [unlockedTokens]
  );
  const linkError = !!TICKET_TOKEN && !decodeTicketToken(TICKET_TOKEN);

  useEffect(() => {
    if (SHOW_DEMO_NAV) return;
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {
      // stockage indisponible
    }
  }, [orders]);

  useEffect(() => {
    if (SHOW_DEMO_NAV) return;
    try {
      localStorage.setItem(MY_ORDERS_KEY, JSON.stringify(myOrderIds));
    } catch {
      // stockage indisponible
    }
  }, [myOrderIds]);

  // Selected Order for the Ticket View
  // Commande affichée sur la page « Mes billets »
  const [viewed, setViewed] = useState<Viewed>(() => {
    const d = TICKET_TOKEN ? decodeTicketToken(TICKET_TOKEN) : null;
    return d ? { kind: 'unlocked', id: d.id } : null;
  });

  // Pre-selected ticket tier for reservation flow
  const [selectedTierId, setSelectedTierId] = useState<TicketTierId>('standard');

  // Navigation scroll helper for vitrine
  const handleNavigateSection = (sectionId: string) => {
    if (activeView !== 'vitrine') {
      setActiveView('vitrine');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open reservation flow
  const handleOpenReservation = (tierId: TicketTierId = 'standard') => {
    setSelectedTierId(tierId);
    setActiveView('reservation');
  };

  // When a new order is completed in reservation flow
  const handleOrderCreated = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setMyOrderIds((prev) => [newOrder.id, ...prev]);
    setViewed({ kind: 'local', id: newOrder.id });
  };

  // Commande ajoutée par l'admin (message WhatsApp collé ou saisie à la main)
  const handleAddOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    setMyOrderIds((prev) => prev.filter((id) => id !== orderId));
  };

  // Import d'une sauvegarde : les commandes importées remplacent celles qui ont le même numéro
  const handleImportOrders = (incoming: Order[]) => {
    setOrders((prev) => [...incoming, ...prev.filter((o) => !incoming.some((i) => i.id === o.id))]);
  };

  // Update order status (from admin or ticket page toggle)
  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  // Navigate to ticket view for specific order
  const handleViewTicket = (orderId: string) => {
    setViewed({ kind: 'local', id: orderId });
    setActiveView('tickets');
  };

  // À chaque changement de page : on repart tout en haut, tout de suite (pas de défilement qui s'arrête au milieu)
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeView, viewed?.id]);

  // Commande affichée + liste « Mes billets » de cet appareil
  const currentTicketOrder: Order | null =
    viewed?.kind === 'unlocked'
      ? unlocked.find((o) => o.id === viewed.id) ?? null
      : viewed?.kind === 'local'
      ? orders.find((o) => o.id === viewed.id) ?? null
      : null;

  const savedOrders: Order[] = [
    ...unlocked,
    ...orders.filter((o) => myOrderIds.includes(o.id) && !unlocked.some((u) => u.id === o.id)),
  ];

  return (
    <div className="relative min-h-screen text-[#F9F5EC]">

      {activeView !== 'admin' && (
        <Header
          isHome={activeView === 'vitrine'}
          onNavigateSection={handleNavigateSection}
          onOpenReservation={() => handleOpenReservation('standard')}
        />
      )}

      {/* Main Content Router */}
      <main>
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
        {/* ================= 1. SITE VITRINE ================= */}
        {activeView === 'vitrine' && (
          <div className="space-y-4">
            {/* 1. Section d'ouverture avec enveloppe rouge et gant satin or */}
            <HeroSection
              onReserveClick={() => handleOpenReservation('standard')}
              onExploreClick={() => handleNavigateSection('about')}
            />

            {/* 2. Compte à rebours */}
            {show('countdown') && <CountdownSection />}

            {/* 3. Le gala */}
            {show('about') && <AboutSection />}

            {/* 4. Au programme */}
            {show('programme') && <ProgramSection />}

            {/* 5. Invités et artistes */}
            {show('invites') && <GuestsSection />}

            {/* 6. Les billets */}
            {show('billets') && <TicketsSection onSelectTier={handleOpenReservation} />}

            {/* 7. Dress code */}
            {show('dresscode') && <DressCodeSection />}

            {/* 8. Galerie */}
            {show('galerie') && <GallerySection />}

            {/* 9. Le lieu */}
            {show('lieu') && <VenueSection />}

            {/* 10. Partenaires et sponsors */}
            {show('sponsors') && <SponsorsSection />}

            {/* 11. Questions fréquentes */}
            {show('faq') && <FaqSection />}

            {/* 12. L'équipe et contact */}
            {show('contact') && <TeamContactSection />}

            {/* 13. Pied de page */}
            <Footer
              onNavigateSection={handleNavigateSection}
              onOpenAdmin={() => {
                setActiveView('admin');
              }}
              onOpenMyTickets={() => {
                setViewed(null);
                setActiveView('tickets');
              }}
            />
          </div>
        )}

        {/* ================= 2. LA RÉSERVATION ================= */}
        {activeView === 'reservation' && (
          <ReservationFlow
            initialTierId={selectedTierId}
            onBackToHome={() => {
              setActiveView('vitrine');
            }}
            onOrderCreated={handleOrderCreated}
            onViewTicket={handleViewTicket}
          />
        )}

        {/* ================= 3. MES BILLETS (CLIENT) ================= */}
        {activeView === 'tickets' && (
          <TicketViewPage
            order={currentTicketOrder}
            savedOrders={savedOrders}
            linkError={linkError}
            onOpenOrder={(o) => setViewed({ kind: unlocked.some((u) => u === o) ? 'unlocked' : 'local', id: o.id })}
            onShowList={() => setViewed(null)}
            onBackToHome={() => {
              setActiveView('vitrine');
            }}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {/* ================= 4. ESPACE ÉQUIPE (ADMIN & SCANNER) ================= */}
        {activeView === 'admin' && !adminRole && (
          <AdminGate onUnlock={setAdminRole} onBackToHome={() => setActiveView('vitrine')} />
        )}
        {activeView === 'admin' && adminRole && (
          <AdminDashboard
            orders={orders}
            onUpdateOrder={handleUpdateOrder}
            onAddOrder={handleAddOrder}
            onDeleteOrder={handleDeleteOrder}
            onImportOrders={handleImportOrders}
            onBackToHome={() => {
              setActiveView('vitrine');
            }}
            onOpenOrderTickets={handleViewTicket}
            role={adminRole}
            onLock={() => setAdminRole(null)}
          />
        )}
        </motion.div>
      </main>

      {/* Floating Demo Navigation Switcher (Allows testing all pages with mockData) */}
      {activeView === 'vitrine' && <FloatingActions onReserve={() => handleOpenReservation('standard')} />}

      {SHOW_DEMO_NAV && (
        <DevNavSwitcher
          activeView={activeView}
          onChangeView={(view) => {
            if (view === 'tickets' && !viewed && orders[0]) setViewed({ kind: 'local', id: orders[0].id });
            setActiveView(view);
          }}
          selectedOrderId={viewed?.id}
        />
      )}
    </div>
  );
}

import React, { useState } from 'react';
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
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PosterFrame } from './components/common/PosterFrame';
import { DevNavSwitcher, ActiveView } from './components/common/DevNavSwitcher';

// Le sélecteur de vues n'est visible que si l'URL contient ?demo
const SHOW_DEMO_NAV = new URLSearchParams(window.location.search).has('demo');

export default function App() {
  // Current active view
  const [activeView, setActiveView] = useState<ActiveView>('vitrine');

  // Shared Orders State (initialized with mockData)
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // Selected Order for the Ticket View
  const [selectedOrderId, setSelectedOrderId] = useState<string>(INITIAL_ORDERS[0].id);

  // Pre-selected ticket tier for reservation flow
  const [selectedTierId, setSelectedTierId] = useState<TicketTierId>('vip');

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
  const handleOpenReservation = (tierId: TicketTierId = 'vip') => {
    setSelectedTierId(tierId);
    setActiveView('reservation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When a new order is completed in reservation flow
  const handleOrderCreated = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrderId(newOrder.id);
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
    setSelectedOrderId(orderId);
    setActiveView('tickets');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get current order object for Ticket View
  const currentTicketOrder =
    orders.find((o) => o.id === selectedOrderId) || orders[0];

  return (
    <div className="relative min-h-screen text-[#F9F5EC]">
      <PosterFrame />

      {/* Fixed Header (visible on vitrine, and provides navigation across app) */}
      <Header
        onNavigateSection={handleNavigateSection}
        onOpenReservation={() => handleOpenReservation('vip')}
      />

      {/* Main Content Router */}
      <main>
        {/* ================= 1. SITE VITRINE ================= */}
        {activeView === 'vitrine' && (
          <div className="space-y-4">
            {/* 1. Section d'ouverture avec enveloppe rouge et gant satin or */}
            <HeroSection
              onReserveClick={() => handleOpenReservation('vip')}
              onExploreClick={() => handleNavigateSection('about')}
            />

            {/* 2. Compte à rebours */}
            <CountdownSection />

            {/* 3. Le gala */}
            <AboutSection />

            {/* 4. Au programme */}
            <ProgramSection />

            {/* 5. Invités et artistes */}
            <GuestsSection />

            {/* 6. Les billets */}
            <TicketsSection onSelectTier={handleOpenReservation} />

            {/* 7. Dress code */}
            <DressCodeSection />

            {/* 8. Galerie */}
            <GallerySection />

            {/* 9. Le lieu */}
            <VenueSection />

            {/* 10. Partenaires et sponsors */}
            <SponsorsSection />

            {/* 11. Questions fréquentes */}
            <FaqSection />

            {/* 12. L'équipe et contact */}
            <TeamContactSection />

            {/* 13. Pied de page */}
            <Footer
              onNavigateSection={handleNavigateSection}
              onOpenAdmin={() => {
                setActiveView('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenMyTickets={() => {
                setActiveView('tickets');
                window.scrollTo({ top: 0, behavior: 'smooth' });
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
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOrderCreated={handleOrderCreated}
            onViewTicket={handleViewTicket}
          />
        )}

        {/* ================= 3. MES BILLETS (CLIENT) ================= */}
        {activeView === 'tickets' && (
          <TicketViewPage
            order={currentTicketOrder}
            onBackToHome={() => {
              setActiveView('vitrine');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {/* ================= 4. ESPACE ÉQUIPE (ADMIN & SCANNER) ================= */}
        {activeView === 'admin' && (
          <AdminDashboard
            orders={orders}
            onUpdateOrder={handleUpdateOrder}
            onBackToHome={() => {
              setActiveView('vitrine');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenOrderTickets={handleViewTicket}
          />
        )}
      </main>

      {/* Floating Demo Navigation Switcher (Allows testing all pages with mockData) */}
      {SHOW_DEMO_NAV && (
        <DevNavSwitcher
          activeView={activeView}
          onChangeView={(view) => {
            setActiveView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          selectedOrderId={selectedOrderId}
        />
      )}
    </div>
  );
}

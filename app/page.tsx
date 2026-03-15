'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import HomeFeed from '@/components/trips/HomeFeed';
import TripsList from '@/components/trips/TripsList';
import TripDetails from '@/components/trips/TripDetails';
import CreateTrip from '@/components/trips/CreateTrip';
import RequestItem from '@/components/trips/RequestItem';
import PaymentPortal from '@/components/payment/PaymentPortal';
import Chat from '@/components/chat/Chat';
import Profile from '@/components/profile/Profile';
import BottomNav from '@/components/layout/BottomNav';
import { UserButton } from '@clerk/nextjs';

export default function App() {
  const [currentPage, setCurrentPage] = useState('main');
  const [activeTab, setActiveTab] = useState('home');
  const [showTripDetails, setShowTripDetails] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [initialChatMessage, setInitialChatMessage] = useState<string | undefined>(undefined);

  const handleTripClick = (trip: any) => {
    setSelectedTrip(trip);
    setShowTripDetails(true);
  };

  const handleRequestSubmit = (items: any[]) => {
    const itemStrings = items.map(item => `• ${item.name} (x${item.quantity}) - ₹${item.price || '?'}`);
    const message = `Hi ${selectedTrip.host?.full_name || selectedTrip.user}! I'd like to request the following items from ${selectedTrip.store}:\n\n${itemStrings.join('\n')}`;
    setInitialChatMessage(message);
    setCurrentPage('chat');
  };

  // Simple router
  const renderPage = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage + (currentPage === 'main' ? activeTab : '')}
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.02, y: -10 }}
          transition={{ 
            duration: 0.4, 
            ease: [0.22, 1, 0.36, 1] 
          }}
          className="w-full h-full"
        >
          {(() => {
            switch (currentPage) {
              case 'main':
                switch (activeTab) {
                  case 'home':
                    return <HomeFeed onTripClick={handleTripClick} onCreateTrip={() => setCurrentPage('create-trip')} />;
                  case 'trips':
                    return <TripsList onTripClick={handleTripClick} />;
                  case 'orders':
                    return <PaymentPortal 
                      hostName={selectedTrip?.host?.full_name || selectedTrip?.user || 'Host'} 
                      upiId={selectedTrip?.host?.upi_id || selectedTrip?.upiId || ''} 
                      onBack={() => setActiveTab('home')} 
                    />;
                  case 'profile':
                    return <Profile onBack={() => setActiveTab('home')} />;
                  default:
                    return <HomeFeed onTripClick={handleTripClick} onCreateTrip={() => setCurrentPage('create-trip')} />;
                }
              case 'create-trip':
                return <CreateTrip onBack={() => setCurrentPage('main')} onLive={() => setCurrentPage('main')} />;
              case 'request-item':
                return <RequestItem 
                  tripInfo={selectedTrip} 
                  onBack={() => setCurrentPage('main')} 
                  onSubmit={handleRequestSubmit} 
                />;
              case 'chat':
                return <Chat tripId={selectedTrip?.id} onBack={() => setCurrentPage('main')} initialMessage={initialChatMessage} />;
              default:
                return <HomeFeed onTripClick={handleTripClick} onCreateTrip={() => setCurrentPage('create-trip')} />;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="w-full h-[100dvh] bg-black flex justify-center items-center overflow-hidden">
      <div className="relative w-full max-w-[430px] h-full overflow-hidden bg-[#0F1412] shadow-2xl flex flex-col">
        {/* Top Header with User Button */}
        <div className="absolute top-4 right-6 z-50">
           <UserButton appearance={{ 
             elements: {
               avatarBox: "w-10 h-10 border border-glass-border shadow-lg"
             }
           }} />
        </div>

        <div className="flex-1 relative overflow-hidden">
          {renderPage()}
        </div>
        
        {/* Render Bottom Nav only on main tabs */}
        {currentPage === 'main' && (
          <BottomNav activeTab={activeTab} onChange={setActiveTab} />
        )}

        {/* Render Trip Details as an overlay */}
        <AnimatePresence>
          {showTripDetails && (
            <TripDetails 
              trip={selectedTrip}
              onClose={() => setShowTripDetails(false)} 
              onJoin={() => {
                setShowTripDetails(false);
                setCurrentPage('request-item');
              }} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

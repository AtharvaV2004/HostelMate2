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
import LoginRegister from '@/components/auth/LoginRegister';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { LogOut, Loader2 } from 'lucide-react';

export default function App() {
  const { user, loading } = useSupabaseAuth();
  const [currentPage, setCurrentPage] = useState('main');
  const [activeTab, setActiveTab] = useState('home');
  const [showTripDetails, setShowTripDetails] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [initialChatMessage, setInitialChatMessage] = useState<string | undefined>(undefined);

  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

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

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-primary size-8" />
      </div>
    );
  }

  if (!user) {
    return <LoginRegister onLoginSuccess={() => {}} />;
  }

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
          className="w-full h-full flex flex-col"
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
        {/* Top Header with Profile/Logout */}
        <div className="absolute top-4 right-6 z-50 flex items-center gap-3">
          <button 
            onClick={handleLogout}
            className="w-10 h-10 rounded-full bg-bg-surface border border-glass-border flex items-center justify-center text-text-muted hover:text-red-500 transition-colors"
          >
            <LogOut size={18} />
          </button>
          <div className="w-10 h-10 rounded-full border border-glass-border overflow-hidden relative">
            <Image 
              src={user.user_metadata.avatar_url || `https://picsum.photos/seed/${user.id}/100/100`} 
              alt="Profile" 
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 flex flex-col">
            {renderPage()}
          </div>
        </div>
        
        {currentPage === 'main' && (
          <BottomNav activeTab={activeTab} onChange={setActiveTab} />
        )}

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

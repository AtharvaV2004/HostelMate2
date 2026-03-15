import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Bell, Search, Plus, MapPin, Clock, ChevronRight, ShoppingBag } from 'lucide-react';
import { Trip } from '@/types';

export default function HomeFeed({ onTripClick, onCreateTrip }: { onTripClick: (trip: any) => void, onCreateTrip: () => void }) {
  const [activeTrips, setActiveTrips] = useState<any[]>([]);

  useEffect(() => {
    const fetchTrips = async () => {
      const response = await fetch('/api/trips');
      if (response.ok) {
        const data = await response.json();
        setActiveTrips(data);
      }
    };
    fetchTrips();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full flex-1 min-h-0 overflow-y-auto hide-scrollbar pb-24">
      {/* Sticky Header */}
      <motion.div 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-30 glass-panel px-6 py-4 flex justify-between items-center border-b-0"
      >
        <div className="flex items-center gap-2">
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="w-8 h-8 rounded-lg emerald-gradient flex items-center justify-center"
          >
            <span className="font-bold text-sm">H</span>
          </motion.div>
          <span className="font-bold text-lg tracking-tight">HostelMate</span>
        </div>
        <div className="flex gap-3">
          <button className="w-10 h-10 rounded-full bg-bg-surface border border-glass-border flex items-center justify-center text-text-muted hover:text-white transition-colors">
            <Search size={20} />
          </button>
          <button className="w-10 h-10 rounded-full bg-bg-surface border border-glass-border flex items-center justify-center text-text-muted hover:text-white transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-ping" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
          </button>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="px-6 py-6 space-y-8"
      >
        {/* Hero Banner */}
        <motion.div variants={itemVariants} className="glass-card p-6 relative overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl" 
          />
          <h2 className="text-2xl font-bold mb-2">Hungry for<br/>something?</h2>
          <p className="text-sm text-text-muted mb-4">{activeTrips.length} trips leaving your hostel soon.</p>
          
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {activeTrips.slice(0, 3).map((trip, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -5, zIndex: 10 }}
                  className="w-8 h-8 rounded-full border-2 border-[#0F1412] bg-bg-surface overflow-hidden cursor-pointer relative"
                >
                  <Image 
                    src={trip.host?.avatar_url || `https://picsum.photos/seed/${trip.id}/100/100`} 
                    alt="User" 
                    fill
                    className="object-cover" 
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              ))}
            </div>
            <span className="text-xs font-medium text-primary">+{activeTrips.length} active now</span>
          </div>
        </motion.div>

        {/* Active Trips */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold">Active Trips Near You</h3>
            <button className="text-xs text-primary font-medium flex items-center">View All <ChevronRight size={14} /></button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-6 px-6">
            {activeTrips.map((trip, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onTripClick(trip)} 
                className="min-w-[240px] glass-card p-4 cursor-pointer hover:border-primary/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-bg-surface flex items-center justify-center">
                      <ShoppingBag size={18} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{trip.store}</h4>
                      <p className="text-xs text-text-muted flex items-center gap-1"><MapPin size={10} /> {trip.location}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20 flex items-center gap-1">
                    <Clock size={10} /> {new Date(trip.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-muted">Slots left</span>
                    <span className="font-medium">{trip.slots_total - trip.slots_used}/{trip.slots_total}</span>
                  </div>
                  <div className="h-1.5 w-full bg-bg-surface rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(trip.slots_used / trip.slots_total) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full emerald-gradient rounded-full" 
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-glass-border">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden relative">
                      <Image 
                        src={trip.host?.avatar_url || `https://picsum.photos/seed/${trip.host_id}/100/100`} 
                        alt={trip.host?.full_name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-xs text-text-muted">{trip.host?.full_name}</span>
                  </div>
                  <button className="text-xs font-bold text-primary">Request</button>
                </div>
              </motion.div>
            ))}
            {activeTrips.length === 0 && <p className="text-sm text-text-muted">No active trips currently.</p>}
          </div>
        </motion.div>

        {/* Stats Grid - Keeping hardcoded for now or fetch from user profile */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
          <motion.div whileHover={{ y: -5 }} className="glass-card p-4 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold emerald-text-gradient">₹0</span>
            <span className="text-xs text-text-muted mt-1">Saved on Tips</span>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="glass-card p-4 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold">0</span>
            <span className="text-xs text-text-muted mt-1">Total Deliveries</span>
          </motion.div>
        </motion.div>

        {/* Recent Orders - Keeping hardcoded for now */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {[
              { store: 'Instamart', item: 'Groceries', by: 'Amit', amount: '₹120', status: 'Delivered' },
              { store: 'McDonalds', item: 'Burger Meal', by: 'Sneha', amount: '₹250', status: 'Delivered' }
            ].map((order, i) => (
              <motion.div 
                key={i} 
                whileHover={{ x: 5 }}
                className="glass-card p-4 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-bg-surface flex items-center justify-center">
                    <ShoppingBag size={18} className="text-text-muted" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{order.store}</h4>
                    <p className="text-xs text-text-muted">by {order.by}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm">{order.amount}</div>
                  <div className="text-[10px] text-primary">{order.status}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* FAB */}
      <motion.button 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onCreateTrip}
        className="absolute bottom-24 right-6 w-14 h-14 rounded-full emerald-gradient flex items-center justify-center emerald-glow z-30"
      >
        <Plus size={28} className="text-white" />
      </motion.button>
    </div>
  );
}

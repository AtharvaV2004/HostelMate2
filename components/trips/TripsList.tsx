'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Search, MapPin, Clock, Users, Filter, ShoppingBag, Star, Loader2 } from 'lucide-react';

export default function TripsList({ onTripClick }: { onTripClick: (trip: any) => void }) {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('/api/trips');
        if (response.ok) {
          const data = await response.json();
          setTrips(data);
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setLoading(false);
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
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-30 glass-panel px-6 py-4 border-b-0"
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Find Trips</h1>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-bg-surface border border-glass-border flex items-center justify-center text-text-muted"
          >
            <Filter size={18} />
          </motion.button>
        </div>
        
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search destination or host..." 
            className="w-full bg-bg-surface border border-glass-border rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-muted">
          <Loader2 className="animate-spin mb-4" />
          <p className="text-sm">Loading active trips...</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="px-6 py-6 space-y-4"
        >
          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-6 px-6 mb-2">
            {['All', 'Grocery', 'Quick', 'Food', 'Medical'].map((cat, i) => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap border ${
                  i === 0 ? 'bg-primary/10 border-primary text-primary' : 'bg-bg-surface border-glass-border text-text-muted'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* Trips List */}
          {trips.length === 0 ? (
            <div className="text-center py-10 text-text-muted">
              <p>No active trips found.</p>
            </div>
          ) : (
            trips.map((trip) => (
              <motion.div 
                key={trip.id} 
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onTripClick(trip)}
                className="glass-card p-4 cursor-pointer relative group"
              >
                {(trip.slots_total - (trip.slots_used || 0)) <= 0 && (
                  <div className="absolute top-4 right-4 bg-red-500/10 text-red-500 px-2 py-1 rounded text-[10px] font-bold uppercase">Full</div>
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-bg-surface border border-glass-border flex items-center justify-center">
                      <ShoppingBag size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">{trip.store}</h3>
                      <div className="flex items-center gap-1 text-xs text-text-muted">
                        <MapPin size={12} /> {trip.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-primary flex items-center justify-end gap-1">
                      <Clock size={12} /> {new Date(trip.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">{trip.type}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-glass-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden relative">
                      <Image 
                        src={trip.host?.avatar_url || `https://picsum.photos/seed/${trip.host_id}/100/100`} 
                        alt={trip.host?.full_name || 'Host'}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-medium">{trip.host?.full_name || 'Host'}</div>
                      <div className="flex items-center gap-0.5 text-[10px] text-amber-500">
                        <Star size={8} fill="currentColor" /> {trip.host?.rating || '5.0'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="text-[10px] text-text-muted mb-1">Available Slots</div>
                    <div className="flex gap-1">
                      {Array.from({ length: trip.slots_total }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-3 h-1 rounded-full ${i < (trip.slots_total - (trip.slots_used || 0)) ? 'emerald-gradient' : 'bg-bg-surface border border-glass-border'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}

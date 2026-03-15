import { motion } from 'motion/react';
import Image from 'next/image';
import { MapPin, Clock, Navigation, CheckCircle2 } from 'lucide-react';

export default function TripDetails({ trip, currentUser, onClose, onJoin }: { trip: any, currentUser: any, onClose: () => void, onJoin: () => void }) {
  if (!trip) return null;

  const isHost = currentUser?.id === trip.host_id;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" 
        onClick={onClose} 
      />
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute bottom-0 left-0 right-0 glass-panel border-b-0 border-l-0 border-r-0 rounded-t-3xl z-50 flex flex-col max-h-[85vh]"
      >
        {/* Drag Handle */}
        <div className="w-full flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing" onClick={onClose}>
          <div className="w-12 h-1.5 bg-glass-border rounded-full" />
        </div>

        <div className="p-6 overflow-y-auto hide-scrollbar">
          {/* Header Info */}
          <div className="flex justify-between items-start mb-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-1">{trip.store} Run</h2>
              <p className="text-sm text-text-muted flex items-center gap-1"><MapPin size={14} /> {trip.location}</p>
            </motion.div>
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-right"
            >
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20 text-xs font-bold">
                <Clock size={12} /> {new Date(trip.departure_time || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          </div>

          {/* Map Placeholder */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full h-32 bg-bg-surface rounded-2xl border border-glass-border mb-6 relative overflow-hidden flex items-center justify-center"
          >
            {/* Same SVG Map Content */}
            <div className="absolute inset-0 opacity-40">
              <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-20 40L420 80 M150 -20L100 170 M300 -20L340 170 M-20 120L420 100 M200 -20L220 170" stroke="#374151" strokeWidth="1.5" />
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  d="M115 55L210 105L325 90" 
                  stroke="#10B981" 
                  strokeWidth="3" 
                  strokeDasharray="6 6" 
                  className="animate-pulse" 
                />
                <circle cx="115" cy="55" r="5" fill="#111A18" stroke="#10B981" strokeWidth="2" />
                <circle cx="325" cy="90" r="5" fill="#10B981" />
                <circle cx="325" cy="90" r="12" fill="#10B981" opacity="0.2" className="animate-ping" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-bg-surface via-transparent to-transparent" />
            <Navigation className="text-primary w-6 h-6 absolute z-10 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <div className="absolute bottom-2 right-2 bg-bg-base/80 backdrop-blur px-2 py-1 rounded text-[10px] text-text-muted z-10 border border-glass-border">Map View</div>
          </motion.div>

          {/* Host Info */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-4 mb-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden relative">
                  <Image 
                    src={trip.host?.avatar_url || "https://picsum.photos/seed/rahul/100/100"} 
                    alt="Host"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-bg-base rounded-full p-0.5 z-10">
                  <CheckCircle2 size={14} className="text-primary" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm">{trip.host?.full_name || "Rahul Sharma"}</h4>
                <p className="text-xs text-text-muted">{trip.host?.hostel} • {trip.host?.hero_points} pts</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-text-muted">Capacity</div>
              <div className="font-bold text-sm">{trip.slots_used}/{trip.slots_total} slots full</div>
            </div>
          </motion.div>

          {/* Requested Items (Mock for now, should be orders) */}
          <h3 className="text-sm font-bold mb-3 text-text-muted uppercase tracking-wider">Current Requests</h3>
          <div className="space-y-3 mb-8">
            {trip.orders?.map((order: any, i: number) => (
              <motion.div 
                key={order.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center justify-between bg-bg-surface p-3 rounded-xl border border-glass-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden relative">
                    <Image 
                      src={order.requester?.avatar_url || `https://picsum.photos/seed/${order.id}/100/100`} 
                      alt="Requester"
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{order.order_items?.[0]?.name || "Item"}</div>
                    <div className="text-xs text-text-muted">for {order.requester?.full_name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm">₹{order.total_price}</div>
                  {order.payment_status === 'confirmed' ? (
                    <span className="text-[10px] text-primary flex items-center justify-end gap-1"><CheckCircle2 size={10} /> UPI Verified</span>
                  ) : (
                    <span className="text-[10px] text-amber-500">{order.status}</span>
                  )}
                </div>
              </motion.div>
            )) || <p className="text-xs text-text-muted italic">No requests yet.</p>}
          </div>

          {/* CTA */}
          <motion.button 
            whileHover={!isHost ? { scale: 1.02 } : {}}
            whileTap={!isHost ? { scale: 0.98 } : {}}
            onClick={!isHost ? onJoin : undefined} 
            disabled={isHost}
            className={`w-full py-4 rounded-xl font-bold text-base ${
              isHost 
                ? 'bg-bg-surface border border-glass-border text-text-muted cursor-not-allowed opacity-70' 
                : 'emerald-gradient text-white emerald-glow'
            }`}
          >
            {isHost ? "You are the Host" : "Request Items"}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}

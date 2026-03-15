import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Clock, Users, ArrowRight, Loader2 } from 'lucide-react';

export default function CreateTrip({ onBack, onLive }: { onBack: () => void, onLive: () => void }) {
  const [formData, setFormData] = useState({
    store: '',
    location: '',
    departure_time: '',
    slots_total: '5',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          slots_total: parseInt(formData.slots_total),
          departure_time: new Date(formData.departure_time).toISOString()
        }),
      });

      if (response.ok) {
        onLive();
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to create trip');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-container bg-black overflow-y-auto hide-scrollbar pb-10">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-6 py-6 flex items-center justify-between"
      >
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-bg-surface border border-glass-border flex items-center justify-center text-text-muted hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold italic tracking-tight">Post a Trip</h1>
        <div className="w-10" />
      </motion.div>

      <form onSubmit={handleSubmit} className="px-6 space-y-6">
        {/* Progress indicator */}
        <div className="flex gap-2 mb-8">
          <div className="h-1.5 flex-1 emerald-gradient rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <div className="h-1.5 flex-1 bg-bg-surface rounded-full" />
          <div className="h-1.5 flex-1 bg-bg-surface rounded-full" />
        </div>

        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest px-1">Where are you going?</label>
            <div className={`glass-card flex items-center px-4 py-4 gap-3 focus-within:border-primary transition-colors`}>
              <MapPin size={20} className="text-primary" />
              <input 
                type="text" 
                placeholder="Store (e.g. Dmart, McDonalds)" 
                required
                className="bg-transparent border-none outline-none w-full text-white placeholder:text-text-muted font-medium"
                value={formData.store}
                onChange={(e) => setFormData({...formData, store: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest px-1">Location Details</label>
            <div className={`glass-card flex items-center px-4 py-4 gap-3 focus-within:border-primary transition-colors`}>
              <MapPin size={20} className="text-primary/50" />
              <input 
                type="text" 
                placeholder="Market area, Mall name, etc." 
                required
                className="bg-transparent border-none outline-none w-full text-white placeholder:text-text-muted text-sm"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest px-1">Departure</label>
              <div className="glass-card flex items-center px-4 py-4 gap-3 focus-within:border-primary transition-colors">
                <Clock size={16} className="text-primary/50" />
                <input 
                  type="datetime-local" 
                  required
                  className="bg-transparent border-none outline-none w-full text-white text-xs [color-scheme:dark]"
                  value={formData.departure_time}
                  onChange={(e) => setFormData({...formData, departure_time: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest px-1">Slots Available</label>
              <div className="glass-card flex items-center px-4 py-4 gap-3 focus-within:border-primary transition-colors">
                <Users size={16} className="text-primary/50" />
                <select 
                  className="bg-transparent border-none outline-none w-full text-white text-sm"
                  value={formData.slots_total}
                  onChange={(e) => setFormData({...formData, slots_total: e.target.value})}
                >
                  <option value="3" className="bg-[#0F1412]">3 slots</option>
                  <option value="5" className="bg-[#0F1412]">5 slots</option>
                  <option value="8" className="bg-[#0F1412]">8 slots</option>
                  <option value="10" className="bg-[#0F1412]">10 slots</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest px-1">Additional Notes</label>
            <div className="glass-card p-4 focus-within:border-primary transition-colors">
              <textarea 
                placeholder="Tell others what you can carry (e.g. only light stuff, no bulky items)" 
                className="bg-transparent border-none outline-none w-full text-white placeholder:text-text-muted text-sm min-h-[100px] resize-none"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="pt-4"
        >
          <button 
            type="submit" 
            disabled={loading}
            className="w-full emerald-gradient py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group emerald-glow disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                Go Live Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          <p className="text-[10px] text-text-muted text-center mt-4 px-8 leading-relaxed">
            By going live, you agree to deliver items carefully and collect payments fairly.
          </p>
        </motion.div>
      </form>
    </div>
  );
}

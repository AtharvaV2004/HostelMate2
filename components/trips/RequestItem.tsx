'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingCart, Plus, Minus, Info, Zap, Loader2 } from 'lucide-react';
import { Item } from '@/types';

export default function RequestItem({ onBack, onSubmit, tripInfo }: { 
  onBack: () => void, 
  onSubmit: (items: Item[]) => void,
  tripInfo: any
}) {
  const [items, setItems] = useState<Item[]>([
    { id: '1', name: '', quantity: 1, price: '' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Filter out empty items
    const validItems = items.filter(i => i.name.trim() !== '');
    if (validItems.length === 0) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip_id: tripInfo.id,
          items: validItems
        }),
      });

      if (response.ok) {
        onSubmit(validItems);
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to place order');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), name: '', quantity: 1, price: '' }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof Item, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const totalPrice = items.reduce((sum, item) => {
    const p = parseFloat(item.price) || 0;
    return sum + (p * item.quantity);
  }, 0);

  return (
    <div className="mobile-container flex flex-col">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel px-6 py-4 flex items-center gap-4 border-b-0 sticky top-0 z-30"
      >
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-bg-surface border border-glass-border flex items-center justify-center text-text-muted hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">Request Items</h1>
      </motion.div>

      <div className="flex-1 overflow-y-auto hide-scrollbar p-6 pb-32">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-2">
            <ShoppingCart size={14} /> Ordering from
          </div>
          <h2 className="text-2xl font-bold mb-1">{tripInfo?.store}</h2>
          <p className="text-sm text-text-muted">Trip hosted by {tripInfo?.host?.full_name || tripInfo?.user}</p>
        </motion.div>

        <div className="space-y-6">
          {items.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="glass-card p-4 relative"
            >
              {items.length > 1 && (
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Item Name</label>
                  <input 
                    type="text" 
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    placeholder="e.g. Maggi 4-pack" 
                    className="w-full bg-bg-surface border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Est. Price (₹)</label>
                    <input 
                      type="number" 
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                      placeholder="e.g. 60" 
                      className="w-full bg-bg-surface border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Quantity</label>
                    <div className="flex items-center bg-bg-surface border border-glass-border rounded-xl overflow-hidden">
                      <button 
                        onClick={() => updateItem(item.id, 'quantity', Math.max(1, item.quantity - 1))}
                        className="flex-1 py-3 flex items-center justify-center text-text-muted hover:text-white transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateItem(item.id, 'quantity', item.quantity + 1)}
                        className="flex-1 py-3 flex items-center justify-center text-text-muted hover:text-white transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addItem}
            className="w-full py-4 rounded-xl border border-dashed border-glass-border text-text-muted text-sm font-medium flex items-center justify-center gap-2 hover:border-primary/50 hover:text-primary transition-all"
          >
            <Plus size={18} /> Add another item
          </motion.button>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-start gap-3"
          >
            <Info size={18} className="text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-text-muted leading-relaxed">
              Estimated total: <span className="text-primary font-bold">₹{totalPrice}</span>. 
              Prices are approximate. You will pay the actual bill amount after delivery.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <motion.div 
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="absolute bottom-0 left-0 right-0 p-6 glass-panel border-t border-b-0 border-l-0 border-r-0 z-40"
      >
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          onClick={handleSubmit} 
          className="w-full emerald-gradient py-4 rounded-xl font-bold text-base emerald-glow flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : (
            <>
              <Zap size={20} className="fill-white" />
              SEND REQUEST
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}

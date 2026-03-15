import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Paperclip, Send, Clock, CheckCircle2 } from 'lucide-react';
import { Message } from '@/types';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export default function Chat({ tripId, onBack, initialMessage, currentUser }: { tripId: string, onBack: () => void, initialMessage?: string, currentUser: any }) {
  const [message, setMessage] = useState(initialMessage || '');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`/api/messages/${tripId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.map((m: any) => ({
          ...m,
          sender: m.sender_id === currentUser.id ? 'me' : 'other',
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })));
      }
    };

    fetchMessages();

    const channel = supabase
      .channel(`trip-${tripId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `trip_id=eq.${tripId}`,
      }, (payload) => {
        setMessages(prev => [...prev, {
          ...payload.new as any,
          sender: payload.new.sender_id === currentUser.id ? 'me' : 'other',
          time: new Date(payload.new.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) }
  }, [tripId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const response = await fetch(`/api/messages/${tripId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    });

    if (response.ok) {
      const newMsg = await response.json();
      // Optimistically adding the message might cause duplicates with real-time, 
      // depends on if you want it or wait for the subscription
      setMessage('');
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-black">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel px-6 py-4 flex items-center justify-between border-b-0 sticky top-0 z-30"
      >
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-bg-surface border border-glass-border flex items-center justify-center text-text-muted hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold">Chat</h1>
            <p className="text-xs text-text-muted">Trip #{tripId?.slice(0, 8)}</p>
          </div>
        </div>
        <div className="bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
          In Progress
        </div>
      </motion.div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto hide-scrollbar p-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id} 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'me' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <motion.img 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  src={msg.sender === 'me' ? 'https://picsum.photos/seed/me/100/100' : 'https://picsum.photos/seed/rahul/100/100'} 
                  className="w-8 h-8 rounded-full flex-shrink-0" 
                  alt="Avatar" 
                />
                
                <div className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-text-muted mb-1 px-1">
                    {msg.sender === 'me' ? 'Me' : 'User'}
                  </span>
                  
                  <motion.div 
                    layout
                    className={`p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                      msg.sender === 'me' 
                        ? `emerald-gradient text-white rounded-tr-sm ${msg.status === 'sending' ? 'opacity-70' : ''}` 
                        : 'bg-bg-surface border border-glass-border rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </motion.div>
                  
                  <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[10px] text-text-muted">{msg.time}</span>
                    {msg.sender === 'me' && (
                      msg.status === 'sending' ? <Clock size={10} className="text-text-muted" /> :
                      msg.status === 'sent' ? <CheckCircle2 size={10} className="text-text-muted" /> :
                      <CheckCircle2 size={10} className="text-primary" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-4 glass-panel border-t border-b-0 border-l-0 border-r-0 z-30"
      >
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <button type="button" className="w-10 h-10 rounded-full bg-bg-surface border border-glass-border flex items-center justify-center text-text-muted hover:text-white transition-colors flex-shrink-0">
            <Paperclip size={20} />
          </button>
          
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..." 
            className="flex-1 bg-bg-surface border border-glass-border rounded-full px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
          />
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit" 
            disabled={!message.trim()}
            className="w-12 h-12 rounded-full emerald-gradient flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={20} className="ml-1" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

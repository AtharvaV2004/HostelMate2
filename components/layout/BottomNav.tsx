import { motion } from 'motion/react';
import { Home, Map, ShoppingBag, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'trips', icon: Map, label: 'Trips' },
    { id: 'orders', icon: ShoppingBag, label: 'Orders' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="absolute bottom-0 left-0 right-0 glass-panel border-t border-b-0 border-l-0 border-r-0 rounded-t-2xl px-6 py-4 z-40"
    >
      <div className="flex justify-between items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onChange(tab.id)}
              className={`flex flex-col items-center gap-1 transition-colors relative ${
                isActive ? 'text-primary' : 'text-text-muted hover:text-gray-300'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="nav-glow"
                  className="absolute -top-1 w-12 h-12 bg-primary/10 rounded-full blur-xl -z-10"
                />
              )}
              <Icon size={24} className={isActive ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ''} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

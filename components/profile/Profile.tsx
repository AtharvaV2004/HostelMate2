import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { ArrowLeft, Settings, Award, Package, Heart, ChevronRight, Star, TrendingUp } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

export default function Profile({ onBack }: { onBack: () => void }) {
  const { user } = useUser();
  const [profileData, setProfileData] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      }
    };
    const fetchLeaderboard = async () => {
      const response = await fetch('/api/leaderboard');
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      }
    };
    fetchProfile();
    fetchLeaderboard();
  }, []);

  const stats = [
    { label: 'Orders', value: '0', icon: Package, color: 'text-blue-400' },
    { label: 'Hero Points', value: profileData?.hero_points || '0', icon: Heart, color: 'text-rose-400' },
    { label: 'Rating', value: '5.0', icon: Star, color: 'text-amber-400' }
  ];

  return (
    <div className="mobile-container bg-black overflow-y-auto hide-scrollbar pb-24">
      {/* Header */}
      <div className="relative h-48 w-full">
        <div className="absolute inset-0 emerald-gradient opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white">
            <ArrowLeft size={20} />
          </button>
          <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-6 -mt-16 relative z-10">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-black bg-bg-surface overflow-hidden shadow-2xl relative">
              {user?.imageUrl && (
                <Image 
                  src={user.imageUrl} 
                  alt="Profile" 
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full emerald-gradient border-4 border-black flex items-center justify-center"
            >
              <Award size={14} className="text-white" />
            </motion.div>
          </div>
          
          <h2 className="text-2xl font-bold mt-4">{user?.fullName || "Syncing..."}</h2>
          <p className="text-text-muted text-sm">{profileData?.hostel || "Hostel"} • Room {profileData?.room_no || "---"}</p>
          
          <div className="flex gap-4 mt-6 w-full">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="flex-1 glass-card p-3 flex flex-col items-center justify-center border-white/5"
              >
                <stat.icon size={18} className={`${stat.color} mb-1`} />
                <span className="text-lg font-bold">{stat.value}</span>
                <span className="text-[10px] text-text-muted uppercase tracking-wider">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Level Progress */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5 mt-6 border-primary/20 bg-primary/5"
        >
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Current Level</span>
              <h3 className="text-lg font-bold">Newbie Hero</h3>
            </div>
            <span className="text-xs font-bold text-primary">{profileData?.hero_points || 0}/100 XP</span>
          </div>
          <div className="h-2 w-full bg-bg-surface rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(profileData?.hero_points || 0) % 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full emerald-gradient rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
            />
          </div>
          <p className="text-[10px] text-text-muted mt-3">Earn {100 - ((profileData?.hero_points || 0) % 100)} more points to reach <span className="text-white">Campus Legend</span></p>
        </motion.div>

        {/* Leaderboard */}
        <div className="mt-8 pb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              Leaderboard
            </h3>
            <span className="text-xs text-text-muted">Global</span>
          </div>
          
          <div className="space-y-3">
            {leaderboard.map((hero, i) => (
              <motion.div 
                key={hero.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className={`glass-card p-3 flex items-center justify-between border-white/5 ${hero.id === user?.id ? 'border-primary/30 bg-primary/5 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 text-center font-bold italic ${i < 3 ? 'text-primary' : 'text-text-muted'}`}>
                    #{i + 1}
                  </div>
                  <div className="w-10 h-10 rounded-full border border-glass-border overflow-hidden relative">
                    <Image 
                      src={hero.avatar_url || `https://picsum.photos/seed/${hero.id}/100/100`} 
                      alt={hero.full_name} 
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${hero.id === user?.id ? 'text-primary' : 'text-white'}`}>{hero.full_name}</h4>
                    <p className="text-[10px] text-text-muted flex items-center gap-1">{hero.hostel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-xs font-bold">{hero.hero_points}</div>
                    <div className="text-[8px] text-text-muted uppercase tracking-tighter">Points</div>
                  </div>
                  {i < 3 && <Award size={16} className="text-amber-400" />}
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.button 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             className="w-full mt-6 py-3 rounded-xl border border-glass-border text-xs font-bold text-text-muted flex items-center justify-center gap-2"
          >
            Show full ranking <ChevronRight size={14} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

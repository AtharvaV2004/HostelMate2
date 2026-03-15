import { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Eye, EyeOff, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginRegister({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [hostel, setHostel] = useState('');

  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onLoginSuccess();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              room_no: roomNo,
              hostel: hostel,
            }
          }
        });
        if (error) throw error;
        
        // In a real app, you might need email verification, but here we assume it's auto-confirmed or user is logged in
        if (data.user) {
          onLoginSuccess();
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-container justify-center p-6 relative">
      {/* Radial Glow Background */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" 
      />
      
      <div className="relative z-10 w-full max-w-sm mx-auto">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mb-4 emerald-glow">
            <Zap className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">HostelMate</h1>
          <p className="text-text-muted text-sm mt-1">Campus deliveries, sorted.</p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 w-full"
        >
          <div className="flex bg-bg-surface rounded-xl p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all relative z-10 ${
                isLogin ? 'text-white' : 'text-text-muted hover:text-white'
              }`}
            >
              {isLogin && (
                <motion.div 
                  layoutId="tab-bg"
                  className="absolute inset-0 bg-bg-base rounded-lg shadow-sm -z-10"
                />
              )}
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all relative z-10 ${
                !isLogin ? 'text-white' : 'text-text-muted hover:text-white'
              }`}
            >
              {!isLogin && (
                <motion.div 
                  layoutId="tab-bg"
                  className="absolute inset-0 bg-bg-base rounded-lg shadow-sm -z-10"
                />
              )}
              Register
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="space-y-4 overflow-hidden"
              >
                <div>
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-bg-surface border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" 
                    required 
                  />
                </div>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="Room No." 
                    value={roomNo}
                    onChange={(e) => setRoomNo(e.target.value)}
                    className="w-1/3 bg-bg-surface border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" 
                    required 
                  />
                  <select 
                    value={hostel}
                    onChange={(e) => setHostel(e.target.value)}
                    className="w-2/3 bg-bg-surface border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors appearance-none text-text-muted" 
                    required
                  >
                    <option value="" disabled>Select Hostel</option>
                    <option value="Hostel 1">Hostel 1</option>
                    <option value="Hostel 2">Hostel 2</option>
                    <option value="Hostel 3">Hostel 3</option>
                  </select>
                </div>
              </motion.div>
            )}
            
            <div>
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg-surface border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" 
                required 
              />
            </div>
            
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-surface border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" 
                required 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit" 
              className="w-full emerald-gradient py-3 rounded-xl font-bold text-sm emerald-glow mt-2 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin size={18}" /> : (isLogin ? 'Sign In' : 'Create Account')}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

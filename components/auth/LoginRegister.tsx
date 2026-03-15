import { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Eye, EyeOff } from 'lucide-react';

export default function LoginRegister({ onLogin }: { onLogin: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mobile-container justify-center p-6 relative">
      {/* Radial Glow Background */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" 
      />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-1.5 h-1.5 bg-primary rounded-full"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 20}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center mb-8"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mb-4 emerald-glow"
          >
            <Zap className="text-primary w-8 h-8" />
          </motion.div>
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

          <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-4">
            {!isLogin && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="space-y-4 overflow-hidden"
              >
                <div>
                  <input type="text" placeholder="Full Name" className="w-full bg-bg-surface border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" required />
                </div>
                <div className="flex gap-3">
                  <input type="text" placeholder="Room No." className="w-1/3 bg-bg-surface border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" required />
                  <select defaultValue="" className="w-2/3 bg-bg-surface border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors appearance-none text-text-muted" required>
                    <option value="" disabled>Select Hostel</option>
                    <option value="h1">Hostel 1</option>
                    <option value="h2">Hostel 2</option>
                    <option value="h3">Hostel 3</option>
                  </select>
                </div>
              </motion.div>
            )}
            
            <div>
              <input type="email" placeholder="Email Address" className="w-full bg-bg-surface border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" required />
            </div>
            
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
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

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer">
                  <input type="checkbox" className="rounded border-glass-border bg-bg-surface text-primary focus:ring-primary focus:ring-offset-bg-base" />
                  Remember Me
                </label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot Password?</a>
              </div>
            )}

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="w-full emerald-gradient py-3 rounded-xl font-bold text-sm emerald-glow mt-2"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </motion.button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="h-px bg-glass-border flex-1" />
            <span className="text-xs text-text-muted">OR</span>
            <div className="h-px bg-glass-border flex-1" />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button" 
            className="w-full mt-6 bg-bg-surface border border-glass-border py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-bg-surface/80 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Copy, UploadCloud, Wallet, CheckCircle2, Clock } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function PaymentPortal({ onBack, hostName, upiId, amount, orderStatus }: { 
  onBack: () => void,
  hostName: string,
  upiId: string,
  amount: number,
  orderStatus: string
}) {
  const [copied, setCopied] = useState(false);
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(hostName)}&am=${amount}&cu=INR`;

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel px-6 py-4 flex items-center gap-4 border-b-0 sticky top-0 z-30"
      >
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-bg-surface border border-glass-border flex items-center justify-center text-text-muted hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">Payment Portal</h1>
      </motion.div>

      <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
        {/* Status Badge */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center mb-8 gap-3"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            orderStatus === 'delivered' ? 'bg-primary/10 border-primary/20 text-primary' :
            orderStatus === 'accepted' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
            'bg-amber-500/10 border-amber-500/20 text-amber-500'
          }`}>
            {orderStatus === 'delivered' && <span className="w-2 h-2 rounded-full bg-primary animate-ping" />}
            <span className={`w-2 h-2 rounded-full ${
              orderStatus === 'delivered' ? 'bg-primary' :
              orderStatus === 'accepted' ? 'bg-emerald-500' :
              'bg-amber-500'
            }`} />
            {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
          </div>
          <p className="text-xs text-text-muted">Paying to <span className="text-white font-bold">{hostName}</span></p>
        </motion.div>

        {/* QR Code Card */}
        {orderStatus === 'pending' ? (
          <div className="flex flex-col items-center py-10 glass-card mx-6">
            <Clock className="text-amber-500 mb-2" size={32} />
            <p className="text-sm font-medium">Awaiting Host Approval</p>
            <p className="text-xs text-text-muted text-center px-4 mt-2">
              Once the host accepts your request, you'll be able to pay from here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center mb-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-4 rounded-2xl emerald-glow mb-4 relative"
            >
              <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center p-2">
                <QRCode 
                  value={upiUrl}
                  size={180}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  viewBox={`0 0 256 256`}
                />
                <div className="absolute inset-x-0 -bottom-2 flex justify-center">
                  <div className="bg-white px-3 py-1 rounded-full shadow-lg border border-glass-border">
                    <span className="font-bold text-black text-xs">₹{amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
            <button className="text-sm font-medium text-primary hover:underline">Save QR to Gallery</button>
          </div>
        )}

        {/* UPI ID Row */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-bg-surface flex items-center justify-center">
              <Wallet size={18} className="text-primary" />
            </div>
            <div>
              <div className="text-xs text-text-muted mb-0.5">UPI ID</div>
              <div className="font-medium text-sm">{upiId}</div>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="bg-bg-surface border border-glass-border px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-bg-surface/80 transition-colors"
          >
            {copied ? <CheckCircle2 size={14} className="text-primary" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy ID'}
          </motion.button>
        </motion.div>

        {/* Upload Proof */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-bold mb-3 text-text-muted uppercase tracking-wider">Upload Payment Proof</h3>
          <motion.div 
            whileHover={{ scale: 1.01, borderColor: 'rgba(16, 185, 129, 0.3)' }}
            className="border-2 border-dashed border-glass-border rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer bg-bg-surface/50"
          >
            <div className="w-12 h-12 rounded-full bg-bg-surface flex items-center justify-center mb-3">
              <UploadCloud size={24} className="text-primary" />
            </div>
            <p className="font-medium text-sm mb-1">Upload Screenshot</p>
            <p className="text-xs text-text-muted mb-4">JPG, PNG up to 5MB</p>
            <button className="bg-bg-surface border border-glass-border px-4 py-2 rounded-xl text-xs font-medium hover:bg-bg-surface/80 transition-colors">
              Select File
            </button>
          </motion.div>
        </motion.div>

        <p className="text-center text-xs text-text-muted mt-8">
          Payments verified within 2-4 hours.
        </p>
      </div>
    </div>
  );
}

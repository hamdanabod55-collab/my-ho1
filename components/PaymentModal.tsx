"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, CheckCircle, Send, Key, X } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [copied, setCopied] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const USDT_WALLET = "0x1234567890abcdef1234567890abcdef12345678";

  const handleCopy = () => {
    navigator.clipboard.writeText(USDT_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeem = async () => {
    if (!activationCode) return;
    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: activationCode })
      });
      
      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid code');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050a14]/90 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg"
          >
            <GlassCard className="!p-8 relative border-[#E11D48] shadow-[0_0_30px_rgba(225,29,72,0.1)]">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5"/>
              </button>
              
              <div className="text-center mb-8 border-b border-white/5 pb-6">
                <h2 className="text-3xl font-serif text-[#E11D48] mb-2 uppercase tracking-widest">Premium Plan</h2>
                <div className="flex items-center justify-center gap-2 mt-4 text-white">
                  <span className="text-4xl font-bold">$1</span>
                  <span className="text-gray-400">/ month</span>
                </div>
                <p className="text-gray-400 text-sm mt-3 font-sans">Full access to exclusive cinematic experiences</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2 font-medium uppercase tracking-wider">Plan Options:</label>
                  
                  {/* Step 1: USDT Payment */}
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-4 hover:border-[#E11D48]/50 transition-colors">
                    <p className="text-sm text-gray-300 font-medium mb-3">Pay via USDT/Crypto (TRC20 / ERC20)</p>
                    <div className="flex items-center gap-2 bg-black/50 p-3 rounded-lg border border-white/10">
                      <code className="text-sm truncate flex-1 text-gray-400">{USDT_WALLET}</code>
                      <button 
                        onClick={handleCopy}
                        className="p-2 hover:bg-white/10 rounded-md transition-colors"
                        title="Copy Address"
                      >
                        {copied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-[#E11D48]" />}
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Verification */}
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-4 hover:border-blue-500/30 transition-colors">
                    <p className="text-sm text-gray-300 font-medium mb-3">Manual Verification</p>
                    <a 
                      href="https://t.me/your_support_handle" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-[#1e2a47] hover:bg-[#2a3b61] text-white p-3 rounded-lg transition-colors border border-blue-500/30 font-medium"
                    >
                      <Send className="w-5 h-5" />
                      Verify Payment via Telegram
                    </a>
                  </div>

                  {/* Step 3: Redemption */}
                  <div className="pt-4 border-t border-white/10">
                    <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider">Received an Activation Code?</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E11D48]" />
                        <input 
                          type="text" 
                          value={activationCode}
                          onChange={(e) => setActivationCode(e.target.value)}
                          placeholder="Enter Code" 
                          className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#E11D48] transition-colors"
                        />
                      </div>
                      <button 
                        onClick={handleRedeem}
                        disabled={isSubmitting || !activationCode}
                        className="bg-[#E11D48] text-white px-6 py-3 rounded-lg hover:bg-[#be183c] transition-colors disabled:opacity-50 font-medium tracking-wide uppercase"
                      >
                        {isSubmitting ? '...' : 'Unlock'}
                      </button>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

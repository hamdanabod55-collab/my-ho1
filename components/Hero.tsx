"use client";

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useState } from 'react';
import { PaymentModal } from './PaymentModal';

export function Hero({ isSubscribed }: { isSubscribed: boolean }) {
  const [showModal, setShowModal] = useState(false);

  const handlePlayClick = () => {
    if (!isSubscribed) {
      setShowModal(true);
    } else {
      window.location.href = '/watch/main';
    }
  };

  return (
    <>
      <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] via-[#050a14]/80 to-transparent" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 animate-pulse">
              The Midnight Society
            </h1>
            <p className="text-xl text-gray-300 font-sans mb-12">
              Exclusive premiere. Unlock to reveal the secrets hidden in the dark.
            </p>

            {/* Pulsing Play Button */}
            <button 
              onClick={handlePlayClick}
              className="relative group inline-flex items-center justify-center"
            >
              <div className="absolute bg-[#E11D48] rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50 inset-0 group-hover:scale-110"></div>
              <div className="relative flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-md rounded-full border border-[#E11D48] text-white hover:bg-[#E11D48]/20 transition-all duration-300">
                <Play className="w-10 h-10 ml-2" fill="currentColor" />
              </div>
            </button>
            {!isSubscribed && (
              <p className="mt-4 text-sm tracking-widest uppercase text-[#E11D48] font-semibold">
                Locked
              </p>
            )}
          </motion.div>
        </div>
      </div>
      
      <PaymentModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onSuccess={() => window.location.reload()} 
      />
    </>
  );
}

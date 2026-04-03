import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', animate = false }) => {
  const baseClasses = "glass-card p-6 overflow-hidden relative";
  
  if (animate) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${baseClasses} ${className}`}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
};

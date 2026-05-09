import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  const [show, setShow] = useState(false);

  const positions: Record<string, React.CSSProperties> = {
    top:    { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
    bottom: { top: 'calc(100% + 8px)',    left: '50%', transform: 'translateX(-50%)' },
    left:   { right: 'calc(100% + 8px)',  top: '50%',  transform: 'translateY(-50%)' },
    right:  { left: 'calc(100% + 8px)',   top: '50%',  transform: 'translateY(-50%)' },
  };

  const origins: Record<string, string> = {
    top: 'bottom center', bottom: 'top center',
    left: 'center right', right: 'center left',
  };

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'absolute',
              ...positions[side],
              zIndex: 999, pointerEvents: 'none',
              background: 'rgba(6,7,10,0.97)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, padding: '0.4rem 0.75rem',
              fontSize: '0.72rem', fontWeight: 500, color: '#CBD5E1',
              whiteSpace: 'nowrap',
              boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
              transformOrigin: origins[side],
              backdropFilter: 'blur(16px)',
            }}>
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

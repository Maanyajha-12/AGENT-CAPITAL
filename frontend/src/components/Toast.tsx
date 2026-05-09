import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toast: (type: ToastType, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export const useToast = () => useContext(ToastContext);

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLORS = {
  success: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', icon: '#10B981' },
  error:   { bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)',  icon: '#EF4444' },
  warning: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', icon: '#F59E0B' },
  info:    { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', icon: '#3B82F6' },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const remove = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.625rem', maxWidth: 360 }}>
        <AnimatePresence>
          {toasts.map(t => {
            const Icon = ICONS[t.type];
            const col = COLORS[t.type];
            return (
              <motion.div key={t.id}
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{ background: 'rgba(8,12,24,0.97)', border: `1px solid ${col.border}`, borderLeft: `3px solid ${col.icon}`, borderRadius: 14, padding: '0.875rem 1rem', backdropFilter: 'blur(24px)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: col.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} style={{ color: col.icon }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#F8FAFC', marginBottom: t.message ? '0.2rem' : 0 }}>{t.title}</div>
                  {t.message && <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.5 }}>{t.message}</div>}
                </div>
                <button onClick={() => remove(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: '0.1rem', flexShrink: 0 }}>
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonProps) {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width, height, borderRadius,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 100%)',
        backgroundSize: '200% 100%',
        ...style,
      }}
    />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="metric-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
        <Skeleton width={80} height={12} />
        <Skeleton width={32} height={32} borderRadius={9} />
      </div>
      <Skeleton width={120} height={32} borderRadius={6} style={{ marginBottom: '0.5rem' }} />
      <Skeleton width={100} height={12} />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }, (_, i) => (
        <td key={i} style={{ padding: '0.875rem 1rem' }}>
          <Skeleton height={14} width={i === 0 ? 140 : i === cols - 1 ? 60 : 80} />
        </td>
      ))}
    </tr>
  );
}

export function CardSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div className="card" style={{ padding: '1.375rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <Skeleton width={140} height={16} style={{ marginBottom: 8 }} />
          <Skeleton width={100} height={12} />
        </div>
        <Skeleton width={80} height={28} borderRadius={99} />
      </div>
      <Skeleton height={height} borderRadius={12} />
    </div>
  );
}

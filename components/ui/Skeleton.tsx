import { ReactNode } from 'react';

type SkeletonVariant = 'text' | 'circle' | 'rect' | 'card';

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string;
  height?: string;
  className?: string;
  children?: ReactNode;
}

const variantClasses: Record<SkeletonVariant, string> = {
  text: 'h-4 rounded',
  circle: 'rounded-full',
  rect: 'rounded-lg',
  card: 'rounded-xl',
};

export default function Skeleton({ variant = 'rect', width, height, className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-slate-700/50 ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

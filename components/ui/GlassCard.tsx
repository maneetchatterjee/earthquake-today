'use client';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function GlassCard({ children, className = '', onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.08)] hover:bg-white/[0.08] hover:shadow-[0_0_40px_rgba(0,255,255,0.15)] transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

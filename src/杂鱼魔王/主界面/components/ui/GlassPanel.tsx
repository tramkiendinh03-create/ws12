import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  variant?: 'dark' | 'light' | 'crimson' | 'gold';
  hoverEffect?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ 
  children, 
  className = '', 
  title, 
  icon,
  variant = 'dark',
  hoverEffect = false
}) => {
  const baseStyles = "relative overflow-hidden backdrop-blur-xl border rounded-xl transition-all duration-300 flex flex-col";
  
  const variants = {
    dark: "bg-void-900/70 border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.6)] bg-gradient-to-b from-white/5 to-transparent",
    light: "bg-void-800/50 border-white/10 shadow-lg",
    crimson: "bg-gradient-to-br from-crimson-900/30 to-black/60 border-crimson-500/30 shadow-[0_0_20px_rgba(160,26,53,0.15)]",
    gold: "bg-gradient-to-br from-gold-900/10 to-black/60 border-gold-500/20 shadow-[0_0_20px_rgba(255,215,0,0.1)]"
  };

  const hoverStyles = hoverEffect ? "hover:border-white/20 hover:shadow-[0_0_25px_rgba(255,255,255,0.05)] hover:-translate-y-0.5" : "";

  return (
    <div className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}>
      {/* Top highlight for 3D glass effect */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
      
      {(title || icon) && (
        <div className="relative flex shrink-0 items-center gap-3 border-b border-white/5 bg-black/20 p-4">
          {/* Subtle glow behind title */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-30" />
          
          {icon && <span className={`relative z-10 ${variant === 'crimson' ? 'text-crimson-400' : 'text-gold-400'}`}>{icon}</span>}
          {title && <h3 className="font-display relative z-10 text-sm font-bold tracking-widest text-gray-200 uppercase drop-shadow-md">{title}</h3>}
        </div>
      )}
      
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden p-4">
        {children}
      </div>
    </div>
  );
};
import React from 'react';

interface MetalContainerProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'blue' | 'red' | 'gold';
  title?: string;
  noPadding?: boolean;
}

const MetalContainer: React.FC<MetalContainerProps> = ({ 
  children, 
  className = '', 
  glowColor = 'blue',
  title,
  noPadding = false
}) => {
  const glowStyles = {
    blue: 'shadow-[0_0_15px_rgba(0,243,255,0.3),inset_0_0_20px_rgba(0,243,255,0.05)] border-tech-blue/50',
    red: 'shadow-[0_0_15px_rgba(255,42,109,0.3),inset_0_0_20px_rgba(255,42,109,0.05)] border-neon-alert/50',
    gold: 'shadow-[0_0_15px_rgba(255,215,0,0.3),inset_0_0_20px_rgba(255,215,0,0.05)] border-yellow-500/50',
  };

  const lineGradient = {
    blue: 'from-transparent via-tech-blue to-transparent',
    red: 'from-transparent via-neon-alert to-transparent',
    gold: 'from-transparent via-yellow-500 to-transparent',
  };

  return (
    <div className={`relative rounded-xl bg-metal-dark border border-white/10 overflow-hidden ${glowStyles[glowColor]} ${className}`}>
      {/* Background Texture */}
      <div className="absolute inset-0 bg-brushed-metal opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {/* Futuristic Corners */}
      <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-lg ${glowColor === 'blue' ? 'border-tech-blue' : glowColor === 'red' ? 'border-neon-alert' : 'border-yellow-500'} z-10`} />
      <div className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg ${glowColor === 'blue' ? 'border-tech-blue' : glowColor === 'red' ? 'border-neon-alert' : 'border-yellow-500'} z-10`} />
      <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg ${glowColor === 'blue' ? 'border-tech-blue' : glowColor === 'red' ? 'border-neon-alert' : 'border-yellow-500'} z-10`} />
      <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-lg ${glowColor === 'blue' ? 'border-tech-blue' : glowColor === 'red' ? 'border-neon-alert' : 'border-yellow-500'} z-10`} />

      {/* Title Header */}
      {title && (
        <div className="relative z-20 flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/5 backdrop-blur-sm">
          <span className={`font-display font-bold uppercase tracking-widest text-sm ${glowColor === 'blue' ? 'text-tech-blue' : glowColor === 'red' ? 'text-neon-alert' : 'text-yellow-500'} drop-shadow-md`}>
            {title}
          </span>
          <div className="flex gap-1">
            <div className={`w-2 h-2 rounded-full ${glowColor === 'blue' ? 'bg-tech-blue' : glowColor === 'red' ? 'bg-neon-alert' : 'bg-yellow-500'} animate-pulse`} />
            <div className="w-2 h-2 rounded-full bg-gray-600" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`relative z-10 ${noPadding ? '' : 'p-4'}`}>
        {children}
      </div>

      {/* Decorative scan line overlay */}
      <div className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r ${lineGradient[glowColor]} opacity-50`} />
    </div>
  );
};

export default MetalContainer;
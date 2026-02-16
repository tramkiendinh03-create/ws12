import React from 'react';

interface ProgressBarProps {
  value: number; // -100 to 100 or 0 to 100
  min?: number;
  max?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  biDirectional?: boolean; // For Good/Evil scale
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  min = 0,
  max = 100,
  color = 'bg-tech-blue',
  label,
  showValue = true,
  biDirectional = false,
}) => {
  // Normalize percentage calculation
  let percentage = 0;
  let leftPos = '0%';
  
  if (biDirectional) {
    // Input range -100 to 100. Center is 50%.
    // Value 0 => width 0 at left 50%.
    // Value 100 => width 50% at left 50%.
    // Value -100 => width 50% at left 0%.
    
    const absVal = Math.abs(value);
    const width = (absVal / 100) * 50; // Max width is 50% of container
    percentage = width;
    
    if (value >= 0) {
      leftPos = '50%';
    } else {
      leftPos = `${50 - width}%`;
    }
  } else {
    percentage = ((value - min) / (max - min)) * 100;
  }

  return (
    <div className="w-full mb-3 group">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1 text-xs uppercase tracking-wider font-display">
          <span className="text-gray-400 group-hover:text-white transition-colors">{label}</span>
          {showValue && <span className={`${color.replace('bg-', 'text-')} font-bold`}>{value}</span>}
        </div>
      )}
      
      <div className="relative w-full h-3 bg-black/60 rounded-sm border border-white/10 overflow-hidden shadow-inner">
        {/* Grid lines background */}
        <div className="absolute inset-0 w-full h-full opacity-20" 
             style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '10% 100%' }}>
        </div>

        {biDirectional && (
           <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/30 z-10"></div>
        )}

        <div
          className={`h-full ${color} relative transition-all duration-700 ease-out flex items-center justify-end`}
          style={{ width: `${percentage}%`, left: biDirectional ? leftPos : '0' }}
        >
            {/* Glossy overlay on bar */}
            <div className="absolute top-0 left-0 right-0 h-[50%] bg-white/20"></div>
            {/* Leading edge glow */}
            <div className="h-full w-[2px] bg-white opacity-80 blur-[1px] absolute right-0 top-0"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
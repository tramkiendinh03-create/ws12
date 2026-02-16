import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TechIconProps {
  icon: LucideIcon;
  color?: string;
  size?: number;
  className?: string;
}

const TechIcon: React.FC<TechIconProps> = ({ icon: Icon, color = "text-tech-blue", size = 20, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
        <Icon size={size} className={`${color} relative z-10 drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]`} />
    </div>
  );
};

export default TechIcon;
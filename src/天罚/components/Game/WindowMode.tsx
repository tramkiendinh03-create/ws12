import React from 'react';

interface WindowModeProps {
    children: React.ReactNode;
    className?: string;
}

const WindowMode: React.FC<WindowModeProps> = ({ children, className = '' }) => {
    return (
        <div className={`w-[400px] shrink-0 pointer-events-auto animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-500 ${className}`}>
             {/* The child component (MetalContainer) provides the visual style. This wrapper handles layout/animation. */}
            {children}
        </div>
    );
};

export default WindowMode;
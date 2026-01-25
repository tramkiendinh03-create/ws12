import { Activity, ChevronDown, ChevronUp, Clock, MapPin, Menu, Target, X } from 'lucide-react';
import React, { useState } from 'react';
import { WorldState } from '../types';
import { GlassPanel } from './ui/GlassPanel';

interface Props {
  world: WorldState;
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export const WorldStatusBar: React.FC<Props> = ({ world, onMenuToggle, isMobileMenuOpen }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex w-full shrink-0 flex-col">
      {/* Main Status Bar */}
      <GlassPanel className="flex w-full items-center justify-between px-4 py-2 md:px-6 md:py-3" variant="dark">
        <div className="flex items-center gap-3 md:gap-6">
          <h1 className="font-display to-crimson-400 shrink-0 bg-gradient-to-r from-purple-400 bg-clip-text text-base font-bold text-transparent md:text-lg">
            深渊王座
          </h1>

          <div className="hidden h-5 w-px bg-white/10 md:block"></div>

          <div className="flex items-center gap-1.5 text-[10px] text-gray-300 md:gap-2 md:text-sm">
            <Clock size={14} className="text-gold-500 shrink-0" />
            <span className="truncate font-serif tracking-wide">{world.time}</span>
          </div>

          <div className="hidden h-5 w-px bg-white/10 md:block"></div>

          <div className="hidden items-center gap-2 text-sm text-gray-300 md:flex">
            <Activity size={14} className="text-crimson-500 shrink-0" />
            <span className="hidden lg:inline">魔族国力:</span>
            <span className="text-crimson-400 font-bold">{world.demonRealmPower.value}</span>
            <span className="max-w-[80px] truncate text-xs text-gray-500 lg:max-w-none">({world.demonRealmPower.description})</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Status for Power (Icon only) */}
          <div className="text-crimson-400 flex items-center gap-1 md:hidden">
            <Activity size={14} />
            <span className="text-[10px] font-bold">{world.demonRealmPower.value}</span>
          </div>

          {/* Expand Button for Location Info */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 rounded-md border border-purple-500/30 bg-purple-900/20 px-2 py-1 text-[10px] text-purple-300 transition-all hover:border-purple-400/50 hover:bg-purple-900/40 md:text-xs"
          >
            <MapPin size={12} />
            <span className="hidden md:inline">位置详情</span>
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {/* Mobile Menu Button */}
          <button onClick={onMenuToggle} className="p-1 text-gray-300 transition-colors hover:text-white md:hidden">
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </GlassPanel>

      {/* Expanded Location Info Panel */}
      {isExpanded && (
        <div className="animate-in slide-in-from-top-2 fade-in bg-void-900/95 border-x border-b border-white/10 px-4 py-3 backdrop-blur-xl duration-200 md:px-6">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {/* 当前地点 */}
            <div className="group relative overflow-hidden rounded-lg border border-purple-500/20 bg-gradient-to-r from-purple-900/30 to-transparent p-3 transition-all hover:border-purple-400/40">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <MapPin size={32} />
              </div>
              <div className="relative z-10">
                <div className="mb-1.5 flex items-center gap-2">
                  <MapPin size={12} className="text-purple-400" />
                  <span className="text-[10px] font-bold tracking-widest text-purple-300 uppercase">当前地点</span>
                </div>
                <p className="text-xs leading-relaxed text-gray-200 md:text-sm">
                  {world.currentLocation}
                </p>
              </div>
              {/* 装饰性光晕 */}
              <div className="pointer-events-none absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-purple-500/10 blur-xl"></div>
            </div>

            {/* 当前交互目标 */}
            <div className="group border-crimson-500/20 from-crimson-900/30 relative overflow-hidden rounded-lg border bg-gradient-to-r to-transparent p-3 transition-all hover:border-crimson-400/40">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Target size={32} />
              </div>
              <div className="relative z-10">
                <div className="mb-1.5 flex items-center gap-2">
                  <Target size={12} className="text-crimson-400" />
                  <span className="text-crimson-300 text-[10px] font-bold tracking-widest uppercase">交互目标</span>
                </div>
                <p className="text-xs leading-relaxed text-gray-200 md:text-sm">
                  {world.currentInteractionTarget}
                </p>
              </div>
              {/* 装饰性光晕 */}
              <div className="bg-crimson-500/10 pointer-events-none absolute -right-4 -bottom-4 h-16 w-16 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { Villain, ThreatLevel } from '../../types';
import MetalContainer from '../UI/MetalContainer';
import ProgressBar from '../UI/ProgressBar';
import { Skull, AlertTriangle, Fingerprint, Activity, Heart, Scale, User, Target, Trash2 } from 'lucide-react';

interface VillainMonitorProps {
  villains: Villain[];
  onDeleteVillain?: (id: string) => void;
}

const VillainMonitor: React.FC<VillainMonitorProps> = ({ villains, onDeleteVillain }) => {
  const [selectedId, setSelectedId] = useState<string>(villains[0]?.id || "");

  // Auto-select first available if current selection is deleted
  useEffect(() => {
    if (!villains.find(v => v.id === selectedId) && villains.length > 0) {
        setSelectedId(villains[0].id);
    }
  }, [villains, selectedId]);

  const selectedVillain = villains.find(v => v.id === selectedId);
  
  const getThreatColor = (level: ThreatLevel) => {
      if (['SS', 'SSS'].includes(level)) return 'text-neon-alert drop-shadow-[0_0_8px_rgba(255,42,109,0.8)]';
      if (['S', 'A'].includes(level)) return 'text-orange-500';
      return 'text-yellow-400';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[480px]">
        
        {/* Column 1: Target List (Scrollable) */}
        <MetalContainer className="lg:col-span-1 h-full flex flex-col" glowColor="red" title="反派列表" noPadding>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {villains.map((villain) => {
                    const isSelected = villain.id === selectedId;
                    return (
                        <div 
                            key={villain.id}
                            onClick={() => setSelectedId(villain.id)}
                            className={`
                                relative p-3 rounded-lg border cursor-pointer transition-all duration-200 group
                                ${isSelected 
                                    ? 'bg-neon-alert/10 border-neon-alert/50 shadow-[0_0_10px_rgba(255,42,109,0.2)]' 
                                    : 'bg-black/40 border-white/5 hover:bg-white/5 hover:border-white/20'
                                }
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden border border-white/10">
                                        <img src={villain.avatarUrl} alt={villain.姓名} className="w-full h-full object-cover" />
                                    </div>
                                    <div className={`absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-black border text-[10px] font-bold ${getThreatColor(villain.威胁度)} border-current`}>
                                        {villain.威胁度}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`text-sm font-bold truncate mb-1 ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                        {villain.姓名}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-1.5 py-[1px] rounded text-[10px] font-bold border ${isSelected ? 'bg-white/20 border-white/30 text-white' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                                            等级 {villain.等级}
                                        </span>
                                        <span className="text-[10px] text-gray-500 truncate">{villain.种族}</span>
                                    </div>
                                </div>
                                {isSelected && <Target size={16} className="text-neon-alert animate-pulse" />}
                                
                                {onDeleteVillain && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onDeleteVillain(villain.id); }}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-500 transition-all absolute right-2 top-2"
                                        title="删除目标"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
                {villains.length === 0 && (
                     <div className="text-center py-10 text-gray-600 text-xs">没有探测到目标</div>
                )}
            </div>
            {/* Footer / Count */}
            <div className="p-3 bg-black/40 border-t border-white/5 text-center text-[10px] text-gray-500 tracking-widest font-bold">
                已探测目标数: {villains.length}
            </div>
        </MetalContainer>

        {/* Column 2 & 3: Detailed Monitor */}
        <MetalContainer className="lg:col-span-2 h-full overflow-y-auto custom-scrollbar" glowColor="red" title="反派详细信息">
             {selectedVillain ? (
             <div className="space-y-6">
                
                {/* Header Info */}
                <div className="flex items-start gap-6 p-5 bg-white/5 rounded-xl border border-white/5 relative overflow-hidden group">
                    {/* Giant Watermark Level Number */}
                    <div className="absolute -top-4 -right-2 opacity-5 font-display font-black text-9xl text-white pointer-events-none select-none">
                        {selectedVillain.等级}
                    </div>

                    <div className="relative w-24 h-24 shrink-0 hidden sm:block">
                         <img src={selectedVillain.avatarUrl} alt={selectedVillain.姓名} className="w-full h-full object-cover rounded-lg border-2 border-[#2c2e33]" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                         
                         {/* Prominent Level Badge */}
                         <div className="absolute -bottom-2 -right-2 bg-[#09090b] border border-tech-blue text-tech-blue px-2 py-0.5 rounded text-xs font-display font-bold shadow-[0_0_10px_rgba(0,243,255,0.4)] z-10 flex items-center gap-1">
                            <span className="text-[10px] opacity-70">LV.</span>{selectedVillain.等级}
                         </div>
                    </div>
                    
                    <div className="flex-1 space-y-3 relative z-10">
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-2xl font-display font-bold text-white tracking-wide">{selectedVillain.姓名}</h2>
                            <span className={`px-2 py-0.5 rounded bg-black border text-xs font-bold ${getThreatColor(selectedVillain.威胁度)} border-current opacity-90`}>
                                威胁度: {selectedVillain.威胁度}
                            </span>
                        </div>
                        
                        <div className="text-xs text-gray-400 font-bold flex flex-wrap gap-4 items-center">
                            <span className="bg-white/5 px-2 py-1 rounded">编号: {selectedVillain.id.toUpperCase()}</span>
                            <span>{selectedVillain.身份}</span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span>{selectedVillain.种族}</span>
                        </div>
                        
                        <div className="flex gap-4 text-xs text-gray-500 pt-1">
                             <div className="flex items-center gap-1.5 text-orange-400/80"><AlertTriangle size={12}/> 建议谨慎接触</div>
                        </div>
                    </div>
                </div>

                {/* Status Blocks */}
                <div className="grid grid-cols-1 gap-4">
                     {/* Temp State */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-neon-alert text-xs font-bold uppercase tracking-wider">
                            <Activity size={14} /> 临时状态
                        </div>
                        <div className="p-4 bg-neon-alert/5 border-l-2 border-neon-alert rounded-r text-sm text-gray-300 italic">
                            "{selectedVillain.临时状态}"
                        </div>
                    </div>

                    {/* Attitude */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
                            <Fingerprint size={14} /> 对圣裁官的态度
                        </div>
                        <div className="p-4 bg-orange-500/5 border-l-2 border-orange-500 rounded-r text-sm text-gray-300">
                            {selectedVillain.对圣裁官的态度}
                        </div>
                    </div>
                </div>
                
                {/* Bars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                    <div>
                         <div className="flex justify-between items-center mb-1">
                             <div className="flex items-center gap-2 text-xs font-bold text-pink-500">
                                 <Heart size={12} /> 好感度
                             </div>
                             <span className="text-xs font-bold text-white">{selectedVillain.好感度}/100</span>
                         </div>
                         <ProgressBar value={selectedVillain.好感度} showValue={false} color="bg-pink-500" />
                    </div>

                    <div>
                         <div className="flex justify-between items-center mb-1">
                             <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                                 <Scale size={12} /> 善恶值
                             </div>
                             <span className="text-xs font-bold text-white">{selectedVillain.善恶值}</span>
                         </div>
                         <ProgressBar value={selectedVillain.善恶值} min={-100} max={100} showValue={false} biDirectional color={selectedVillain.善恶值 >= 0 ? 'bg-blue-500' : 'bg-red-500'} />
                         <div className="flex justify-between text-[10px] text-gray-600 mt-1 uppercase font-bold">
                             <span>恶</span>
                             <span>善</span>
                         </div>
                    </div>
                </div>

             </div>
             ) : (
                <div className="h-full flex items-center justify-center text-gray-600 flex-col gap-2">
                    <Skull size={40} className="opacity-20" />
                    <span>无选定目标</span>
                </div>
             )}
        </MetalContainer>
    </div>
  );
};

export default VillainMonitor;

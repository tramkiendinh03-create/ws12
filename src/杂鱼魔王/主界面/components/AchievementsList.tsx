import React from 'react';
import { Achievement } from '../types';
import { GlassPanel } from './ui/GlassPanel';
import { Trophy, Star } from 'lucide-react';

interface Props {
  achievements: Achievement[];
}

export const AchievementsList: React.FC<Props> = ({ achievements }) => {
  return (
    <GlassPanel className="flex h-full flex-col" variant="gold" title="荣耀之路" icon={<Trophy size={16} />}>
      <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto p-2 pr-1">
        {achievements.length === 0 ? (
          <div className="text-gold-500/40 flex h-full flex-col items-center justify-center space-y-3 italic">
            <Trophy size={48} strokeWidth={1} />
            <span className="font-serif">暂无传奇记录</span>
          </div>
        ) : (
          achievements.map(ach => (
            <div
              key={ach.id}
              className="to-void-900/60 border-gold-500/10 group relative rounded-lg border bg-gradient-to-br from-black/60 p-4 transition-all duration-300 hover:border-gold-500/40 hover:shadow-[0_0_15px_rgba(234,179,8,0.1)]"
            >
              <div className="pl-2">
                {/* Header */}
                <div className="mb-2 flex items-start justify-between">
                  <h4 className="text-gold-400 font-display flex items-center gap-2 text-sm font-bold tracking-wide group-hover:text-gold-200">
                    <Star size={10} className="fill-gold-500 text-gold-500" />
                    {ach.title}
                  </h4>
                  <span className="font-mono text-[9px] tracking-tighter text-gray-600 uppercase opacity-70">
                    {new Date(ach.timestamp).toLocaleDateString()}
                  </span>
                </div>

                {/* Description */}
                <p className="mb-3 border-l border-white/5 pl-4 font-serif text-xs leading-relaxed text-gray-400">
                  {ach.description}
                </p>

                {/* Reward Badge */}
                <div className="ml-4 flex w-fit items-center gap-2 rounded border border-green-500/20 bg-green-950/30 px-3 py-1.5 text-[10px] text-green-300/90 shadow-inner">
                  <span className="text-green-500">❖</span>{' '}
                  <span className="font-mono tracking-tight">{ach.reward}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </GlassPanel>
  );
};

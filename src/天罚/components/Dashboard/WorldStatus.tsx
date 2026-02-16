
import { Database, Flag, Globe, Target, Zap } from 'lucide-react';
import React from 'react';
import { WorldState } from '../../types';
import MetalContainer from '../UI/MetalContainer';
import ProgressBar from '../UI/ProgressBar';

interface WorldStatusProps {
  world: WorldState;
}

const WorldStatus: React.FC<WorldStatusProps> = ({ world }) => {
  return (
    <div className="grid h-[480px] grid-cols-1 gap-6 md:grid-cols-2">

      {/* Left Column: Planetary Analysis */}
      <MetalContainer title="世界信息" glowColor="blue" className="relative flex h-full flex-col overflow-hidden">
        {/* Background Decor */}
        <div className="pointer-events-none absolute top-0 right-0 p-10 opacity-5">
          <Globe size={200} />
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center space-y-6">

          {/* World Card */}
          <div className="to-tech-blue/5 border-tech-blue/20 group relative rounded-xl border bg-gradient-to-br from-black/60 p-6 shadow-[0_0_20px_rgba(0,243,255,0.05)] transition-colors hover:border-tech-blue/40">
            <div className="absolute top-3 right-3 flex gap-1.5">
              <div className="bg-tech-blue h-1.5 w-1.5 animate-ping rounded-full"></div>
              <div className="bg-tech-blue h-1.5 w-1.5 rounded-full"></div>
            </div>

            <div className="text-tech-blue font-display mb-2 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase opacity-80">
              <Database size={12} /> 当前任务世界名称
            </div>
            <div className="font-display mb-2 text-3xl font-bold tracking-wide text-white drop-shadow-[0_0_10px_rgba(0,243,255,0.3)] md:text-4xl">
              {world.当前任务世界名称}
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-tech-blue/10 border-tech-blue/30 text-tech-blue rounded border px-2 py-1 text-[10px] font-bold tracking-wider uppercase">
                {world.世界类型与基调}
              </span>
            </div>
          </div>

          {/* Stats Single Block */}
          <div className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-5 transition-colors hover:bg-white/10">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-2 text-yellow-500 transition-colors group-hover:border-yellow-500/50">
                <Flag size={20} />
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-wider text-gray-400 uppercase transition-colors group-hover:text-yellow-500">
                  已净化世界数
                </div>
                <div className="text-xs text-gray-500">
                  PURIFIED WORLDS
                </div>
              </div>
            </div>
            <div className="font-display text-4xl font-bold text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.3)]">
              {world.已净化世界数}
            </div>
          </div>

          {/* Purification Process */}
          <div className="mt-auto border-t border-white/10 pt-6">
            <div className="mb-3 flex items-end justify-between">
              <div className="flex flex-col">
                <span className="flex items-center gap-2 text-xs font-bold text-white">
                  <Zap size={14} className="text-tech-blue" />
                  当前世界净化度
                </span>
                <span className="mt-0.5 text-[10px] text-gray-500">正在覆写世界法则代码...</span>
              </div>
              <span className="font-display text-tech-blue text-2xl font-bold drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">{world.当前世界净化度}%</span>
            </div>
            <ProgressBar
              value={world.当前世界净化度}
              max={100}
              showValue={false}
              color="bg-gradient-to-r from-blue-600 to-tech-blue"
            />
          </div>
        </div>
      </MetalContainer>

      {/* Right Column: Tactical Briefing */}
      <MetalContainer title="任务信息" glowColor="red" className="relative flex h-full flex-col">
        <div className="flex h-full flex-col">

          {/* Mission Main Block - Now takes full height */}
          <div className="group relative flex flex-1 flex-col">
            <div className="bg-neon-alert/5 border-neon-alert/20 absolute inset-0 rounded-xl border transition-colors duration-500 group-hover:bg-neon-alert/10"></div>

            {/* Corner Accents */}
            <div className="border-neon-alert absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 opacity-50"></div>
            <div className="border-neon-alert absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 opacity-50"></div>
            <div className="border-neon-alert absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 opacity-50"></div>
            <div className="border-neon-alert absolute right-0 bottom-0 h-3 w-3 border-r-2 border-b-2 opacity-50"></div>

            <div className="relative flex h-full flex-col p-6">
              <div className="border-neon-alert/20 mb-6 flex items-center justify-between border-b pb-4">
                <div className="text-neon-alert flex items-center gap-2">
                  <Target size={20} className="animate-pulse" />
                  <span className="font-display text-base font-bold tracking-widest">任务</span>
                </div>
                <div className="bg-neon-alert/20 border-neon-alert/40 text-neon-alert animate-pulse rounded border px-2 py-1 text-[10px] font-bold">
                  执行中 · IN PROGRESS
                </div>
              </div>

              <div className="custom-scrollbar flex-1 overflow-y-auto">
                <p className="font-sans text-base leading-loose font-medium text-gray-200">
                  {world.任务}
                </p>

              </div>
            </div>
          </div>

          {/* Status Footer */}
          <div className="flex items-center justify-between px-1 pt-3 text-[10px] tracking-widest text-gray-500 uppercase">
            <span>任务状态: <span className="text-gray-300">进行中</span></span>
            <span className="flex items-center gap-1.5"><div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div> 录制中 (REC)</span>
          </div>

        </div>
      </MetalContainer>
    </div>
  );
};

export default WorldStatus;

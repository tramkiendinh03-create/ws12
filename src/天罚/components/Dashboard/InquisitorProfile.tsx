
import { Activity, Biohazard, Briefcase, Check, Coins, Crown, ScanLine, Settings, Shield, Trash2, User, X } from 'lucide-react';
import React, { useState } from 'react';
import { MODES_DESCRIPTION } from '../../constants';
import { GameMode, Inquisitor } from '../../types';
import MetalContainer from '../UI/MetalContainer';
import ProgressBar from '../UI/ProgressBar';

interface InquisitorProfileProps {
  inquisitor: Inquisitor;
  activeModes: GameMode[];
  onToggleMode?: (mode: GameMode) => void;
  onDeleteTitle?: (index: number) => void;
  onDeleteItem?: (index: number) => void;
}

type SubTab = 'status' | 'inventory' | 'modes';

const InquisitorProfile: React.FC<InquisitorProfileProps> = ({
  inquisitor,
  activeModes,
  onToggleMode,
  onDeleteTitle,
  onDeleteItem
}) => {
  const [activeTab, setActiveTab] = useState<SubTab>('status');

  return (
    <div className="grid h-[480px] grid-cols-1 gap-6 lg:grid-cols-3">

      {/* Left Col: Core Stats (Persistent) */}
      <MetalContainer title="圣裁官核心数据" glowColor="gold" className="relative flex h-full flex-col overflow-hidden lg:col-span-1">
        {/* Background Decor */}
        <div className="pointer-events-none absolute top-0 left-0 flex h-full w-full items-center justify-center opacity-5">
          <User size={300} />
        </div>

        <div className="relative z-10 flex h-full flex-col">
          <div className="mt-4 shrink-0 text-center">
            <div className="relative mb-4 inline-block">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-yellow-500 bg-gray-900 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                <User size={48} className="text-gray-500" />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded border border-yellow-500 bg-black px-3 py-1 text-xs font-bold whitespace-nowrap text-yellow-500 shadow-lg">
                LV.{inquisitor.等级}
              </div>
            </div>

            <h2 className="font-display mb-1 text-2xl font-bold tracking-wide text-white">{inquisitor.圣裁官姓名}</h2>
            <div className="text-xs tracking-widest text-gray-500 uppercase">{inquisitor.身份} | {inquisitor.性别}</div>
          </div>

          <div className="mt-8 flex min-h-0 flex-1 flex-col space-y-6">
            <div className="shrink-0">
              <div className="mb-1 flex justify-between text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                <span>经验值</span>
                <span>{inquisitor.经验值}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-sm border border-white/5 bg-gray-800">
                <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400" style={{ width: `${inquisitor.经验值}%` }}></div>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-between rounded-r-lg border-l-4 border-yellow-500 bg-gradient-to-r from-yellow-500/10 to-transparent p-4">
              <div className="flex items-center gap-3 text-sm font-bold text-yellow-500">
                <div className="rounded bg-yellow-500/20 p-1.5"><Coins size={16} /></div>
                善升点
              </div>
              <span className="font-display text-xl font-bold text-white drop-shadow-md">{inquisitor.善升点.toLocaleString()}</span>
            </div>

            {/* Corruption Bar - 持久显示（恶堕模式开启时） */}
            {activeModes.includes(GameMode.CORRUPTION) && (
              <div className="shrink-0">
                <ProgressBar value={inquisitor.堕落值} max={100} label="堕落值" color="bg-purple-600" />
              </div>
            )}

            {/* Titles Section - Scrollable if too many */}
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-scroll pr-1">
              <div className="sticky top-0 z-10 mb-3 flex items-center gap-2 bg-[#1a1b1e]/95 py-1 text-[10px] font-bold tracking-widest text-gray-600 uppercase backdrop-blur">
                <span className="h-1 w-1 rounded-full bg-yellow-500"></span> 称号
              </div>

              <div className="space-y-2 pb-2">
                {inquisitor.称号.map((t, i) => (
                  <div key={i} className="group relative">
                    <div className="relative flex items-center justify-between rounded border border-white/5 bg-black/40 p-3 transition-all duration-300 hover:border-yellow-500/40 hover:bg-yellow-500/5">
                      <div className="flex items-center gap-3">
                        <div className="text-yellow-500 opacity-60 transition-opacity group-hover:opacity-100">
                          <Crown size={14} />
                        </div>
                        <span className="text-xs font-bold text-gray-300 transition-colors group-hover:text-yellow-400">{t}</span>
                      </div>
                      {onDeleteTitle && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onDeleteTitle(i); }}
                          className="p-1 opacity-0 transition-all group-hover:opacity-100 hover:text-red-500"
                          title="删除头衔"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {inquisitor.称号.length === 0 && (
                  <div className="py-2 text-center text-xs text-gray-600 italic">暂无称号</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </MetalContainer>

      {/* Right Col: Secondary Menu & Content - Flex layout to fill height */}
      <div className="flex h-full flex-col gap-4 lg:col-span-2">

        {/* Secondary Menu Tabs */}
        <div className="bg-metal-dark flex shrink-0 items-center rounded-xl border border-white/10 p-1.5 shadow-lg">
          <button
            onClick={() => setActiveTab('status')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-xs font-bold tracking-wider uppercase transition-all duration-300
                    ${activeTab === 'status' ? 'bg-tech-blue/20 text-tech-blue border-tech-blue/20 border shadow-[0_0_10px_rgba(0,243,255,0.1)]' : 'border border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
          >
            <Activity size={16} /> <span className="hidden sm:inline">状态</span>
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-xs font-bold tracking-wider uppercase transition-all duration-300
                    ${activeTab === 'inventory' ? 'bg-tech-blue/20 text-tech-blue border-tech-blue/20 border shadow-[0_0_10px_rgba(0,243,255,0.1)]' : 'border border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
          >
            <Briefcase size={16} /> <span className="hidden sm:inline">物品</span>
          </button>
          <button
            onClick={() => setActiveTab('modes')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-xs font-bold tracking-wider uppercase transition-all duration-300
                    ${activeTab === 'modes' ? 'bg-tech-blue/20 text-tech-blue border-tech-blue/20 border shadow-[0_0_10px_rgba(0,243,255,0.1)]' : 'border border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
          >
            <Settings size={16} /> <span className="hidden sm:inline">模式</span>
          </button>
        </div>

        {/* Content Area - Flex-1 to fill remaining space */}
        <div className="relative min-h-0 flex-1">

          {/* STATUS TAB */}
          {activeTab === 'status' && (
            <MetalContainer title="外貌与状态" glowColor="blue" className="flex h-full flex-col">
              <div className="flex min-h-0 flex-1 flex-col gap-4 p-1">

                {/* Appearance Description */}
                <div className="group relative flex max-h-[160px] shrink-0 flex-col overflow-hidden rounded-lg border border-white/10 bg-black/60 p-1">
                  {/* Decor Header */}
                  <div className="flex shrink-0 items-center justify-between border-b border-white/5 bg-white/5 px-3 py-1">
                    <div className="text-tech-blue flex items-center gap-2 font-mono text-[10px]">
                      <ScanLine size={12} className="animate-pulse" /> 外貌描述
                    </div>
                    <div className="flex gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-yellow-500"></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  {/* Terminal Content */}
                  <div className="custom-scrollbar relative overflow-x-hidden overflow-y-scroll p-4 font-mono text-sm leading-relaxed text-gray-300">
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.2)_50%,rgba(0,0,0,0)_50%)] bg-[length:100%_4px] opacity-20"></div>
                    {inquisitor.外貌}
                    <span className="bg-tech-blue ml-1 inline-block h-4 w-2 animate-pulse align-middle"></span>
                  </div>
                </div>

                {/* Status Grid */}
                <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Permanent Buffs */}
                  <div className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-white/5 bg-white/5 p-4">
                    <div className="absolute top-0 right-0 p-2 opacity-10 transition-transform duration-500 group-hover:scale-110"><Shield size={80} /></div>
                    <div className="z-10 mb-2 flex shrink-0 items-center gap-2 text-xs font-bold tracking-wider text-green-500 uppercase">
                      <Activity size={14} /> 永久状态
                    </div>
                    <div className="custom-scrollbar z-10 flex-1 space-y-2 overflow-x-hidden overflow-y-scroll pr-1">
                      {inquisitor.永久状态.map((b, i) => (
                        <div key={i} className="flex shrink-0 items-center justify-between rounded border border-green-500/20 bg-black/40 p-2">
                          <span className="text-xs font-bold text-gray-300">{b}</span>
                          <div className="flex gap-0.5">
                            <div className="h-3 w-1 rounded-sm bg-green-500"></div>
                            <div className="h-3 w-1 rounded-sm bg-green-500/50"></div>
                            <div className="h-3 w-1 rounded-sm bg-green-500/20"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Temp States */}
                  <div className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-white/5 bg-white/5 p-4">
                    <div className="absolute top-0 right-0 p-2 opacity-10 transition-transform duration-500 group-hover:scale-110"><Biohazard size={80} /></div>
                    <div className="z-10 mb-2 flex shrink-0 items-center gap-2 text-xs font-bold tracking-wider text-pink-500 uppercase">
                      <Biohazard size={14} /> 临时状态
                    </div>
                    <div className="custom-scrollbar z-10 flex-1 space-y-2 overflow-x-hidden overflow-y-scroll pr-1">
                      {inquisitor.临时状态.length > 0 ? inquisitor.临时状态.map((b, i) => (
                        <div key={i} className="flex shrink-0 items-center justify-between rounded border border-pink-500/20 bg-black/40 p-2">
                          <span className="text-xs font-bold text-gray-300">{b}</span>
                          <Activity size={12} className="animate-pulse text-pink-500" />
                        </div>
                      )) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-600">
                          <Check size={24} className="opacity-50" />
                          <span className="text-[10px] font-bold">无异常状态</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </MetalContainer>
          )}

          {/* INVENTORY TAB */}
          {activeTab === 'inventory' && (
            <MetalContainer title="物品栏" glowColor="blue" className="flex h-full flex-col">
              <div className="custom-scrollbar grid min-h-0 flex-1 auto-rows-max grid-cols-2 gap-4 overflow-x-hidden overflow-y-scroll p-1">
                {Array.from({ length: Math.max(inquisitor.物品栏.length, 6) }).map((_, i) => {
                  const item = inquisitor.物品栏[i];
                  return (
                    <div key={i} className={`group relative flex flex-col rounded-lg border p-3 transition-all duration-300
                                        ${item
                        ? 'hover:border-tech-blue/50 hover:bg-white/5 border-white/10 bg-black/40'
                        : 'border-dashed border-white/5 bg-transparent opacity-50'
                      }
                                     `}>
                      <div className="mb-2 flex items-start justify-between">
                        <span className="text-[9px] font-bold tracking-widest text-gray-600">槽位_0{i + 1}</span>
                        {item && onDeleteItem && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onDeleteItem(i); }}
                            className="text-gray-600 opacity-0 transition-colors group-hover:opacity-100 hover:text-red-500"
                            title="丢弃物品"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>

                      <div className="flex min-h-[40px] flex-1 items-center gap-3">
                        {item ? (
                          <>
                            <div className="bg-tech-blue/10 text-tech-blue border-tech-blue/20 rounded-md border p-2 transition-all group-hover:shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                              <Briefcase size={20} />
                            </div>
                            <span className="line-clamp-2 text-sm font-bold text-gray-200 group-hover:text-white">{item}</span>
                          </>
                        ) : (
                          <div className="w-full text-center">
                            <span className="text-[10px] font-bold tracking-wider text-gray-700 uppercase">[ 空置 ]</span>
                          </div>
                        )}
                      </div>

                      {item && <div className="border-tech-blue absolute right-0 bottom-0 h-4 w-4 border-r border-b opacity-0 transition-opacity group-hover:opacity-100"></div>}
                    </div>
                  );
                })}
              </div>
            </MetalContainer>
          )}

          {/* MODES TAB */}
          {activeTab === 'modes' && (
            <MetalContainer title="模式选择" glowColor="red" className="flex h-full flex-col">
              <div className="custom-scrollbar h-full space-y-4 overflow-x-hidden overflow-y-scroll p-1">
                {Object.values(GameMode).map((mode) => {
                  const isActive = activeModes.includes(mode);
                  return (
                    <button
                      key={mode}
                      onClick={() => onToggleMode && onToggleMode(mode)}
                      className={`group relative flex w-full gap-4 overflow-hidden rounded-lg border p-5 text-left transition-all duration-300
                                            ${isActive
                          ? 'border-red-500/50 bg-gradient-to-r from-red-900/20 to-black shadow-[0_0_15px_rgba(220,38,38,0.1)]'
                          : 'border-white/5 bg-black/40 hover:border-white/20 hover:bg-white/5'
                        }
                                        `}
                    >
                      <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded border transition-colors ${isActive ? 'border-red-600 bg-red-600 text-black' : 'border-gray-600 bg-black/50'}`}>
                        {isActive ? <Check size={14} strokeWidth={3} /> : <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')]"></div>}
                      </div>

                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <span className={`font-display text-lg font-bold tracking-wide ${isActive ? 'text-white' : 'text-gray-400'}`}>{mode}</span>
                          {isActive && <span className="animate-pulse rounded border border-red-500 bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-500">已激活</span>}
                        </div>
                        <div className="font-mono text-xs leading-relaxed text-gray-500 opacity-80">
                          {MODES_DESCRIPTION[mode]}
                        </div>
                      </div>

                      {isActive && (
                        <div className="pointer-events-none absolute inset-0 rounded-lg border-2 border-red-500/20"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </MetalContainer>
          )}

        </div>
      </div>
    </div>
  );
};

export default InquisitorProfile;

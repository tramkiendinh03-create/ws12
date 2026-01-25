import { Backpack, Crown, Drama, Eye, Info, Shirt, User, Zap, ZoomIn } from 'lucide-react';
import React, { useState } from 'react';
import { PlayerStats as PlayerStatsType } from '../types';
import { ImageModal } from './ImageModal';
import { GlassPanel } from './ui/GlassPanel';

interface Props {
  stats: PlayerStatsType;
}

export const PlayerStats: React.FC<Props> = ({ stats }) => {
  const [activeTab, setActiveTab] = useState<'status' | 'inventory' | 'skills'>('status');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // 将装备栏转换为数组显示
  const equipmentList = Object.entries(stats.equipment)
    .filter(([_, value]) => value && value.trim() !== '')
    .map(([slot, item]) => `${slot}: ${item}`);

  // 将道具栏转换为数组显示
  const itemsList = Object.entries(stats.items)
    .filter(([_, value]) => value && value.trim() !== '')
    .map(([name, desc]) => `${name}: ${desc}`);

  // 将技能转换为数组
  const passiveSkills = Object.entries(stats.skills.passive).map(([name, desc]) => ({ name, desc }));
  const activeSkills = Object.entries(stats.skills.active).map(([name, desc]) => ({ name, desc }));

  const TabButton = ({ id, icon, label }: { id: typeof activeTab, icon: React.ReactNode, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`font-display relative flex flex-1 flex-col items-center justify-center overflow-hidden py-3 text-xs tracking-wider transition-all duration-300 ${activeTab === id ? 'text-crimson-400 font-bold' : 'text-gray-400 hover:text-gray-200'
        }`}
    >
      <div className="relative z-10 mb-1">{icon}</div>
      <span className="relative z-10">{label}</span>
      {activeTab === id && (
        <div className="from-crimson-900/40 absolute inset-0 bg-gradient-to-t to-transparent" />
      )}
      {activeTab === id && (
        <div className="bg-crimson-500 absolute right-1/4 bottom-0 left-1/4 h-0.5 rounded-full shadow-[0_0_8px_rgba(160,26,53,0.8)]"></div>
      )}
    </button>
  );

  return (
    <GlassPanel className="relative flex h-full flex-col" variant="dark">
      {/* Header Profile with Avatar Frame */}
      <div className="relative mb-6 flex shrink-0 items-center gap-4 border-b border-white/10 pb-4">

        {/* Avatar Section */}
        <div
          className="group relative shrink-0 cursor-pointer"
          onClick={() => setIsAvatarModalOpen(true)}
          title="点击查看大图"
        >
          {/* Ambient Glow */}
          <div className="from-crimson-600 absolute inset-0 animate-pulse rounded-full bg-gradient-to-tr to-purple-600 opacity-60 blur-[6px]"></div>

          {/* Frame & Image */}
          <div className="bg-void-900 relative h-16 w-16 overflow-hidden rounded-full border border-white/20 p-0.5 shadow-xl transition-transform duration-300 group-hover:scale-105 group-hover:ring-2 group-hover:ring-crimson-500/50">
            <img
              src="https://files.catbox.moe/as3h4s.png"
              alt={stats.name}
              className="h-full w-full rounded-full object-cover grayscale-[10%] transition-all duration-500 group-hover:grayscale-0"
            />
            {/* 放大图标提示 */}
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <ZoomIn size={16} className="text-white/80" />
            </div>
            {/* Inner Glint */}
            <div className="pointer-events-none absolute inset-0 rounded-full border border-white/10 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"></div>
          </div>

          {/* Corner Deco */}
          <div className="bg-void-950 border-gold-500/50 text-gold-500 absolute -right-1 -bottom-1 z-10 rounded-full border p-1 shadow-lg">
            <Crown size={10} fill="currentColor" className="text-gold-500" />
          </div>
        </div>

        {/* Name Info */}
        <div className="relative z-10 min-w-0 flex-1 overflow-hidden">
          <h2 className="font-display to-crimson-400 truncate bg-gradient-to-r from-gray-100 via-purple-200 bg-clip-text text-xl font-bold text-transparent drop-shadow-sm">
            {stats.name}
          </h2>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded border border-white/20 bg-white/5 px-1.5 text-[10px] text-gray-400">{stats.race}</span>
            <span className="text-crimson-300 truncate font-serif text-xs italic">{stats.currentForm}</span>
          </div>
        </div>

        {/* Level Badge */}
        <div className="group relative shrink-0">
          <div className="from-crimson-600 absolute inset-0 rounded-full bg-gradient-to-r to-purple-600 opacity-50 blur-md transition-opacity group-hover:opacity-80"></div>
          <div className="bg-void-900 relative flex h-12 w-12 flex-col items-center justify-center rounded-full border border-white/20 shadow-2xl">
            <span className="text-[8px] font-bold text-gray-400">LV.</span>
            <span className="font-display text-lg leading-none font-bold text-white">{stats.level}</span>
          </div>
        </div>
      </div>

      {/* Primary Stats with Glow */}
      <div className="relative z-10 mb-6 shrink-0 space-y-4">
        {/* EXP */}
        <div>
          <div className="mb-1 flex justify-between font-mono text-[10px] text-gray-400">
            <span>经验值</span>
            <span className="text-gray-300">{stats.exp} / {stats.maxExp}</span>
          </div>
          <div className="bg-void-950 h-1 w-full overflow-hidden rounded-full border border-white/10">
            <div
              className="relative h-full bg-gradient-to-r from-gray-500 to-gray-200 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              style={{ width: `${(stats.exp / stats.maxExp) * 100}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
            </div>
          </div>
        </div>

        {/* Mana */}
        <div>
          <div className="text-magic-purple mb-1 flex justify-between font-mono text-[10px]">
            <span className="flex items-center gap-1"><Zap size={10} /> 魔能</span>
            <span className="text-purple-200">{stats.mana.current} / {stats.mana.max}</span>
          </div>
          <div className="bg-void-950 h-1.5 w-full overflow-hidden rounded-full border border-purple-500/30 shadow-inner">
            <div
              className="to-magic-purple relative h-full bg-gradient-to-r from-purple-800 via-purple-600 shadow-[0_0_12px_rgba(179,136,255,0.6)]"
              style={{ width: `${(stats.mana.current / stats.mana.max) * 100}%` }}
            >
              <div className="absolute inset-0 animate-pulse bg-white/10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-2 flex shrink-0 border-t border-white/10">
        <TabButton id="status" icon={<User size={14} />} label="状态" />
        <TabButton id="inventory" icon={<Backpack size={14} />} label="物品" />
        <TabButton id="skills" icon={<Zap size={14} />} label="能力" />
      </div>

      {/* Tab Content */}
      <div className="custom-scrollbar relative min-h-0 flex-1 overflow-y-auto pr-1">
        {activeTab === 'status' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4 pt-2 duration-300">
            {/* 当前扮演状态 - 新增高亮显示 */}
            <div className="group relative overflow-hidden rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-900/40 via-purple-900/20 to-transparent p-4 transition-all hover:border-purple-400/50">
              <div className="absolute top-0 right-0 p-3 opacity-20">
                <Drama size={40} />
              </div>
              <div className="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-purple-500/15 blur-xl"></div>
              <div className="relative z-10">
                <div className="mb-2 flex items-center gap-2">
                  <Drama size={14} className="text-purple-400" />
                  <h4 className="text-[10px] font-bold tracking-widest text-purple-300 uppercase">当前扮演</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-display rounded-md border border-purple-400/40 bg-purple-800/40 px-3 py-1.5 text-sm font-bold text-purple-200 shadow-lg shadow-purple-900/50">
                    {stats.currentRole}
                  </span>
                </div>
              </div>
            </div>

            {/* 当前外观气质 - 新增动态描述 */}
            <div className="group relative overflow-hidden rounded-xl border border-pink-500/20 bg-gradient-to-r from-pink-900/30 via-pink-900/10 to-transparent p-4 transition-all hover:border-pink-400/40">
              <div className="absolute top-0 right-0 p-3 opacity-15">
                <Eye size={36} />
              </div>
              <div className="pointer-events-none absolute -right-4 -bottom-4 h-16 w-16 rounded-full bg-pink-500/10 blur-xl"></div>
              <div className="relative z-10">
                <div className="mb-2 flex items-center gap-2">
                  <Eye size={14} className="text-pink-400" />
                  <h4 className="text-[10px] font-bold tracking-widest text-pink-300 uppercase">外观气质</h4>
                  <span className="rounded bg-pink-900/50 px-1.5 py-0.5 text-[8px] text-pink-400">实时</span>
                </div>
                <p className="border-l-2 border-pink-500/40 pl-3 font-serif text-xs leading-relaxed text-gray-200 italic md:text-sm">
                  {stats.currentAppearance}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-5 pt-2 duration-300">
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-[10px] tracking-widest text-purple-300/80 uppercase">
                <Shirt size={12} /> 当前装备
              </h4>
              {equipmentList.length > 0 ? (
                <ul className="grid grid-cols-1 gap-2">
                  {equipmentList.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 rounded border border-purple-500/20 bg-purple-900/20 px-3 py-2 text-xs text-purple-100">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_5px_rgba(168,85,247,0.8)]"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-500 italic">暂无装备</p>
              )}
            </div>
            <div>
              <h4 className="mb-2 text-[10px] tracking-widest text-gray-400 uppercase">持有道具</h4>
              {itemsList.length > 0 ? (
                <ul className="space-y-1">
                  {itemsList.map((item, i) => (
                    <li key={i} className="rounded border-l border-transparent px-2 py-1.5 text-xs text-gray-300 transition-colors hover:border-gray-500 hover:bg-white/5">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-500 italic">暂无道具</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-5 pt-2 pb-20 duration-300">
            <div>
              <h4 className="mb-2 text-[10px] tracking-widest text-gray-400 uppercase">被动天赋</h4>
              {passiveSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {passiveSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-void-800 rounded border border-gray-600 px-2.5 py-1 text-[10px] text-gray-300 shadow-sm cursor-help"
                      title={skill.desc}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">暂无被动技能</p>
              )}
            </div>
            <div>
              <h4 className="text-crimson-400 mb-2 text-[10px] tracking-widest uppercase">主动技能</h4>
              {activeSkills.length > 0 ? (
                <div className="space-y-2">
                  {activeSkills.map((skill, i) => (
                    <div
                      key={i}
                      onMouseEnter={() => setHoveredSkill(skill.name)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      className="group from-crimson-900/30 text-crimson-100 border-crimson-500/30 flex cursor-help items-center justify-between rounded border bg-gradient-to-r to-transparent p-2.5 text-xs transition-colors hover:border-crimson-400/50 hover:bg-crimson-900/40"
                    >
                      <span>{skill.name}</span>
                      <Info size={12} className="text-crimson-400 opacity-50 transition-opacity group-hover:opacity-100" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">暂无主动技能</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Skill Detail Overlay - Floating at the bottom of the list view */}
      {activeTab === 'skills' && hoveredSkill && (
        <div className="bg-void-900/95 border-crimson-500/50 animate-in slide-in-from-bottom-2 fade-in absolute right-0 bottom-0 left-0 z-20 m-2 rounded-lg border p-3 shadow-[0_-5px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl duration-200">
          {(() => {
            const skill = activeSkills.find(s => s.name === hoveredSkill);
            return (
              <>
                <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-1">
                  <h4 className="text-crimson-300 font-display text-sm font-bold">{hoveredSkill}</h4>
                </div>
                <p className="font-serif text-xs leading-relaxed text-gray-200 italic">
                  {skill?.desc || '暂无详细信息'}
                </p>
              </>
            );
          })()}
        </div>
      )}

      {/* 头像预览模态框 */}
      <ImageModal
        isOpen={isAvatarModalOpen}
        imageUrl="https://files.catbox.moe/as3h4s.png"
        altText={stats.name}
        onClose={() => setIsAvatarModalOpen(false)}
      />
    </GlassPanel>
  );
};

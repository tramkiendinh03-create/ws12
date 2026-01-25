import { ChevronLeft, ChevronRight, Heart, Skull, User, Users, ZoomIn } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { PlayerStats as PlayerStatsData, TargetCharacter } from '../types';
import { ImageModal } from './ImageModal';
import { PlayerStats } from './PlayerStats';
import { GlassPanel } from './ui/GlassPanel';

interface Props {
  player: PlayerStatsData;
  targets: TargetCharacter[];
}

type Page = 'player' | 'targets';

export const TargetStats: React.FC<Props> = ({ player, targets }) => {
  const [activePage, setActivePage] = useState<Page>('player');
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null);
  // 记录加载失败的图片 URL，避免重复显示
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // 处理图片加载错误
  const handleImageError = useCallback((url: string) => {
    setFailedImages(prev => new Set(prev).add(url));
  }, []);

  // 检查图片是否可用（未加载失败）
  const isImageAvailable = useCallback((url: string | undefined): url is string => {
    return !!url && !failedImages.has(url);
  }, [failedImages]);

  // --- Image Modal Logic ---
  const openImageModal = (url: string, name: string) => {
    setSelectedImage({ url, name });
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const pages: Page[] = ['player', 'targets'];
  const currentIndex = pages.indexOf(activePage);

  // --- Navigation Logic ---
  const goToNext = () => {
    if (currentIndex < pages.length - 1) setActivePage(pages[currentIndex + 1]);
  };

  const goToPrev = () => {
    if (currentIndex > 0) setActivePage(pages[currentIndex - 1]);
  };

  // --- Swipe Logic ---
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrev();
  };

  // --- Sub-Component: NPC List Page ---
  const TargetRoster = () => (
    <GlassPanel className="flex h-full min-h-0 flex-col" variant="crimson" title="猎物名单" icon={<Users size={16} />}>
      {/* Changed to Grid for better density on larger screens */}
      <div className="custom-scrollbar grid flex-1 grid-cols-1 content-start gap-3 overflow-y-auto p-2 pr-1 md:grid-cols-2">
        {targets.map(target => {
          return (
            <div
              key={target.id}
              className="group relative flex flex-col transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Background Card Style */}
              <div className="bg-void-950/60 absolute inset-0 rounded-xl border border-white/10 shadow-lg transition-colors group-hover:border-crimson-500/40"></div>

              {/* Inner Content - Responsive Row Layout */}
              <div className="relative flex flex-row items-center gap-3 p-2.5">
                {/* Avatar Column - 可点击展开 */}
                <div className="relative shrink-0">
                  {(() => {
                    const hasValidImage = isImageAvailable(target.avatarUrl);
                    return (
                      <div
                        className={`relative h-14 w-14 overflow-hidden rounded-full bg-gradient-to-b from-gray-600 to-black p-[2px] shadow-md transition-all duration-300 ${hasValidImage
                            ? 'hover:ring-crimson-500/50 hover:shadow-crimson-500/20 hover:shadow-lg hover:ring-2 cursor-pointer'
                            : ''
                          } ${target.isCorrupted ? 'ring-2 ring-purple-500/60' : ''}`}
                        onClick={() => hasValidImage && openImageModal(target.avatarUrl!, target.name)}
                        title={hasValidImage ? '点击查看大图' : ''}
                      >
                        {hasValidImage ? (
                          <>
                            <img
                              src={target.avatarUrl}
                              alt={target.name}
                              className={`h-full w-full rounded-full object-cover transition-all duration-500 group-hover:grayscale-0 ${target.isCorrupted ? 'grayscale-0' : 'grayscale-[10%]'
                                }`}
                              onError={() => handleImageError(target.avatarUrl!)}
                            />
                            {/* 放大图标提示 */}
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              <ZoomIn size={16} className="text-white/80" />
                            </div>
                            {/* 恶堕标识 */}
                            {target.isCorrupted && (
                              <div className="absolute -top-1 -right-1 z-20 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 shadow-lg">
                                <Skull size={10} className="text-white" />
                              </div>
                            )}
                          </>
                        ) : (
                          <div className={`flex h-full w-full items-center justify-center rounded-full ${target.isCorrupted
                              ? 'bg-gradient-to-br from-purple-600 to-black'
                              : 'from-crimson-600 bg-gradient-to-br to-purple-600'
                            }`}>
                            <User size={20} className="text-white/80" />
                            {/* 恶堕标识 */}
                            {target.isCorrupted && (
                              <div className="absolute -top-1 -right-1 z-20 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 shadow-lg">
                                <Skull size={10} className="text-white" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  {/* Level Badge - Adjusted for overlap */}
                  <div className="bg-void-900 font-display absolute -right-1 -bottom-1 z-10 rounded border border-white/20 px-1.5 py-0.5 text-[9px] text-gray-300 shadow-md">
                    {target.level}
                  </div>
                </div>

                {/* Info Column */}
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  {/* Name & Title Row */}
                  <div className="flex items-baseline justify-between border-b border-white/5 pb-1">
                    <div className="truncate pr-2">
                      <h3 className="font-display truncate text-sm font-bold text-gray-200 transition-colors group-hover:text-crimson-400">
                        {target.name}
                      </h3>
                      <span className="block truncate font-serif text-[10px] text-gray-500">{target.title}</span>
                    </div>
                    <span className="rounded border border-white/5 bg-white/5 px-1.5 py-0.5 text-[9px] whitespace-nowrap text-gray-400">
                      {target.currentStatus}
                    </span>
                  </div>

                  {/* Compact Status Bars */}
                  <div className="grid w-full grid-cols-1 gap-1.5">
                    {/* Affection (好感度) */}
                    <div className="flex items-center gap-1.5">
                      <Heart size={10} className="shrink-0 text-pink-500/80" />
                      <div className="bg-void-800 relative h-1 flex-1 overflow-hidden rounded-full">
                        <div
                          className="h-full rounded-full bg-pink-600/80"
                          style={{ width: `${(target.affection.value / target.affection.max) * 100}%` }}
                        />
                      </div>
                      <span className="w-5 text-right font-mono text-[9px] leading-none text-pink-300">
                        {target.affection.value}
                      </span>
                    </div>

                    {/* Corruption (迷堕度) */}
                    <div className="flex items-center gap-1.5">
                      <Skull size={10} className="shrink-0 text-purple-500/80" />
                      <div className="bg-void-800 relative h-1 flex-1 overflow-hidden rounded-full">
                        <div
                          className="h-full rounded-full bg-purple-600/80"
                          style={{ width: `${(target.corruption.value / target.corruption.max) * 100}%` }}
                        />
                      </div>
                      <span className="w-5 text-right font-mono text-[9px] leading-none text-purple-300">
                        {target.corruption.value}
                      </span>
                    </div>
                  </div>

                  {/* 阶段描述 */}
                  <div className="flex gap-2 text-[8px]">
                    <span className="text-pink-400/80">{target.affection.description}</span>
                    <span className="text-gray-600">|</span>
                    <span className="text-purple-400/80">{target.corruption.description}</span>
                  </div>

                  {/* 特征标签 */}
                  {(target.traits.core || target.traits.weakness) && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {target.traits.core && (
                        <span className="bg-crimson-900/40 border-crimson-500/30 text-crimson-300 rounded border px-1.5 py-0.5 text-[8px]">
                          {target.traits.core}
                        </span>
                      )}
                      {target.traits.weakness && (
                        <span className="rounded border border-purple-500/30 bg-purple-900/40 px-1.5 py-0.5 text-[8px] text-purple-300">
                          {target.traits.weakness}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {targets.length === 0 && (
          <div className="col-span-full py-8 text-center text-gray-500">
            <Users size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">暂无目标</p>
          </div>
        )}
      </div>
    </GlassPanel>
  );

  // --- Main Render (Grimoire Container) ---
  return (
    <div
      className="relative flex h-full flex-col rounded-2xl shadow-2xl transition-all duration-500"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Mystic Glow Behind Book */}
      <div className="bg-crimson-900/30 animate-pulse-slow absolute inset-4 -z-10 blur-[50px]"></div>

      {/* Desktop Bookmarks / Tabs (Side) - Compact Version */}
      <div className="absolute top-12 -right-8 z-0 hidden flex-col gap-2 md:flex">
        {[
          { id: 'player', icon: <User size={16} />, label: '主角', color: 'border-purple-500/40 text-purple-300' },
          { id: 'targets', icon: <Users size={16} />, label: '猎物', color: 'border-crimson-500/40 text-crimson-300' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActivePage(tab.id as Page)}
            className={`
                        relative flex h-14 w-10 items-center justify-center rounded-r-md border-y border-r shadow-xl transition-all duration-300
                        ${activePage === tab.id
                ? `bg-void-900 ${tab.color} translate-x-0`
                : 'bg-void-950 -translate-x-2 border-white/10 text-gray-500 hover:-translate-x-1 hover:text-gray-300'
              }
                    `}
          >
            <div className="bg-noise pointer-events-none absolute inset-0 opacity-20"></div>
            <div className="-rotate-90 transform">{tab.icon}</div>
          </button>
        ))}
      </div>

      {/* Main Book Body */}
      <div className="bg-void-900/90 relative flex flex-1 flex-col overflow-hidden rounded-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        {/* Corner Ornaments (CSS Graphics) */}
        <div className="pointer-events-none absolute top-0 left-0 z-20 h-10 w-10 rounded-tl-xl border-t-2 border-l-2 border-white/10"></div>
        <div className="pointer-events-none absolute right-0 bottom-0 z-20 h-10 w-10 rounded-br-xl border-r-2 border-b-2 border-white/10"></div>

        {/* Page Content */}
        <div className="from-void-900 via-void-900 to-void-950/90 relative z-10 flex-1 overflow-hidden bg-gradient-to-b p-2 md:p-5">
          <div className="h-full w-full transition-all duration-500 ease-in-out">
            {activePage === 'player' && <PlayerStats stats={player} />}
            {activePage === 'targets' && <TargetRoster />}
          </div>
        </div>

        {/* Desktop Navigation Arrows (Floating) */}
        <div className="pointer-events-none absolute inset-0 z-30 hidden md:block">
          {currentIndex > 0 && (
            <button
              onClick={goToPrev}
              className="pointer-events-auto absolute top-1/2 -left-12 -translate-y-1/2 p-3 text-gray-500 opacity-50 transition-all hover:scale-110 hover:text-white hover:opacity-100"
            >
              <ChevronLeft size={32} strokeWidth={1.5} />
            </button>
          )}
          {currentIndex < pages.length - 1 && (
            <button
              onClick={goToNext}
              className="pointer-events-auto absolute top-1/2 -right-12 -translate-y-1/2 p-3 text-gray-500 opacity-50 transition-all hover:scale-110 hover:text-white hover:opacity-100"
            >
              <ChevronRight size={32} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Tabs (Bottom) */}
      <div className="mt-3 flex justify-between rounded-full border border-white/10 bg-black/40 p-1 backdrop-blur-md md:hidden">
        {pages.map(page => {
          const icons = { player: <User size={14} />, targets: <Users size={14} /> };
          const labels = { player: '主角', targets: '猎物' };
          const isActive = activePage === page;
          return (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`
                        flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-xs font-bold transition-all duration-300
                        ${isActive
                  ? 'bg-crimson-900/60 text-crimson-200 shadow-lg'
                  : 'text-gray-500 hover:text-gray-300'
                }
                    `}
            >
              {icons[page]}
              <span>{labels[page]}</span>
            </button>
          );
        })}
      </div>

      {/* 图片预览模态框 */}
      <ImageModal
        isOpen={selectedImage !== null}
        imageUrl={selectedImage?.url || ''}
        altText={selectedImage?.name || ''}
        onClose={closeImageModal}
      />
    </div>
  );
};

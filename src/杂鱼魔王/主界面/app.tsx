import React from 'react';
import { TargetStats } from './components/TargetStats';
import { WorldStatusBar } from './components/WorldStatusBar';
import { INITIAL_PLAYER, INITIAL_TARGETS, INITIAL_WORLD } from './constants';
import { useGameState } from './hooks/useMvuData';

const App: React.FC = () => {
  // 从 MVU 变量获取游戏状态
  const { world, player, targets, loading, error } = useGameState();

  // 加载中显示
  if (loading) {
    return (
      <div className="bg-void-950 flex h-[1200px] w-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent mx-auto"></div>
          <p className="text-gray-400">正在加载变量数据...</p>
        </div>
      </div>
    );
  }

  // 错误或无数据时使用 fallback 数据
  const displayWorld = world ?? INITIAL_WORLD;
  const displayPlayer = player ?? INITIAL_PLAYER;
  const displayTargets = targets.length > 0 ? targets : INITIAL_TARGETS;

  return (
    <div className="bg-void-950 relative flex h-[1200px] w-full flex-col overflow-hidden font-sans text-gray-200 selection:bg-crimson-500/30 selection:text-white">

      {/* 调试信息 - 仅在开发时显示 */}
      {error && (
        <div className="absolute top-0 left-0 z-50 bg-red-900/80 text-red-200 text-xs px-2 py-1 rounded-br">
          变量解析错误: {error.message}
        </div>
      )}

      {/* Background Ambience & Noise */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Static Noise Overlay */}
        <div className="bg-noise absolute inset-0 opacity-[0.03] mix-blend-overlay"></div>

        {/* Dynamic Gradients - Made lighter by adjusting opacity/colors implicitly via theme or explicit opacity */}
        <div className="from-void-950 via-void-900 absolute inset-0 bg-gradient-to-br to-black opacity-90"></div>
        <div className="absolute top-0 left-0 h-[60vh] w-full bg-gradient-to-b from-purple-900/15 via-transparent to-transparent opacity-80"></div>

        {/* Floating Orbs (Glows) - Increased visibility */}
        <div className="animate-pulse-slow absolute top-[-100px] left-[-100px] h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[120px]"></div>
        <div className="bg-crimson-600/10 animate-float absolute right-[-100px] bottom-[-100px] h-[500px] w-[500px] rounded-full blur-[100px]" style={{ animationDuration: '12s' }}></div>

        {/* Center Spotlight vignette - Reduced opacity to reduce darkness */}
        <div className="bg-radial-gradient to-void-950 absolute inset-0 from-transparent opacity-40"></div>
      </div>

      {/* Main Container - Reverted to max-w-4xl for compact/flat look */}
      <div className="relative z-10 container mx-auto flex h-full max-w-4xl flex-col p-3 md:p-4">

        {/* Top Status Bar */}
        <WorldStatusBar
          world={displayWorld}
          onMenuToggle={() => { }}
          isMobileMenuOpen={false}
        />

        {/* Content Area (Stats Book) */}
        <div className="perspective-1000 mt-3 min-h-0 flex-1">
          <TargetStats
            player={displayPlayer}
            targets={displayTargets}
          />
        </div>

      </div>
    </div>
  );
};

export default App;

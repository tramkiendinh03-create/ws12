
import {
  Clock,
  Globe,
  MapPin,
  Radio,
  Skull,
  User
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import InquisitorProfile from './components/Dashboard/InquisitorProfile';
import VillainMonitor from './components/Dashboard/VillainMonitor';
import WorldStatus from './components/Dashboard/WorldStatus';
import { INITIAL_INQUISITOR, INITIAL_VILLAINS, INITIAL_WORLD_STATE } from './constants';
import { GameMode, Inquisitor, ThreatLevel, Villain, WorldState } from './types';

type TabId = 'world' | 'profile' | 'target';

type PendingDelete =
  | { kind: 'title'; index: number; label: string }
  | { kind: 'item'; index: number; label: string }
  | { kind: 'villain'; id: string; label: string };

const MODE_MAP: Record<string, GameMode> = {
  NORMAL: GameMode.NORMAL,
  CORRUPTION: GameMode.CORRUPTION,
  MASOCHIST: GameMode.MASOCHIST,
  UNDERDOG: GameMode.UNDERDOG,
  [GameMode.NORMAL]: GameMode.NORMAL,
  [GameMode.CORRUPTION]: GameMode.CORRUPTION,
  [GameMode.MASOCHIST]: GameMode.MASOCHIST,
  [GameMode.UNDERDOG]: GameMode.UNDERDOG,
  恶堕: GameMode.CORRUPTION,
  抖M: GameMode.MASOCHIST,
  下克上: GameMode.UNDERDOG,
};

function toNumber(value: unknown, fallback: number): number {
  const result = Number(value);
  return Number.isFinite(result) ? result : fallback;
}

function toString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

function toStringArray(value: unknown, fallback: string[]): string[] {
  if (Array.isArray(value)) {
    const list = value.map(item => String(item)).filter(Boolean);
    return list.length > 0 ? list : fallback;
  }

  if (typeof value === 'string') {
    const text = value.trim();
    return text.length > 0 ? [text] : fallback;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return [];
    const list = entries.map(([key, item]) => {
      if (typeof item === 'string' && item.length > 0) return `${key}: ${item}`;
      return key;
    });
    return list;
  }

  return fallback;
}

function toThreatLevel(value: unknown): ThreatLevel {
  const normalized = String(value ?? '').toUpperCase();
  if ((Object.values(ThreatLevel) as string[]).includes(normalized)) {
    return normalized as ThreatLevel;
  }
  return ThreatLevel.C;
}

function isModeEnabled(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value > 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', 'turn', '1', 'yes', 'on', '开启', '开', '是'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off', '关闭', '关', '否', ''].includes(normalized)) return false;
    return Boolean(normalized);
  }
  return Boolean(value);
}

function toGameModes(value: unknown): GameMode[] {
  if (Array.isArray(value)) {
    const result = value
      .map(item => MODE_MAP[String(item)])
      .filter((mode): mode is GameMode => Boolean(mode));
    return result.length > 0 ? result : [GameMode.NORMAL];
  }

  if (value && typeof value === 'object') {
    const result = Object.entries(value as Record<string, unknown>)
      .filter(([, enabled]) => isModeEnabled(enabled))
      .map(([key]) => MODE_MAP[key])
      .filter((mode): mode is GameMode => Boolean(mode));
    return result.length > 0 ? result : [GameMode.NORMAL];
  }

  return [GameMode.NORMAL];
}

function parseWorld(worldRaw: Record<string, unknown>): WorldState {
  return {
    当前任务世界名称: toString(worldRaw.当前任务世界名称 ?? worldRaw.世界名称, INITIAL_WORLD_STATE.当前任务世界名称),
    世界类型与基调: toString(worldRaw.世界类型与基调, INITIAL_WORLD_STATE.世界类型与基调),
    当前世界净化度: toNumber(worldRaw.当前世界净化度 ?? worldRaw.净化度, INITIAL_WORLD_STATE.当前世界净化度),
    已净化世界数: toNumber(worldRaw.已净化世界数, INITIAL_WORLD_STATE.已净化世界数),
    时间: toString(worldRaw.时间 ?? worldRaw.当前时间, INITIAL_WORLD_STATE.时间),
    地点: toString(worldRaw.地点 ?? worldRaw.当前地点, INITIAL_WORLD_STATE.地点),
    任务: toString(worldRaw.任务 ?? worldRaw.当前任务, INITIAL_WORLD_STATE.任务),
  };
}

function parseInquisitor(raw: Record<string, unknown>): Inquisitor {
  return {
    圣裁官姓名: toString(raw.圣裁官姓名 ?? raw.姓名, INITIAL_INQUISITOR.圣裁官姓名),
    性别: (toString(raw.性别, INITIAL_INQUISITOR.性别) as Inquisitor['性别']),
    等级: toNumber(raw.等级, INITIAL_INQUISITOR.等级),
    经验值: toNumber(raw.经验值, INITIAL_INQUISITOR.经验值),
    善升点: toNumber(raw.善升点, INITIAL_INQUISITOR.善升点),
    身份: toString(raw.身份, INITIAL_INQUISITOR.身份),
    称号: toStringArray(raw.称号, INITIAL_INQUISITOR.称号),
    永久状态: toStringArray(raw.永久状态, INITIAL_INQUISITOR.永久状态),
    临时状态: toStringArray(raw.临时状态, INITIAL_INQUISITOR.临时状态),
    外貌: toString(raw.外貌 ?? raw.分貌, INITIAL_INQUISITOR.外貌),
    堕落值: toNumber(raw.堕落值, INITIAL_INQUISITOR.堕落值),
    物品栏: toStringArray(raw.物品栏, INITIAL_INQUISITOR.物品栏),
  };
}

function parseVillain(raw: Record<string, unknown>, index: number, fallbackId?: string): Villain {
  const fallback = INITIAL_VILLAINS[index] ?? INITIAL_VILLAINS[0];
  return {
    id: toString(raw.id, fallbackId ?? fallback.id ?? `villain-${index}`),
    姓名: toString(raw.姓名, fallback.姓名),
    种族: toString(raw.种族, fallback.种族),
    等级: toNumber(raw.等级, fallback.等级),
    身份: toString(raw.身份, fallback.身份),
    临时状态: toString(raw.临时状态, fallback.临时状态),
    对圣裁官的态度: toString(raw.对圣裁官的态度, fallback.对圣裁官的态度),
    好感度: toNumber(raw.好感度, fallback.好感度),
    善恶值: toNumber(raw.善恶值, fallback.善恶值),
    威胁度: toThreatLevel(raw.威胁度 ?? fallback.威胁度),
    avatarUrl: toString(raw.avatarUrl, fallback.avatarUrl ?? 'https://picsum.photos/200/200'),
  };
}

const App: React.FC = () => {
  const runtime = window as unknown as {
    getCurrentMessageId?: () => number;
    getVariables?: (option: { type: 'message'; message_id?: number | 'latest' }) => Record<string, unknown>;
    replaceVariables?: (
      variables: Record<string, unknown>,
      option: { type: 'message'; message_id?: number | 'latest' },
    ) => void;
    eventOn?: (eventType: string, listener: (messageId: number | string) => void) => { stop: () => void };
    tavern_events?: {
      MESSAGE_UPDATED?: string;
      MESSAGE_EDITED?: string;
      MESSAGE_RECEIVED?: string;
      CHAT_CHANGED?: string;
    };
  };
  // Game State
  const [worldState, setWorldState] = useState<WorldState>(INITIAL_WORLD_STATE);
  const [inquisitor, setInquisitor] = useState<Inquisitor>(INITIAL_INQUISITOR);
  const [villains, setVillains] = useState<Villain[]>(INITIAL_VILLAINS);

  // Game Modes State (Multi-select)
  const [activeGameModes, setActiveGameModes] = useState<GameMode[]>([GameMode.NORMAL]);

  // UI State: Navigation
  const [activeTab, setActiveTab] = useState<TabId>('target');
  const [pendingMode, setPendingMode] = useState<GameMode | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [modeNotice, setModeNotice] = useState<string>('');

  useEffect(() => {
    const getMessageOption = () => {
      const messageId = runtime.getCurrentMessageId?.();
      if (typeof messageId === 'number') {
        return { type: 'message' as const, message_id: messageId };
      }
      return { type: 'message' as const, message_id: 'latest' as const };
    };

    const syncFromVariables = () => {
      try {
        const messageVariables = runtime.getVariables?.(getMessageOption()) ?? {};
        const root =
          messageVariables && typeof messageVariables === 'object' && messageVariables.stat_data
            ? (messageVariables.stat_data as Record<string, unknown>)
            : (messageVariables as Record<string, unknown>);

        const worldRaw = (root.世界 ?? root.世界状态 ?? root.worldState ?? {}) as Record<string, unknown>;
        const inquisitorRaw = (root.圣裁官 ?? root.主角 ?? root.inquisitor ?? {}) as Record<string, unknown>;
        const villainsRaw = (root.反派列表 ?? root.反派 ?? root.villains ?? []) as
          | Record<string, unknown>
          | Record<string, unknown>[];

        setWorldState(parseWorld(worldRaw));
        setInquisitor(parseInquisitor(inquisitorRaw));

        if (Array.isArray(villainsRaw)) {
          const parsed = villainsRaw.map((item, index) => parseVillain(item, index));
          setVillains(parsed);
        } else {
          const parsed = Object.entries(villainsRaw).map(([id, item], index) =>
            parseVillain((item ?? {}) as Record<string, unknown>, index, id),
          );
          setVillains(parsed);
        }

        const modesRaw = root.模式 ?? root.游戏模式 ?? root.activeGameModes;
        setActiveGameModes(toGameModes(modesRaw));

      } catch (error) {
        console.warn('[天罚] 读取楼层变量失败，使用默认状态', error);
      }
    };

    syncFromVariables();

    if (!runtime.eventOn || !runtime.tavern_events) return;

    const offUpdated = runtime.tavern_events.MESSAGE_UPDATED
      ? runtime.eventOn(runtime.tavern_events.MESSAGE_UPDATED, () => {
        syncFromVariables();
      })
      : undefined;

    const offEdited = runtime.tavern_events.MESSAGE_EDITED
      ? runtime.eventOn(runtime.tavern_events.MESSAGE_EDITED, () => {
        syncFromVariables();
      })
      : undefined;

    const offReceived = runtime.tavern_events.MESSAGE_RECEIVED
      ? runtime.eventOn(runtime.tavern_events.MESSAGE_RECEIVED, () => {
        syncFromVariables();
      })
      : undefined;

    const offChatChanged = runtime.tavern_events.CHAT_CHANGED
      ? runtime.eventOn(runtime.tavern_events.CHAT_CHANGED, () => {
        syncFromVariables();
      })
      : undefined;

    return () => {
      offUpdated?.stop();
      offEdited?.stop();
      offReceived?.stop();
      offChatChanged?.stop();
    };
  }, []);

  useEffect(() => {
    if (!modeNotice) return;

    const timer = window.setTimeout(() => {
      setModeNotice('');
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [modeNotice]);

  const persistRootMutation = (mutate: (root: Record<string, unknown>) => void) => {
    try {
      if (typeof runtime.getVariables !== 'function' || typeof runtime.replaceVariables !== 'function') {
        return;
      }

      const messageId = runtime.getCurrentMessageId?.();
      const option =
        typeof messageId === 'number'
          ? ({ type: 'message', message_id: messageId } as const)
          : ({ type: 'message', message_id: 'latest' } as const);

      const variables = runtime.getVariables(option) ?? {};
      const container = { ...variables };
      const hasStatData = Boolean(container.stat_data && typeof container.stat_data === 'object');
      const root = hasStatData
        ? { ...(container.stat_data as Record<string, unknown>) }
        : { ...container };

      mutate(root);

      if (hasStatData) {
        container.stat_data = root;
        runtime.replaceVariables(container, option);
      } else {
        runtime.replaceVariables(root, option);
      }
    } catch (error) {
      console.warn('[天罚] 写入楼层变量失败', error);
    }
  };

  const persistGameModes = (modes: GameMode[]) => {
    persistRootMutation(root => {
      const modeMap: Record<string, boolean> = {
        普通模式: true,
        恶堕模式: modes.includes(GameMode.CORRUPTION),
        抖M模式: modes.includes(GameMode.MASOCHIST),
        下克上模式: modes.includes(GameMode.UNDERDOG),
      };

      const has模式 = Object.prototype.hasOwnProperty.call(root, '模式');
      const has游戏模式 = Object.prototype.hasOwnProperty.call(root, '游戏模式');
      const hasActiveGameModes = Object.prototype.hasOwnProperty.call(root, 'activeGameModes');

      // 只写入一个模式字段，避免产生不必要的重复变量
      const targetKey: '模式' | '游戏模式' | 'activeGameModes' =
        has模式 ? '模式' : has游戏模式 ? '游戏模式' : hasActiveGameModes ? 'activeGameModes' : '模式';

      root[targetKey] = modeMap;

      // 清理历史遗留的重复模式字段
      (['模式', '游戏模式', 'activeGameModes'] as const).forEach(key => {
        if (key !== targetKey && Object.prototype.hasOwnProperty.call(root, key)) {
          delete root[key];
        }
      });
    });
  };

  // Toggle Mode Logic
  const toggleGameMode = (mode: GameMode) => {
    if (mode === GameMode.NORMAL) {
      const locked = activeGameModes.includes(GameMode.NORMAL) ? activeGameModes : [GameMode.NORMAL, ...activeGameModes];
      persistGameModes(locked);
      setActiveGameModes(locked);
      setPendingMode(null);
      setPendingDelete(null);
      setModeNotice('普通模式为锁定默认模式，无法关闭。');
      return;
    }

    const base = activeGameModes.includes(GameMode.NORMAL)
      ? activeGameModes
      : [GameMode.NORMAL, ...activeGameModes];

    // 一旦开启后不可关闭
    if (base.includes(mode)) {
      setPendingMode(null);
      setPendingDelete(null);
      setModeNotice(`「${mode}」已开启，开启后不可关闭。`);
      return;
    }

    setPendingDelete(null);
    setPendingMode(mode);
    setModeNotice(`是否开启「${mode}」？开启后不可关闭。`);
  };

  const confirmEnableMode = () => {
    if (!pendingMode) return;

    const base = activeGameModes.includes(GameMode.NORMAL)
      ? activeGameModes
      : [GameMode.NORMAL, ...activeGameModes];

    if (base.includes(pendingMode)) {
      setPendingMode(null);
      setModeNotice(`「${pendingMode}」已开启，开启后不可关闭。`);
      return;
    }

    const next = [...base, pendingMode];
    persistGameModes(next);
    setActiveGameModes(next);
    setModeNotice(`「${pendingMode}」已开启。`);
    setPendingMode(null);
    setPendingDelete(null);
  };

  const cancelEnableMode = () => {
    if (!pendingMode) return;
    setModeNotice(`已取消开启「${pendingMode}」。`);
    setPendingMode(null);
  };

  // Delete Handlers (status-bar confirmation)
  const writeInquisitorRoot = (root: Record<string, unknown>, nextInquisitor: Record<string, unknown>) => {
    const has圣裁官 = Object.prototype.hasOwnProperty.call(root, '圣裁官');
    const has主角 = Object.prototype.hasOwnProperty.call(root, '主角');
    const hasInquisitor = Object.prototype.hasOwnProperty.call(root, 'inquisitor');

    // 只写入一个角色字段，避免产生不必要的重复变量
    const targetKey: '圣裁官' | '主角' | 'inquisitor' =
      has圣裁官 ? '圣裁官' : has主角 ? '主角' : hasInquisitor ? 'inquisitor' : '主角';

    root[targetKey] = nextInquisitor;

    // 清理历史遗留的重复角色字段
    (['圣裁官', '主角', 'inquisitor'] as const).forEach(key => {
      if (key !== targetKey && Object.prototype.hasOwnProperty.call(root, key)) {
        delete root[key];
      }
    });
  };

  const doDeleteTitle = (index: number, label: string) => {
    const newTitles = [...inquisitor.称号];
    newTitles.splice(index, 1);
    setInquisitor(prev => ({ ...prev, 称号: newTitles }));

    persistRootMutation(root => {
      const currentInquisitor = (root.圣裁官 ?? root.主角 ?? root.inquisitor ?? {}) as Record<string, unknown>;
      const rawTitles = currentInquisitor.称号;
      let nextTitles: unknown = newTitles;

      // 保留原字段结构：若原本是对象，则删除对应 entry 后仍写回对象，避免 schema 报错
      if (rawTitles && typeof rawTitles === 'object' && !Array.isArray(rawTitles)) {
        const entries = Object.entries(rawTitles as Record<string, unknown>);
        entries.splice(index, 1);
        nextTitles = Object.fromEntries(entries);
      }

      const nextInquisitor = { ...currentInquisitor, 称号: nextTitles };
      writeInquisitorRoot(root, nextInquisitor);
    });
    setModeNotice(`已删除称号「${label}」。`);
  };

  const doDeleteItem = (index: number, label: string) => {
    const newInventory = [...inquisitor.物品栏];
    newInventory.splice(index, 1);
    setInquisitor(prev => ({ ...prev, 物品栏: newInventory }));

    persistRootMutation(root => {
      const currentInquisitor = (root.圣裁官 ?? root.主角 ?? root.inquisitor ?? {}) as Record<string, unknown>;
      const rawInventory = currentInquisitor.物品栏;
      let nextInventory: unknown = newInventory;

      // 保留原字段结构：若原本是对象，则删除对应 entry 后仍写回对象，避免 schema 报错
      if (rawInventory && typeof rawInventory === 'object' && !Array.isArray(rawInventory)) {
        const entries = Object.entries(rawInventory as Record<string, unknown>);
        entries.splice(index, 1);
        nextInventory = Object.fromEntries(entries);
      }

      const nextInquisitor = { ...currentInquisitor, 物品栏: nextInventory };
      writeInquisitorRoot(root, nextInquisitor);
    });
    setModeNotice(`已删除物品「${label}」。`);
  };

  const doDeleteVillain = (id: string, label: string) => {
    const nextVillains = villains.filter(v => v.id !== id);
    setVillains(nextVillains);

    persistRootMutation(root => {
      const asArray = nextVillains.map(v => ({ ...v }));
      const asObject = Object.fromEntries(nextVillains.map(v => [v.id, { ...v }]));

      root.反派列表 = asObject;
      root.反派 = asObject;
      root.villains = asArray;
    });
    setModeNotice(`已删除反派「${label}」。`);
  };

  const handleDeleteTitle = (index: number) => {
    const label = inquisitor.称号[index] ?? `称号#${index + 1}`;
    setPendingMode(null);
    setPendingDelete({ kind: 'title', index, label });
    setModeNotice(`确认删除称号「${label}」吗？`);
  };

  const handleDeleteItem = (index: number) => {
    const label = inquisitor.物品栏[index] ?? `物品#${index + 1}`;
    setPendingMode(null);
    setPendingDelete({ kind: 'item', index, label });
    setModeNotice(`确认删除物品「${label}」吗？`);
  };

  const handleDeleteVillain = (id: string) => {
    const label = villains.find(v => v.id === id)?.姓名 ?? id;
    setPendingMode(null);
    setPendingDelete({ kind: 'villain', id, label });
    setModeNotice(`确认删除反派「${label}」吗？`);
  };

  const confirmDeleteAction = () => {
    if (!pendingDelete) return;

    if (pendingDelete.kind === 'title') {
      doDeleteTitle(pendingDelete.index, pendingDelete.label);
    } else if (pendingDelete.kind === 'item') {
      doDeleteItem(pendingDelete.index, pendingDelete.label);
    } else {
      doDeleteVillain(pendingDelete.id, pendingDelete.label);
    }

    setPendingDelete(null);
  };

  const cancelDeleteAction = () => {
    if (!pendingDelete) return;
    setModeNotice(`已取消删除「${pendingDelete.label}」。`);
    setPendingDelete(null);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'world':
        return <WorldStatus world={worldState} />;
      case 'profile':
        return (
          <InquisitorProfile
            inquisitor={inquisitor}
            activeModes={activeGameModes}
            onToggleMode={toggleGameMode}
            onDeleteTitle={handleDeleteTitle}
            onDeleteItem={handleDeleteItem}
          />
        );
      case 'target':
        return (
          <VillainMonitor
            villains={villains}
            onDeleteVillain={handleDeleteVillain}
          />
        );
    }
  };

  return (
    <div className="relative flex w-full flex-col items-center overflow-x-hidden bg-[#09090b] p-4 font-sans text-gray-200 md:p-6">
      {/* Global Background Effects */}
      <div className="bg-metal-dark absolute inset-0 -z-20"></div>
      <div className="bg-grid-pattern pointer-events-none absolute inset-0 -z-10 opacity-5"></div>

      <div className="w-full max-w-5xl space-y-6">

        {/* Header Row: Status + Navigation */}
        <div className="flex h-auto flex-col gap-4 md:h-24 md:flex-row">

          {/* Global Status Bar (Minimal) */}
          <div className="group relative flex flex-1 items-center justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#1a1b1e] p-5 shadow-lg">
            <div className="bg-tech-blue absolute top-0 left-0 h-full w-1"></div>
            <div className="bg-brushed-metal pointer-events-none absolute inset-0 opacity-20"></div>

            <div className="z-10 flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                  <Clock size={20} className="text-tech-blue" />
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">时间</div>
                  <div className="font-display text-xl font-bold text-white">{worldState.时间}</div>
                </div>
              </div>

              <div className="h-10 w-px bg-white/10"></div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                  <MapPin size={20} className="text-purple-400" />
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">地点</div>
                  <div className="max-w-[200px] truncate text-sm font-bold text-white">{worldState.地点}</div>
                </div>
              </div>
            </div>

            <div className="z-10 flex flex-col items-end gap-2">
              <div className="hidden animate-pulse items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1 md:flex">
                <Radio size={14} className="text-green-500" />
                <span className="text-[10px] font-bold text-green-500">在线</span>
              </div>

              {pendingDelete ? (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                  <span>{`确认删除「${pendingDelete.label}」吗？`}</span>
                  <button
                    onClick={confirmDeleteAction}
                    className="rounded border border-red-500/40 bg-red-500/20 px-2 py-0.5 text-[11px] font-bold text-red-300 hover:bg-red-500/30"
                  >
                    删除
                  </button>
                  <button
                    onClick={cancelDeleteAction}
                    className="rounded border border-gray-500/40 bg-gray-500/20 px-2 py-0.5 text-[11px] font-bold text-gray-300 hover:bg-gray-500/30"
                  >
                    取消
                  </button>
                </div>
              ) : pendingMode ? (
                <div className="flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-200">
                  <span>{`是否开启「${pendingMode}」？`}</span>
                  <button
                    onClick={confirmEnableMode}
                    className="rounded border border-green-500/40 bg-green-500/20 px-2 py-0.5 text-[11px] font-bold text-green-300 hover:bg-green-500/30"
                  >
                    开启
                  </button>
                  <button
                    onClick={cancelEnableMode}
                    className="rounded border border-gray-500/40 bg-gray-500/20 px-2 py-0.5 text-[11px] font-bold text-gray-300 hover:bg-gray-500/30"
                  >
                    取消
                  </button>
                </div>
              ) : modeNotice ? (
                <div className="border-tech-blue/30 bg-tech-blue/10 text-tech-blue rounded-lg border px-3 py-2 text-xs">
                  {modeNotice}
                </div>
              ) : null}
            </div>
          </div>

          {/* Navigation (Right Side) */}
          <nav className="relative z-10 flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#1a1b1e] p-2 shadow-lg md:w-auto md:flex-row">
            <div className="bg-brushed-metal pointer-events-none absolute inset-0 rounded-2xl opacity-20"></div>

            {[
              { id: 'profile', icon: User, label: '圣裁官' },
              { id: 'world', icon: Globe, label: '世界' },
              { id: 'target', icon: Skull, label: '反派' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabId)}
                className={`
                            group relative flex flex-1 flex-col items-center justify-center gap-2 rounded-xl px-6 py-3 transition-all duration-300 md:h-full md:flex-none md:flex-row md:py-0
                            ${activeTab === item.id
                    ? 'bg-tech-blue/10 text-tech-blue ring-tech-blue/50 shadow-[0_0_15px_rgba(0,243,255,0.2)] ring-1'
                    : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                  }
                          `}
              >
                <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                <span className="text-xs font-bold whitespace-nowrap">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="animate-in fade-in slide-in-from-bottom-4 w-full duration-500">
          {renderActiveView()}
        </div>
      </div>
    </div>
  );
};

export default App;

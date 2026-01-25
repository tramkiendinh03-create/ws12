import { Schema } from '../schema';

// 从 schema 导出类型
export type MvuData = z.output<typeof Schema>;

// 世界信息类型
export interface WorldState {
  time: string; // 世界时间
  currentLocation: string; // 当前地点
  currentInteractionTarget: string; // 当前交互目标
  demonRealmPower: {
    value: number;
    description: string;
  };
}

// NPC 角色类型
export interface TargetCharacter {
  id: string;
  name: string;
  title: string; // 身份
  race?: string;
  level: string; // 等级 e.g., "Lv. 95"
  currentStatus: string; // 当前状态
  affection: {
    value: number;
    max: number;
    description: string; // 阶段
  };
  corruption: {
    // 迷堕度
    value: number;
    max: number;
    description: string; // 阶段
  };
  traits: {
    // 特征标签
    core: string; // 核心
    weakness: string; // 弱点
    special: string; // 特质
    xpTendency: string; // XP倾向
  };
  avatarUrl?: string;
}

// 成就类型
export interface Achievement {
  id: string;
  title: string; // 名称
  description: string; // 描述
  reward: string; // 奖励
  timestamp: number; // 获取时间
}

// 玩家状态类型
export interface PlayerStats {
  name: string; // 姓名
  avatarUrl?: string;
  race: string; // 当前形态
  currentForm: string; // 当前形态
  level: number; // 等级
  exp: number; // 经验值
  maxExp: number;
  mana: {
    current: number;
    max: number;
  };
  currentRole: string; // 当前扮演
  currentAppearance: string; // 外观气质
  equipment: {
    // 装备栏
    上装: string;
    下装: string;
    内衣: string;
    袜子: string;
    鞋子: string;
    饰品: string;
  };
  items: Record<string, string>; // 道具栏，值为描述字符串如"1个（灵魂绑定，不可丢弃）"
  skills: {
    // 核心能力
    passive: Record<string, string>; // 被动
    active: Record<string, string>; // 主动
  };
}

// 辅助函数：将 MVU 数据转换为组件所需的类型
export function transformMvuToWorldState(data: MvuData): WorldState {
  return {
    time: data.世界信息.世界时间,
    currentLocation: data.世界信息.当前地点,
    currentInteractionTarget: data.世界信息.当前交互目标,
    demonRealmPower: {
      value: data.世界信息.魔族国力.数值,
      description: data.世界信息.魔族国力.描述,
    },
  };
}

export function transformMvuToPlayerStats(data: MvuData): PlayerStats {
  const 主角状态 = data.主角状态;
  return {
    name: 主角状态.基础信息.姓名,
    race: 主角状态.基础信息.当前形态,
    currentForm: 主角状态.基础信息.当前形态,
    level: 主角状态.基础信息.等级,
    exp: 主角状态.基础信息.经验值,
    maxExp: 100, // 默认最大经验值
    mana: {
      current: 主角状态.基础信息.魔能.当前,
      max: 主角状态.基础信息.魔能.最大,
    },
    currentRole: 主角状态.基础信息.当前扮演,
    currentAppearance: 主角状态.基础信息.外观气质,
    equipment: 主角状态.装备栏,
    items: 主角状态.道具栏,
    skills: {
      passive: 主角状态.核心能力.被动,
      active: 主角状态.核心能力.主动,
    },
  };
}

export function transformMvuToTargets(data: MvuData): TargetCharacter[] {
  return Object.entries(data.NPC名册).map(([name, npc], index) => ({
    id: `target_${index}`,
    name,
    title: npc.身份,
    level: npc.等级,
    currentStatus: npc.当前状态,
    avatarUrl: npc.头像 || undefined, // 头像 URL
    affection: {
      value: npc.好感度.数值,
      max: npc.好感度.最大值,
      description: npc.好感度.阶段,
    },
    corruption: {
      value: npc.恶堕度.数值,
      max: npc.恶堕度.最大值,
      description: npc.恶堕度.阶段,
    },
    traits: {
      core: npc.特征标签.核心,
      weakness: npc.特征标签.弱点,
      special: npc.特征标签.特质,
      xpTendency: npc.特征标签.XP倾向,
    },
  }));
}

export function transformMvuToAchievements(data: MvuData): Achievement[] {
  return data.主角状态.最近成就.map((achievement, index) => ({
    id: `achievement_${index}`,
    title: achievement.名称,
    description: achievement.描述,
    reward: achievement.奖励,
    timestamp: achievement.获取时间,
  }));
}

// 旧版枚举保持兼容
export enum AffectionLevel {
  COLD = '冷淡警惕',
  NEUTRAL = '平淡如水',
  INTERESTED = '暧昧倾心',
  DEVOTED = '完全信赖与爱',
}

export enum CorruptionLevel {
  PURE = '纯净',
  TAINTED = '动摇',
  FALLEN = '半魔化/理智边缘',
  CONVERTED = '完全转化',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
}

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
  isCorrupted: boolean; // 是否恶堕
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
  avatarUrl?: string; // 手动设置的头像 URL
}

// CDN 图床基础 URL
const CDN_BASE_URL = 'https://cdn.jsdelivr.net/gh/tramkiendinh03-create/ws12@main/llmw';

// NPC 名字到图片文件名的映射（处理角色卡中的全名与图片文件名不一致的情况）
// 例如：角色卡中叫"莉莉丝·暗夜"，但图片文件名是"莉莉丝-原.png"
const NPC_NAME_MAPPING: Record<string, string> = {
  // 带有中间点的全名映射
  '莉莉丝·暗夜': '莉莉丝',
  '卡蜜拉·永夜': '卡蜜拉',
  '艾莉西亚·晨曦': '艾莉西亚',
  '奥菲莉亚·星辉': '奥菲莉亚',
  '露娜·月影': '露娜',
  '罗莎琳德·玫瑰': '罗莎琳德',
  '索菲亚·智慧': '索菲亚',
  '特蕾莎·圣光': '特蕾莎',
  '维罗妮卡·毒藤': '维罗妮卡',
  '阿黛莱德·黎明': '阿黛莱德',
  '阿娜斯塔西娅·冰霜': '阿娜斯塔西娅',
  '爱丽丝·梦境': '爱丽丝',
  '莉莉安·晨露': '莉莉安',
  '塞拉菲娜·炽焰': '塞拉菲娜',
  '希尔维娅·风语': '希尔维娅',
  '亚历克西斯·雷霆': '亚历克西斯',
  '伊莎贝拉·暮色': '伊莎贝拉',
  '玉藻前·狐火': '玉藻前',
  // 不带中间点的短名（直接映射自身）
  清虚子: '清虚子',
  凤漓: '凤漓',
  伊芙琳: '伊芙琳',
  阿黛莱德: '阿黛莱德',
  阿娜斯塔西娅: '阿娜斯塔西娅',
  艾莉西亚: '艾莉西亚',
  爱丽丝: '爱丽丝',
  奥菲莉亚: '奥菲莉亚',
  卡蜜拉: '卡蜜拉',
  莉莉安: '莉莉安',
  莉莉丝: '莉莉丝',
  露娜: '露娜',
  罗莎琳德: '罗莎琳德',
  塞拉菲娜: '塞拉菲娜',
  索菲亚: '索菲亚',
  特蕾莎: '特蕾莎',
  维罗妮卡: '维罗妮卡',
  希尔维娅: '希尔维娅',
  亚历克西斯: '亚历克西斯',
  伊莎贝拉: '伊莎贝拉',
  玉藻前: '玉藻前',
};

// 可用的 NPC 图片配置（基于 llmw 文件夹中的实际图片）
// 格式：图片文件名前缀 -> { 原: 是否有原版图片, 堕落: 是否有堕落版图片 }
const AVAILABLE_NPC_IMAGES: Record<string, { 原: boolean; 堕落: boolean }> = {
  阿黛莱德: { 原: true, 堕落: true },
  阿娜斯塔西娅: { 原: true, 堕落: true },
  艾莉西亚: { 原: true, 堕落: true }, // 注意：堕落版文件名为"艾莉西亚堕落.png"(无连字符)
  爱丽丝: { 原: true, 堕落: true },
  奥菲莉亚: { 原: true, 堕落: true },
  凤漓: { 原: true, 堕落: true },
  卡蜜拉: { 原: true, 堕落: true },
  莉莉安: { 原: true, 堕落: true },
  莉莉丝: { 原: true, 堕落: true },
  露娜: { 原: true, 堕落: true },
  罗莎琳德: { 原: true, 堕落: true },
  清虚子: { 原: true, 堕落: true },
  塞拉菲娜: { 原: true, 堕落: true },
  索菲亚: { 原: true, 堕落: true },
  特蕾莎: { 原: true, 堕落: true },
  维罗妮卡: { 原: true, 堕落: true },
  希尔维娅: { 原: true, 堕落: true },
  亚历克西斯: { 原: true, 堕落: true },
  伊芙琳: { 原: true, 堕落: true },
  伊莎贝拉: { 原: true, 堕落: true },
  玉藻前: { 原: true, 堕落: true },
};

// 特殊命名规则的 NPC（堕落版没有连字符）
const SPECIAL_NAMING_NPCS = ['艾莉西亚'];

/**
 * 模糊匹配 NPC 名字到可用的图片名前缀
 * 支持多种匹配策略：精确匹配、分割匹配、包含匹配
 * @param name NPC 姓名
 * @returns 匹配到的图片名前缀，如果没有匹配则返回 undefined
 */
function fuzzyMatchNpcName(name: string): string | undefined {
  // 策略1: 精确匹配映射表
  if (NPC_NAME_MAPPING[name]) {
    return NPC_NAME_MAPPING[name];
  }

  // 策略2: 直接匹配可用图片列表
  if (AVAILABLE_NPC_IMAGES[name]) {
    return name;
  }

  // 策略3: 分割中间点后取第一部分
  const shortName = name.split('·')[0];
  if (AVAILABLE_NPC_IMAGES[shortName]) {
    return shortName;
  }

  // 策略4: 分割连字符后取第一部分
  const hyphenName = name.split('-')[0];
  if (AVAILABLE_NPC_IMAGES[hyphenName]) {
    return hyphenName;
  }

  // 策略5: 检查可用图片名是否包含在输入名字中
  const availableNames = Object.keys(AVAILABLE_NPC_IMAGES);
  for (const availableName of availableNames) {
    if (name.includes(availableName)) {
      return availableName;
    }
  }

  // 策略6: 检查输入名字是否包含在可用图片名中
  for (const availableName of availableNames) {
    if (availableName.includes(name)) {
      return availableName;
    }
  }

  return undefined;
}

/**
 * 根据 NPC 姓名和是否恶堕状态生成图片 URL
 * @param name NPC 姓名（角色卡中的全名，如"莉莉丝·暗夜"，或短名如"伊芙琳"）
 * @param isCorrupted 是否恶堕（true -> 堕落版, false -> 原版）
 * @returns 图片 URL，如果 NPC 图片不可用则返回 undefined
 */
export function getNpcImageUrl(name: string, isCorrupted: boolean): string | undefined {
  // 使用模糊匹配获取图片文件名前缀
  const imageNamePrefix = fuzzyMatchNpcName(name);

  if (!imageNamePrefix) {
    return undefined;
  }

  // 检查 NPC 是否在可用图片列表中
  const npcConfig = AVAILABLE_NPC_IMAGES[imageNamePrefix];
  if (!npcConfig) {
    return undefined;
  }

  // 根据是否恶堕选择后缀：true -> "堕落", false -> "原"
  const suffix = isCorrupted ? '堕落' : '原';

  // 检查对应状态的图片是否存在
  if (!npcConfig[suffix]) {
    return undefined;
  }

  // 处理特殊命名规则（某些 NPC 的堕落版没有连字符）
  if (isCorrupted && SPECIAL_NAMING_NPCS.includes(imageNamePrefix)) {
    return `${CDN_BASE_URL}/${encodeURIComponent(imageNamePrefix)}${suffix}.png`;
  }

  return `${CDN_BASE_URL}/${encodeURIComponent(imageNamePrefix)}-${suffix}.png`;
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
  return Object.entries(data.NPC名册).map(([name, npc], index) => {
    const isCorrupted = npc.是否恶堕 ?? false;
    // 优先使用手动设置的头像，否则根据姓名和恶堕状态生成图片 URL
    const avatarUrl = npc.头像 || getNpcImageUrl(name, isCorrupted);

    return {
      id: `target_${index}`,
      name,
      title: npc.身份,
      race: npc.种族,
      level: npc.等级,
      currentStatus: npc.当前状态,
      isCorrupted,
      avatarUrl,
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
    };
  });
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

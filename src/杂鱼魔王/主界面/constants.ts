import { Achievement, PlayerStats, TargetCharacter, WorldState } from './types';

// Fallback 数据 - 当无法读取 MVU 变量时使用
export const INITIAL_PLAYER: PlayerStats = {
  name: '莉莉娜',
  avatarUrl: 'https://api.dicebear.com/9.x/notionists/svg?seed=Lilina&backgroundColor=1f1a29&hair=silver&eyes=red',
  race: '魅魔（幼体/未完全觉醒）',
  currentForm: '魅魔（幼体/未完全觉醒）',
  level: 1,
  exp: 0,
  maxExp: 100,
  mana: { current: 100, max: 100 },
  currentRole: '常态_可爱诱受',
  currentAppearance: '仿佛精致人偶般的白发红瞳萝莉，眼神纯真懵懂，却散发着原始的魅惑气息',
  equipment: {
    上装: '黑色哥特蕾丝露肩紧身衣',
    下装: '蓬松的多层荷叶边红黑短裙',
    内衣: '纯白棉质蝴蝶结胖次',
    袜子: '带有黑色蕾丝花边的过膝白丝袜',
    鞋子: '红色漆皮玛丽珍厚底鞋',
    饰品: '黑色缎带发饰（用于束起长发）',
  },
  items: {
    魔界复兴系统终端: '1个（灵魂绑定，不可丢弃）',
    魔王城大殿钥匙: '1把（锈迹斑斑）',
    姐姐的手帕: '1条（带有令人安心的幽香）',
    '支配者的嗜戒(仿)': '1枚（温润微热）',
    无名黑笔记: '1本（画着荆棘爱心）',
  },
  skills: {
    passive: {
      基础魅魔光环: '无意识散发微弱荷尔蒙，对同性产生天然吸引力，引发保护欲与破坏欲。',
      魔王潜能: '情绪剧烈波动时魔力暴走，显露虚幻的魔王威压。',
    },
    active: {
      好感度操控: '消耗5点魔能，感知并微调目标的当前情绪。',
      欲望感知: '消耗10点魔能，视觉化显示周围同性的欲望倾向与XP弱点。',
    },
  },
};

export const INITIAL_TARGETS: TargetCharacter[] = [
  {
    id: 'target_001',
    name: '莉莉丝',
    title: '前代魔王子嗣 / 双胞胎姐姐 / 深渊领主(封印中)',
    level: 'Lv. 95（封印状态）',
    currentStatus: '正常',
    isCorrupted: false,
    // 使用 CDN 图床图片，根据姓名和恶堕状态自动生成 URL
    avatarUrl: 'https://cdn.jsdelivr.net/gh/tramkiendinh03-create/ws12@main/llmw/莉莉丝-原.png',
    affection: {
      value: 65,
      max: 100,
      description: '扭曲的姐爱（表面轻视，实则占有）',
    },
    corruption: {
      value: 0,
      max: 100,
      description: '纯净（未染指）',
    },
    traits: {
      core: '高冷傲娇',
      weakness: '妹妹的真心 / 怕鬼',
      special: '极度妹控 / 隐藏M属性',
      xpTendency: '姐妹骨科 / 绝对支配',
    },
  },
];

export const INITIAL_WORLD: WorldState = {
  time: '第1天 初始之夜',
  currentLocation: '魔王寝宫（王座后）',
  currentInteractionTarget: '未知目标（床上）',
  demonRealmPower: {
    value: 5,
    description: '沉寂（仅剩断壁残垣，等待复苏）',
  },
};

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: '魔王觉醒',
    description: '成功激活魔王系统，在废墟中睁开双眼。',
    reward: '新手大礼包 x1',
    timestamp: 1716739200000,
  },
];

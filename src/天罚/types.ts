
export enum GameMode {
    NORMAL = '普通模式',
    CORRUPTION = '恶堕模式',
    MASOCHIST = '抖M模式',
    UNDERDOG = '下克上模式'
}

export enum ThreatLevel {
    E = 'E',
    D = 'D',
    C = 'C',
    B = 'B',
    A = 'A',
    S = 'S',
    SS = 'SS',
    SSS = 'SSS'
}

export interface Inquisitor {
    圣裁官姓名: string;
    性别: '男' | '女' | '无性' | '扶她';
    等级: number; // 0-999
    经验值: number; // 0-100
    善升点: number; // Currency
    身份: string;
    称号: string[];
    永久状态: string[];
    临时状态: string[];
    外貌: string;
    堕落值: number; // 0-100
    物品栏: string[];
}

export interface Villain {
    id: string; // Required for React keys
    姓名: string;
    种族: string;
    等级: number; // 0-999
    身份: string;
    临时状态: string;
    对圣裁官的态度: string;
    好感度: number; // 0-100
    善恶值: number; // -100 to 100
    威胁度: ThreatLevel;
    avatarUrl?: string; // Required for UI
}

export interface WorldState {
    当前任务世界名称: string;
    世界类型与基调: string;
    当前世界净化度: number; // 0-100
    已净化世界数: number;
    时间: string;
    地点: string;
    任务: string;
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'system' | 'villain';
    content: string;
    timestamp: string;
}

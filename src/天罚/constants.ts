
import { GameMode, Inquisitor, ThreatLevel, Villain, WorldState } from "./types";

export const INITIAL_WORLD_STATE: WorldState = {
    当前任务世界名称: "霓虹·赛博坦09号",
    世界类型与基调: "赛博朋克 / 高科技反乌托邦",
    当前世界净化度: 15,
    已净化世界数: 3,
    时间: "23:45",
    地点: "第7区 - 核心控制塔 - 顶层套房",
    任务: "潜入反抗军高层，通过精神控制或肉体征服，瓦解其首领'莉莉丝'的意志，将其收编为联邦走狗。"
};

export const INITIAL_INQUISITOR: Inquisitor = {
    圣裁官姓名: "亚弗戈蒙",
    性别: "男",
    等级: 78,
    经验值: 45,
    善升点: 12500,
    身份: "联邦特级审判官",
    称号: ["异端处刑者", "钢铁意志"],
    永久状态: ["精神强韧 Lv.MAX", "机械义眼"],
    临时状态: [],
    外貌: "身着漆黑的处刑官制服，银色长发束在脑后，右眼为散发着红光的机械义眼，手中握着名为'断罪'的充能手杖。",
    堕落值: 5,
    物品栏: ["高压电击项圈", "纳米自白剂", "记忆修改芯片", "旧世界的相片"]
};

export const INITIAL_VILLAIN: Villain = {
    id: "v1",
    姓名: "莉莉丝·V·阿克拉",
    种族: "改造生化人 / 吸血鬼始祖",
    等级: 120,
    身份: "夜之城地下女皇",
    临时状态: "轻蔑，手持红酒杯摇晃，眼神中透露着对联邦的不屑",
    对圣裁官的态度: "充满敌意，试图寻找你的弱点，言语间带着挑衅",
    好感度: 12,
    善恶值: -85,
    威胁度: ThreatLevel.S,
    avatarUrl: "https://picsum.photos/200/200"
};

export const INITIAL_VILLAINS: Villain[] = [
    INITIAL_VILLAIN,
    {
        id: "v2",
        姓名: "代号：零",
        种族: "强人工智能 / 机械飞升者",
        等级: 99,
        身份: "旧网幽灵",
        临时状态: "数据流紊乱，正在尝试暴力破解圣裁官的防火墙",
        对圣裁官的态度: "冷漠，正在计算击杀胜率",
        好感度: 0,
        善恶值: -10,
        威胁度: ThreatLevel.SS,
        avatarUrl: "https://picsum.photos/200/201"
    },
    {
        id: "v3",
        姓名: "奥古斯都·凯撒",
        种族: "人类 / 独裁者",
        等级: 45,
        身份: "第7区总督",
        临时状态: "极度恐慌，在办公室来回踱步，试图销毁文件",
        对圣裁官的态度: "畏惧，试图通过巨额贿赂保全性命",
        好感度: -20,
        善恶值: -60,
        威胁度: ThreatLevel.B,
        avatarUrl: "https://picsum.photos/200/202"
    },
    {
        id: "v4",
        姓名: "实验体-734",
        种族: "变异生物",
        等级: 210,
        身份: "下水道之王",
        临时状态: "狂暴，饥饿感占据了理智",
        对圣裁官的态度: "单纯的杀戮欲望",
        好感度: 0,
        善恶值: -90,
        威胁度: ThreatLevel.A,
        avatarUrl: "https://picsum.photos/200/203"
    }
];

export const MODES_DESCRIPTION = {
    [GameMode.CORRUPTION]: "<user>不再无敌，有可能被对方击败并且反向污染恶堕(男性强行变为女性，种族和力量污染)",
    [GameMode.MASOCHIST]: "<user>是抖m，通过受虐和被调教治愈反派，从而净化反派",
    [GameMode.UNDERDOG]: "<user>穿越成当前世界身份低微的存在，但保留天罚神力，对地位高高在上的反派进行征服",
    [GameMode.NORMAL]: "标准执行协议：圣裁官拥有绝对主导权。"
};

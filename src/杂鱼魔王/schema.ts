// 杂鱼魔王 MVU 变量结构定义
// 根据变量管理器截图中的实际变量结构

export const Schema = z.object({
  世界信息: z
    .object({
      世界时间: z.string().prefault('第1天 初始之夜'),
      当前地点: z.string().prefault('魔王寝宫（王座后）'),
      当前交互目标: z.string().prefault('未知目标（床上）'),
      魔族国力: z
        .object({
          数值: z.coerce.number().prefault(5),
          描述: z.string().prefault('沉寂（仅剩断壁残垣，等待复苏）'),
        })
        .prefault({}),
    })
    .prefault({}),

  NPC名册: z
    .record(
      z.string().describe('NPC名字'),
      z
        .object({
          种族: z.string().prefault('未知'),
          身份: z.string().prefault(''),
          等级: z.string().prefault('Lv. 1'),
          当前状态: z.string().prefault('正常'),
          是否恶堕: z.boolean().prefault(false),
          头像: z.string().prefault(''), // 头像 URL (手动设置时使用)
          好感度: z
            .object({
              数值: z.coerce
                .number()
                .transform(v => _.clamp(v, 0, 100))
                .prefault(0),
              最大值: z.coerce.number().prefault(100),
              阶段: z.string().prefault('冷淡警惕'),
            })
            .prefault({}),
          恶堕度: z
            .object({
              数值: z.coerce
                .number()
                .transform(v => _.clamp(v, 0, 100))
                .prefault(0),
              最大值: z.coerce.number().prefault(100),
              阶段: z.string().prefault('纯净'),
            })
            .prefault({}),
          特征标签: z
            .object({
              核心: z.string().prefault(''),
              弱点: z.string().prefault(''),
              特质: z.string().prefault(''),
              XP倾向: z.string().prefault(''),
            })
            .prefault({}),
        })
        .prefault({})
        .transform(npc => {
          // 逻辑一致性：恶堕度不足 80 时强制设为未恶堕
          if (npc.恶堕度.数值 < 80) {
            npc.是否恶堕 = false;
          }
          return npc;
        }),
    )
    .prefault({}),

  主角状态: z
    .object({
      基础信息: z
        .object({
          姓名: z.string().prefault('莉莉娜'),
          当前形态: z.string().prefault('魅魔（幼体/未完全觉醒）'),
          等级: z.coerce.number().prefault(1),
          经验值: z.coerce.number().prefault(0),
          金币: z.coerce.number().prefault(0),
          魔能: z
            .object({
              当前: z.coerce.number().prefault(100),
              最大: z.coerce.number().prefault(100),
            })
            .prefault({}),
          当前扮演: z.string().prefault('常态_可爱诱受'),
          外观气质: z.string().prefault('仿佛精致人偶般的白发红瞳萝莉，眼神纯真懵懂，却散发着原始的魅惑气息'),
        })
        .prefault({}),
      装备栏: z
        .object({
          上装: z.string().prefault(''),
          下装: z.string().prefault(''),
          内衣: z.string().prefault(''),
          袜子: z.string().prefault(''),
          鞋子: z.string().prefault(''),
          饰品: z.string().prefault(''),
        })
        .prefault({}),
      道具栏: z
        .record(z.string().describe('道具名'), z.string().describe('道具描述，如"1个（灵魂绑定，不可丢弃）"'))
        .prefault({}),
      核心能力: z
        .object({
          被动: z.record(z.string().describe('技能名'), z.string().describe('技能描述')).prefault({}),
          主动: z.record(z.string().describe('技能名'), z.string().describe('技能描述')).prefault({}),
        })
        .prefault({}),
      最近成就: z
        .array(
          z.object({
            名称: z.string(),
            描述: z.string(),
            奖励: z.string(),
            获取时间: z.coerce.number(),
          }),
        )
        .prefault([]),
    })
    .prefault({}),
});

export type Schema = z.output<typeof Schema>;

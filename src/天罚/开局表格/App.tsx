import { Send, Sparkles, UserRound } from 'lucide-react';
import React, { useState } from 'react';

type Gender = '男' | '女' | '无性' | '扶她';
type StartMode = '抖M模式' | '下克上模式' | '恶堕模式';

interface StartFormData {
  姓名: string;
  性别: Gender;
  外貌: string;
  模式: StartMode[];
  世界: string;
  额外背景: string;
}

const GENDER_OPTIONS: Gender[] = ['男', '女', '无性', '扶她'];
const MODE_OPTIONS: StartMode[] = ['抖M模式', '下克上模式', '恶堕模式'];

const WORLD_OPTIONS = [
  '黯晶之泪·瓦尔普吉斯之夜',
  '青璃世界',
  '永战大陆·阿瑞西亚',
  '霓虹幻都',
  '极乐堕天之域',
  '百鬼夜行·祸乱华都',
  '蜃楼之国·华胥幻境',
  '破碎童话·镜中恶堕王国',
  '第七演算都市·伊甸阵列',
];

const DEFAULT_FORM: StartFormData = {
  姓名: '',
  性别: '女',
  外貌: '',
  模式: [],
  世界: '',
  额外背景: '',
};

type Runtime = {
  createChatMessages?: (
    chat_messages: Array<{
      role: 'system' | 'assistant' | 'user';
      message: string;
      name?: string;
      is_hidden?: boolean;
      data?: Record<string, any>;
      extra?: Record<string, any>;
    }>,
    option?: { insert_before?: number | 'end'; refresh?: 'none' | 'affected' | 'all' },
  ) => Promise<void>;
};

const runtime = window as unknown as Runtime;

const App: React.FC = () => {
  const [form, setForm] = useState<StartFormData>(DEFAULT_FORM);
  const [notice, setNotice] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);

  const update = <K extends keyof StartFormData>(key: K, value: StartFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const toggleMode = (mode: StartMode) => {
    const has = form.模式.includes(mode);
    const next = has ? form.模式.filter(item => item !== mode) : [...form.模式, mode];
    update('模式', next);
  };

  const sendOpening = async () => {
    if (sending) return;

    if (!form.姓名.trim()) {
      setNotice('请先填写姓名。');
      return;
    }
    if (!form.外貌.trim()) {
      setNotice('请先填写外貌。');
      return;
    }
    if (!form.世界.trim()) {
      setNotice('请先选择世界。');
      return;
    }
    if (form.模式.length === 0) {
      setNotice('请至少选择一个模式。');
      return;
    }

    if (typeof runtime.createChatMessages !== 'function') {
      setNotice('发送失败：酒馆接口不可用。');
      return;
    }

    const opening = [
      '[开局表格]',
      `姓名：${form.姓名.trim()}`,
      `性别：${form.性别}`,
      `外貌：${form.外貌.trim()}`,
      `模式：${form.模式.join('、')}`,
      `世界：${form.世界.trim()}`,
      `额外背景：${form.额外背景.trim() || '无'}`,
      '',
      '【执行要求】',
      '1. 请严格按以上设定开始剧情并立即推进首轮剧情事件。',
      '2. 上述仅为玩家显式填写项；对于未填写或未提及的变量，请你根据世界观与开局情境自行补全并初始化为合理值。',
      '3. 变量输出必须完整、可解析、与现有变量结构兼容；不得省略关键字段，不得留空占位，不得输出“待补充/略”。',
      '4. 若出现冲突，以玩家明确填写内容为最高优先级，其余变量按不冲突原则补完。',
      '5. 在本轮回复中同步给出“任务发布”内容，并确保与已补全变量一致。',
    ].join('\n');

    try {
      setSending(true);
      await runtime.createChatMessages(
        [
          {
            role: 'user',
            message: opening,
          },
        ],
        { insert_before: 'end', refresh: 'affected' },
      );
      setNotice('已发送开局设定到聊天楼层。');
    } catch (error) {
      console.warn('[天罚-开局表格] 发送开局失败', error);
      setNotice('发送失败，请查看控制台。');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="start-form-page mx-auto w-full max-w-5xl p-4 text-gray-200 md:p-6">
      <div className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-gray-400 uppercase">
        <Sparkles size={16} className="text-yellow-400" />
        天罚 · 开局表格
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-white/10 bg-[#1a1b1e] p-4 shadow-lg lg:col-span-2">
          <div className="mb-4 text-sm font-bold text-white">玩家开局填写</div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wider text-gray-300 uppercase">
                <UserRound size={14} />
                姓名
              </span>
              <input
                type="text"
                value={form.姓名}
                onChange={e => update('姓名', e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/40"
                placeholder="输入角色姓名"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold tracking-wider text-gray-300 uppercase">性别</span>
              <select
                value={form.性别}
                onChange={e => update('性别', e.target.value as Gender)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/40"
              >
                {GENDER_OPTIONS.map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-xs font-bold tracking-wider text-gray-300 uppercase">外貌</span>
              <textarea
                value={form.外貌}
                onChange={e => update('外貌', e.target.value)}
                rows={3}
                className="w-full resize-y rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm leading-relaxed text-white outline-none"
                placeholder="例如：身着神圣法袍，面容庄严冷峻"
              />
            </label>

            <div className="block">
              <span className="mb-2 block text-xs font-bold tracking-wider text-gray-300 uppercase">模式（可多选）</span>
              <div className="space-y-2 rounded-lg border border-white/10 bg-black/40 px-3 py-3">
                {MODE_OPTIONS.map(mode => {
                  const checked = form.模式.includes(mode);
                  return (
                    <label key={mode} className="flex cursor-pointer items-center gap-2 text-sm text-white">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleMode(mode)}
                        className="h-4 w-4 rounded border-white/20 bg-black/40 accent-cyan-400"
                      />
                      <span>{mode}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-bold tracking-wider text-gray-300 uppercase">世界</span>
              <input
                list="start-worlds"
                value={form.世界}
                onChange={e => update('世界', e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/40"
                placeholder="输入或选择世界"
              />
              <datalist id="start-worlds">
                {WORLD_OPTIONS.map(item => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-xs font-bold tracking-wider text-gray-300 uppercase">额外背景</span>
              <textarea
                value={form.额外背景}
                onChange={e => update('额外背景', e.target.value)}
                rows={4}
                className="w-full resize-y rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm leading-relaxed text-white outline-none"
                placeholder="可填写补充背景、偏好、禁忌或剧情前置说明..."
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#1a1b1e] p-4 shadow-lg">
          <div className="mb-4 text-sm font-bold text-white">操作</div>

          <div className="space-y-2 rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-gray-300">
            <div>只填写：姓名、性别、外貌、模式（多选）、世界、额外背景。</div>
            <div>点击「发送开局」后，会直接代替你发送到聊天楼层。</div>
            <div>不写入变量。</div>
          </div>

          <div className="mt-4 rounded-lg border border-white/10 bg-black/30 p-3 text-sm">
            <div className="mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">预览</div>
            <div className="space-y-1">
              <div>
                <span className="text-gray-500">姓名：</span><span className="text-white">{form.姓名 || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500">性别：</span><span className="text-white">{form.性别 || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500">模式：</span>
                <span className="text-white">{form.模式.length ? form.模式.join('、') : '-'}</span>
              </div>
              <div>
                <span className="text-gray-500">世界：</span><span className="text-white">{form.世界 || '-'}</span>
              </div>
            </div>
          </div>

          {notice ? (
            <div className="mt-3 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-300">
              {notice}
            </div>
          ) : null}

          <div className="mt-4 grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={sendOpening}
              disabled={sending}
              className="flex items-center justify-center gap-2 rounded-lg border border-green-500/30 bg-green-500/15 px-3 py-3 text-sm font-bold text-green-300 transition enabled:hover:bg-green-500/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={16} />
              {sending ? '发送中…' : '发送开局'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;

import { Dice5, FileCheck2, Sparkles, UserRound } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import MetalContainer from '../UI/MetalContainer';

export interface StartFormData {
  姓名: string;
  性别: '男' | '女' | '无性' | '扶她';
  身份: string;
  出生世界: string;
  开局职业: string;
  初始天赋: string[];
  开局宣言: string;
}

interface StartFormProps {
  value: StartFormData;
  onChange: (next: StartFormData) => void;
  onConfirm: (data: StartFormData) => void;
}

const TALENT_OPTIONS = [
  '钢铁意志',
  '战术直觉',
  '机械亲和',
  '审判威压',
  '魅惑抗性',
  '语言通晓',
  '神经加速',
  '危险预知',
];

const IDENTITY_OPTIONS = [
  '联邦审判官',
  '灰区执法者',
  '流亡圣职者',
  '地下情报贩子',
  '异端净化使',
  '废土拾荒领队',
];

const JOB_OPTIONS = [
  '圣裁官',
  '战地医师',
  '渗透特工',
  '义体技师',
  '灵能调查员',
  '城区巡猎者',
];

const WORLD_OPTIONS = [
  '霓虹·赛博坦09号',
  '废都·灰烬环',
  '圣域·终焉塔',
  '海雾·深潜港',
  '冻原·白昼站',
  '裂隙·无光城',
];

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffle<T>(list: T[]): T[] {
  return [...list].sort(() => Math.random() - 0.5);
}

const StartForm: React.FC<StartFormProps> = ({ value, onChange, onConfirm }) => {
  const [notice, setNotice] = useState<string>('');

  const selectedTalentSet = useMemo(() => new Set(value.初始天赋), [value.初始天赋]);

  const updateField = <K extends keyof StartFormData>(key: K, next: StartFormData[K]) => {
    onChange({ ...value, [key]: next });
  };

  const toggleTalent = (talent: string) => {
    const has = selectedTalentSet.has(talent);
    const next = has
      ? value.初始天赋.filter(t => t !== talent)
      : [...value.初始天赋, talent].slice(0, 4);
    onChange({ ...value, 初始天赋: next });
  };

  const handleRandom = () => {
    const randomTalents = shuffle(TALENT_OPTIONS).slice(0, 3);
    onChange({
      姓名: `代行者-${Math.floor(1000 + Math.random() * 9000)}`,
      性别: pick(['男', '女', '无性', '扶她']),
      身份: pick(IDENTITY_OPTIONS),
      出生世界: pick(WORLD_OPTIONS),
      开局职业: pick(JOB_OPTIONS),
      初始天赋: randomTalents,
      开局宣言: '我将以天罚之名，清算一切罪恶与亵渎。',
    });
    setNotice('已随机生成一组开局配置。');
  };

  const submit = () => {
    onConfirm(value);
    setNotice('开局配置已确认并写入当前楼层变量。');
  };

  return (
    <div className="grid h-auto grid-cols-1 gap-6 lg:grid-cols-3">
      <MetalContainer title="开局档案" glowColor="gold" className="lg:col-span-2">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wider text-gray-300 uppercase">
              <UserRound size={14} />
              姓名
            </span>
            <input
              type="text"
              value={value.姓名}
              onChange={e => updateField('姓名', e.target.value)}
              className="focus:border-tech-blue/40 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white transition outline-none"
              placeholder="输入角色姓名"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold tracking-wider text-gray-300 uppercase">性别</span>
            <select
              value={value.性别}
              onChange={e => updateField('性别', e.target.value as StartFormData['性别'])}
              className="focus:border-tech-blue/40 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white transition outline-none"
            >
              <option value="男">男</option>
              <option value="女">女</option>
              <option value="无性">无性</option>
              <option value="扶她">扶她</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold tracking-wider text-gray-300 uppercase">身份</span>
            <input
              list="start-identities"
              value={value.身份}
              onChange={e => updateField('身份', e.target.value)}
              className="focus:border-tech-blue/40 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white transition outline-none"
              placeholder="输入或选择身份"
            />
            <datalist id="start-identities">
              {IDENTITY_OPTIONS.map(item => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold tracking-wider text-gray-300 uppercase">出生世界</span>
            <input
              list="start-worlds"
              value={value.出生世界}
              onChange={e => updateField('出生世界', e.target.value)}
              className="focus:border-tech-blue/40 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white transition outline-none"
              placeholder="输入或选择世界"
            />
            <datalist id="start-worlds">
              {WORLD_OPTIONS.map(item => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-xs font-bold tracking-wider text-gray-300 uppercase">开局职业</span>
            <input
              list="start-jobs"
              value={value.开局职业}
              onChange={e => updateField('开局职业', e.target.value)}
              className="focus:border-tech-blue/40 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white transition outline-none"
              placeholder="输入或选择职业"
            />
            <datalist id="start-jobs">
              {JOB_OPTIONS.map(item => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </label>

          <div className="md:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-gray-300 uppercase">初始天赋（最多4个）</span>
              <span className="text-[10px] text-gray-500">{value.初始天赋.length}/4</span>
            </div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {TALENT_OPTIONS.map(talent => {
                const active = selectedTalentSet.has(talent);
                return (
                  <button
                    key={talent}
                    type="button"
                    onClick={() => toggleTalent(talent)}
                    className={`rounded-lg border px-2 py-2 text-xs font-bold transition ${active
                        ? 'border-tech-blue/50 bg-tech-blue/15 text-tech-blue'
                        : 'border-white/10 bg-black/40 text-gray-300 hover:border-white/30'
                      }`}
                  >
                    {talent}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-xs font-bold tracking-wider text-gray-300 uppercase">开局宣言</span>
            <textarea
              value={value.开局宣言}
              onChange={e => updateField('开局宣言', e.target.value)}
              rows={4}
              className="custom-scrollbar w-full resize-y rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm leading-relaxed text-white transition outline-none focus:border-tech-blue/40"
              placeholder="写下角色开局宣言..."
            />
          </label>
        </div>
      </MetalContainer>

      <MetalContainer title="开局操作" glowColor="blue" className="h-full">
        <div className="flex h-full flex-col gap-4">
          <div className="rounded-lg border border-white/10 bg-black/40 p-4 text-xs leading-relaxed text-gray-300">
            <div className="mb-2 flex items-center gap-2 font-bold text-white">
              <Sparkles size={14} className="text-yellow-400" />
              使用说明
            </div>
            <ul className="list-disc space-y-1 pl-5">
              <li>填写后点击「确认开局」将写入当前消息楼层变量。</li>
              <li>姓名、身份、世界会同步到状态栏字段。</li>
              <li>可先点击「随机生成」快速得到一套配置。</li>
            </ul>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/40 p-4">
            <div className="mb-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase">当前预览</div>
            <div className="space-y-1 text-sm">
              <div><span className="text-gray-500">姓名：</span><span className="text-white">{value.姓名 || '-'}</span></div>
              <div><span className="text-gray-500">性别：</span><span className="text-white">{value.性别 || '-'}</span></div>
              <div><span className="text-gray-500">职业：</span><span className="text-white">{value.开局职业 || '-'}</span></div>
            </div>
          </div>

          {notice ? (
            <div className="border-tech-blue/30 bg-tech-blue/10 text-tech-blue rounded-lg border px-3 py-2 text-xs">
              {notice}
            </div>
          ) : null}

          <div className="mt-auto grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleRandom}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-3 text-sm font-bold text-gray-200 transition hover:bg-white/10"
            >
              <Dice5 size={16} />
              随机生成
            </button>
            <button
              type="button"
              onClick={submit}
              className="flex items-center justify-center gap-2 rounded-lg border border-green-500/30 bg-green-500/15 px-3 py-3 text-sm font-bold text-green-300 transition hover:bg-green-500/25"
            >
              <FileCheck2 size={16} />
              确认开局
            </button>
          </div>
        </div>
      </MetalContainer>
    </div>
  );
};

export default StartForm;

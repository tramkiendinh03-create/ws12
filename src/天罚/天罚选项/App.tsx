import React, { useMemo } from 'react';

type OptionKey = 'A' | 'B' | 'C' | 'D';
type ParsedOptions = Record<OptionKey, string>;

const EMPTY_OPTIONS: ParsedOptions = {
  A: '',
  B: '',
  C: '',
  D: '',
};

function normalizeText(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function parseLetteredOptions(text: string): ParsedOptions {
  const result: ParsedOptions = { ...EMPTY_OPTIONS };
  const normalized = normalizeText(text);

  const regex = /(?:^|\n)\s*([ABCD])\.\s*([\s\S]*?)(?=(?:\n\s*[ABCD]\.\s*)|$)/gi;
  let match: RegExpExecArray | null = regex.exec(normalized);

  while (match) {
    const key = match[1].toUpperCase() as OptionKey;
    const value = match[2]?.trim() ?? '';
    if (value) result[key] = value;
    match = regex.exec(normalized);
  }

  return result;
}

function parseFromOptionBlock(text: string): ParsedOptions {
  const normalized = normalizeText(text);
  const blockMatch = normalized.match(/<option>([\s\S]*?)<\/option>/i);
  if (!blockMatch) return { ...EMPTY_OPTIONS };
  return parseLetteredOptions(blockMatch[1]);
}

function parseFromWholeText(text: string): ParsedOptions {
  return parseLetteredOptions(text);
}

function parseOptions(text: string): ParsedOptions {
  const byBlock = parseFromOptionBlock(text);
  if (Object.values(byBlock).some(Boolean)) return byBlock;
  return parseFromWholeText(text);
}

function readCurrentMessageText(): string {
  try {
    const runtime = window as any;
    const messageId = runtime.getCurrentMessageId?.();
    const messages = runtime.getChatMessages?.(messageId);
    return messages?.[0]?.message ?? '';
  } catch (error) {
    console.warn('[天罚-天罚选项] 读取当前楼层消息失败', error);
    return '';
  }
}

function setSendBarText(text: string): boolean {
  const selectors = [
    '#send_textarea',
    'textarea#send_textarea',
    'textarea[name="send_textarea"]',
    '.send_textarea',
    '.chat-input textarea',
    '#chat-input textarea',
    'textarea[placeholder*="Message"]',
    'textarea[placeholder*="消息"]',
  ];

  const windows: Window[] = [];
  let current: Window | null = window;
  while (current) {
    if (!windows.includes(current)) windows.push(current);
    if (current === current.parent) break;
    try {
      // 跨域会抛错，同域则可继续向上
      void current.parent.document;
      current = current.parent;
    } catch {
      break;
    }
  }

  const setNativeValue = (el: HTMLTextAreaElement | HTMLInputElement, value: string) => {
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
    if (descriptor?.set) {
      descriptor.set.call(el, value);
    } else {
      el.value = value;
    }
  };

  // 1) 先用每一层 window 的 jQuery，优先可见输入框
  for (const w of windows) {
    try {
      const jq = (w as Window & { $?: any; jQuery?: any }).$ || (w as Window & { jQuery?: any }).jQuery;
      if (typeof jq !== 'function') continue;

      for (const selector of selectors) {
        const $all = jq(selector);
        if (!$all || $all.length === 0) continue;

        const $visible = $all.filter(':visible').filter((_: number, el: Element) => !(el as HTMLInputElement).disabled);
        const $target = $visible.length > 0 ? $visible.first() : $all.first();

        if ($target && $target.length > 0) {
          $target.val(text);
          $target.trigger('input');
          $target.trigger('change');
          $target.trigger('keyup');
          $target.focus();
          return true;
        }
      }
    } catch (error) {
      console.warn('[天罚-天罚选项] jQuery 写入失败，尝试其他上下文', error);
    }
  }

  // 2) DOM 回退：遍历每一层 document，优先可见元素
  const selectorText = selectors.join(', ');

  for (const w of windows) {
    const doc = w.document;
    const nodes = Array.from(doc.querySelectorAll<HTMLElement>(selectorText));
    if (nodes.length === 0) continue;

    const target =
      nodes.find(node => {
        const style = w.getComputedStyle(node);
        return style.display !== 'none' && style.visibility !== 'hidden' && node.offsetParent !== null;
      }) ?? nodes[0];

    if (target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement) {
      setNativeValue(target, text);
      target.dispatchEvent(new Event('input', { bubbles: true }));
      target.dispatchEvent(new Event('change', { bubbles: true }));
      target.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));
      target.focus();
      return true;
    }

    if (target.isContentEditable) {
      target.textContent = text;
      target.dispatchEvent(new Event('input', { bubbles: true }));
      target.dispatchEvent(new Event('change', { bubbles: true }));
      target.focus();
      return true;
    }

    const nestedInput = target.querySelector<HTMLInputElement | HTMLTextAreaElement>('textarea, input');
    if (nestedInput) {
      setNativeValue(nestedInput, text);
      nestedInput.dispatchEvent(new Event('input', { bubbles: true }));
      nestedInput.dispatchEvent(new Event('change', { bubbles: true }));
      nestedInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));
      nestedInput.focus();
      return true;
    }
  }

  return false;
}

const App: React.FC = () => {
  const options = useMemo(() => parseOptions(readCurrentMessageText()), []);

  const handleClick = (key: OptionKey) => {
    const value = options[key];
    if (!value) return;

    const success = setSendBarText(value);
    if (!success) {
      console.warn(`[天罚-天罚选项] 未找到发送栏，无法填入选项 ${key}`);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl p-1.5 md:p-2">
      <div className="mb-2 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-300/80 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-200/80 uppercase">TACTICAL OPTIONS</span>
        </div>
        <span className="rounded border border-cyan-300/25 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-cyan-100/90">
          ONLINE
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
        {(['A', 'B', 'C', 'D'] as OptionKey[]).map(key => {
          const value = options[key];
          const disabled = !value;

          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => handleClick(key)}
              className="group relative overflow-hidden rounded-xl border border-cyan-300/28 bg-[linear-gradient(140deg,rgba(7,24,40,0.96),rgba(10,42,67,0.93)_45%,rgba(7,30,52,0.95))] px-3.5 py-2.5 text-left text-gray-100 shadow-[inset_0_1px_0_rgba(148,220,255,0.16),inset_0_0_0_1px_rgba(34,211,238,0.12),0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-[1px] hover:border-cyan-200/70 hover:shadow-[inset_0_1px_0_rgba(196,244,255,0.26),inset_0_0_0_1px_rgba(56,189,248,0.34),0_0_18px_rgba(34,211,238,0.3)] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-200/85 to-transparent opacity-75" />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent opacity-70" />
              <span className="pointer-events-none absolute top-0 left-0 h-2.5 w-2.5 border-t border-l border-cyan-200/65 opacity-80 transition group-hover:opacity-100" />
              <span className="pointer-events-none absolute top-0 right-0 h-2.5 w-2.5 border-t border-r border-cyan-200/65 opacity-80 transition group-hover:opacity-100" />
              <span className="pointer-events-none absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-cyan-200/65 opacity-80 transition group-hover:opacity-100" />
              <span className="pointer-events-none absolute right-0 bottom-0 h-2.5 w-2.5 border-r border-b border-cyan-200/65 opacity-80 transition group-hover:opacity-100" />
              <span className="pointer-events-none absolute top-1.5 right-2 text-[9px] font-semibold tracking-[0.16em] text-cyan-100/50 uppercase">
                Unit-{key}
              </span>

              <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <div className="absolute -top-10 -left-10 h-24 w-24 rounded-full bg-cyan-300/12 blur-2xl" />
                <div className="absolute -right-8 -bottom-8 h-20 w-20 rounded-full bg-blue-300/10 blur-2xl" />
              </div>

              <div className="relative flex items-start gap-2.5">
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-violet-200/45 bg-[radial-gradient(circle_at_30%_25%,rgba(196,181,253,0.45),rgba(99,102,241,0.22)_55%,rgba(30,41,59,0.2))] text-sm font-black tracking-wide text-violet-50 shadow-[0_0_10px_rgba(139,92,246,0.35)]">
                  {key}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-2 text-[17px] leading-6 font-semibold text-slate-50 drop-shadow-[0_0_8px_rgba(125,211,252,0.15)]">
                    {value || ' '}
                  </div>
                  <div className="mt-1 h-[2px] w-full overflow-hidden rounded-full bg-cyan-950/60">
                    <span className="block h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-400/85 via-sky-300/70 to-transparent transition-all duration-300 group-hover:w-full" />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default App;

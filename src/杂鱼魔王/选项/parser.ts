// 选项文本解析器

import type { ParsedOption } from './types';

/**
 * 解析选项文本，识别 A. B. C. D. E. 格式的选项
 *
 * 支持多种格式：
 * A. 【标题】 "内容..." (预测结果: ...)
 * A. 【标题】 "内容..."（预测结果: ...）
 * A. 标题内容...
 * A、标题内容...
 */
export function parseOptions(rawText: string): ParsedOption[] {
  const options: ParsedOption[] = [];
  const lines = rawText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  for (const line of lines) {
    // 尝试匹配 X. 【标题】 格式
    let match = line.match(/^([A-E])\.\s*【([^】]+)】\s*(.+)$/);

    if (match) {
      const [, id, title, rest] = match;

      // 移除 <user> 等 HTML 标签
      const cleanRest = rest.replace(/<[^>]+>/g, '');

      // 提取引号内的内容（如果有）
      const quotedMatch = cleanRest.match(/"([^"]+)"/);
      let content = quotedMatch ? quotedMatch[1] : cleanRest;

      // 如果没有引号，尝试提取到预测结果之前的内容
      if (!quotedMatch) {
        const beforePrediction = cleanRest.split(/[（(]预测结果/)[0];
        content = beforePrediction.trim();
      }

      // 提取预测结果（如果有）
      const predictionMatch = cleanRest.match(/[（(]预测结果[:：]\s*([^）)]+)[）)]/);
      const prediction = predictionMatch ? predictionMatch[1] : '';

      // 从标题中提取图标
      const iconMatch = title.match(/[♡☆!♪♫★✦✧❤️💖🌟⭐✨💫]/);
      const icon = iconMatch ? iconMatch[0] : '✦';

      options.push({
        id,
        label: `${id}.`,
        icon,
        title: `【${title}】`,
        content,
        prediction,
      });
      continue;
    }

    // 尝试匹配 X. 或 X、 格式（没有【】标题）
    match = line.match(/^([A-E])[\.、]\s*(.+)$/);
    if (match) {
      const [, id, content] = match;

      options.push({
        id,
        label: `${id}.`,
        icon: '✦',
        title: '',
        content: content.trim(),
        prediction: '',
      });
      continue;
    }

    // 尝试匹配 (X) 或 X) 格式
    match = line.match(/^[（(]?([A-E])[)）]\s*(.+)$/);
    if (match) {
      const [, id, content] = match;

      options.push({
        id,
        label: `${id}.`,
        icon: '✦',
        title: '',
        content: content.trim(),
        prediction: '',
      });
    }
  }

  // 如果按行解析失败，尝试整体解析
  if (options.length === 0) {
    // 匹配所有 X. 开头的选项
    const globalRegex = /([A-E])\.\s*(?:【([^】]+)】)?\s*(.+?)(?=(?:[A-E]\.|$))/gs;
    let globalMatch;

    while ((globalMatch = globalRegex.exec(rawText)) !== null) {
      const [, id, title, rest] = globalMatch;
      const content = rest.trim();

      if (content) {
        options.push({
          id,
          label: `${id}.`,
          icon: '✦',
          title: title ? `【${title}】` : '',
          content,
          prediction: '',
        });
      }
    }
  }

  console.info('[选项解析] 解析结果:', options.length, '个选项');
  return options;
}

/**
 * 获取选项对应的颜色主题
 */
export function getOptionTheme(id: string): {
  bg: string;
  border: string;
  text: string;
  glow: string;
  icon: string;
} {
  const themes: Record<
    string,
    {
      bg: string;
      border: string;
      text: string;
      glow: string;
      icon: string;
    }
  > = {
    A: {
      bg: 'from-pink-900/30 to-crimson-900/20',
      border: 'border-pink-500/40',
      text: 'text-pink-300',
      glow: 'shadow-[0_0_15px_rgba(236,72,153,0.15)]',
      icon: 'text-pink-400',
    },
    B: {
      bg: 'from-amber-900/30 to-orange-900/20',
      border: 'border-amber-500/40',
      text: 'text-amber-300',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
      icon: 'text-amber-400',
    },
    C: {
      bg: 'from-blue-900/30 to-indigo-900/20',
      border: 'border-blue-500/40',
      text: 'text-blue-300',
      glow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]',
      icon: 'text-blue-400',
    },
    D: {
      bg: 'from-purple-900/30 to-violet-900/20',
      border: 'border-purple-500/40',
      text: 'text-purple-300',
      glow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]',
      icon: 'text-purple-400',
    },
  };

  return themes[id] || themes.A;
}

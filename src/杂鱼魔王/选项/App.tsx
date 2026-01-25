// 选项界面主应用

import React, { useEffect, useMemo, useState } from 'react';
import { OptionsPanel } from './OptionsPanel';
import { parseOptions } from './parser';
import type { ParsedOption } from './types';

/**
 * 从前端界面所在楼层获取选项文本
 */
function getOptionsFromMessage(): string {
  try {
    // 获取前端界面所在楼层的消息ID
    const messageId = getCurrentMessageId();
    console.info('[选项界面] 当前楼层ID:', messageId);

    // 获取该楼层的消息内容
    const messages = getChatMessages(messageId);
    if (messages.length === 0) {
      console.warn('[选项界面] 未找到当前消息');
      return '';
    }

    const message = messages[0].message;
    console.info('[选项界面] 消息内容长度:', message.length);

    // 匹配 <option>...</option> 标签内容
    const optionMatch = message.match(/<option>([\s\S]*?)<\/option>/);
    if (optionMatch && optionMatch[1]) {
      console.info('[选项界面] 找到 <option> 标签内容');
      return optionMatch[1].trim();
    }

    console.info('[选项界面] 未找到 <option> 标签，消息前200字符:', message.substring(0, 200));
    return '';
  } catch (error) {
    console.error('[选项界面] 获取消息失败:', error);
    return '';
  }
}

/**
 * 将选项内容发送到酒馆输入框
 */
function sendToInput(text: string): void {
  try {
    const parentWindow = window.parent as Window & { $?: JQueryStatic; jQuery?: JQueryStatic };
    const $jq = parentWindow.$ || parentWindow.jQuery;

    if (!$jq) {
      console.warn('[选项界面] 无法访问父窗口的jQuery');
      return;
    }

    // 尝试多种输入框选择器
    const selectors = [
      '#send_textarea',
      'textarea[name="send_textarea"]',
      '.send_textarea',
      'textarea[placeholder*="Message"]',
      'textarea[placeholder*="消息"]',
      '.chat-input textarea',
      '#chat-input textarea',
    ];

    let $input: JQuery | null = null;
    for (const selector of selectors) {
      const found = $jq(selector);
      if (found.length > 0) {
        $input = found;
        break;
      }
    }

    if ($input && $input.length > 0) {
      $input.val(text);
      $input.trigger('input');
      $input.trigger('change');
      $input.focus();
      console.info('[选项界面] 已将选项内容填入输入框:', text);
    } else {
      console.warn('[选项界面] 未找到输入框');
      // 尝试复制到剪贴板
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).catch(() => {
          console.warn('[选项界面] 复制到剪贴板失败');
        });
      }
    }
  } catch (error) {
    console.error('[选项界面] 发送到输入框时出错:', error);
  }
}

export const App: React.FC = () => {
  const [optionsText, setOptionsText] = useState('');
  const [messageId, setMessageId] = useState<number | null>(null);

  // 获取选项的函数
  const loadOptions = async () => {
    // 等待全局函数就绪
    for (let i = 0; i < 30; i++) {
      if (typeof getChatMessages === 'function' && typeof getCurrentMessageId === 'function') {
        console.info(`[选项界面] 全局函数已就绪 (第 ${i + 1} 次检查)`);
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // 重试获取选项
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const text = getOptionsFromMessage();
      if (text) {
        setOptionsText(text);
        console.info('[选项界面] 成功获取选项内容');
        return;
      }
    }
    console.warn('[选项界面] 多次重试后仍未找到选项');
  };

  // 初始化时获取选项并记录消息ID
  useEffect(() => {
    const init = async () => {
      // 等待全局函数就绪
      for (let i = 0; i < 30; i++) {
        if (typeof getCurrentMessageId === 'function') {
          const id = getCurrentMessageId();
          setMessageId(id);
          console.info('[选项界面] 当前消息ID:', id);
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      await loadOptions();
    };
    init();
  }, []);

  // 监听消息更新事件
  useEffect(() => {
    if (typeof eventOn !== 'function' || messageId === null) {
      return;
    }

    console.info('[选项界面] 开始监听消息更新事件，当前消息ID:', messageId);

    // 监听消息更新
    const { stop } = eventOn(tavern_events.MESSAGE_UPDATED, (updatedMessageId: number) => {
      console.info('[选项界面] 消息更新事件触发，更新的消息ID:', updatedMessageId, '当前消息ID:', messageId);
      // 如果更新的是当前消息，重新加载选项
      if (updatedMessageId === messageId) {
        console.info('[选项界面] 检测到当前消息更新，重新加载选项');
        loadOptions();
      }
    });

    return () => {
      console.info('[选项界面] 停止监听消息更新事件');
      stop();
    };
  }, [messageId]);

  // 解析选项
  const options = useMemo(() => parseOptions(optionsText), [optionsText]);

  // 处理选项选择 - 将内容发送到输入框
  const handleSelect = (option: ParsedOption) => {
    console.info('[选项界面] 选择了选项:', option.id, option.title);
    // 发送选项内容到输入框
    sendToInput(option.content);
  };

  return (
    <div className="option-beautifier w-full">
      <OptionsPanel
        options={options}
        onSelect={handleSelect}
      />
    </div>
  );
};

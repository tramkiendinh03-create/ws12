// 选项卡片组件

import React from 'react';
import { getOptionTheme } from './parser';
import type { OptionProps } from './types';

export const OptionCard: React.FC<OptionProps> = ({ option, onSelect, disabled = false }) => {
  const handleClick = () => {
    if (!disabled && onSelect) {
      onSelect(option);
    }
  };

  const theme = getOptionTheme(option.id);

  return (
    <div
      onClick={handleClick}
      className={`option-card ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      style={{
        background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
      }}
    >
      {/* 选项标签 */}
      <div className="option-label">{option.id}</div>

      {/* 选项内容区域 */}
      <div className="flex-1 flex flex-col gap-1">
        {/* 选项标题（如果有）*/}
        {option.title && (
          <div className="flex items-center gap-2">
            {option.icon && <span className="text-lg">{option.icon}</span>}
            <span className="font-medium text-sm opacity-90">{option.title}</span>
          </div>
        )}

        {/* 选项内容 */}
        <div className="option-content">{option.content}</div>

        {/* 预测结果（如果有）*/}
        {option.prediction && <div className="text-xs opacity-70 italic mt-1">预测: {option.prediction}</div>}
      </div>

      {/* 点击提示 */}
      <div className="option-hint">
        <i className="fas fa-mouse-pointer"></i>
        <span>点击选择</span>
      </div>
    </div>
  );
};

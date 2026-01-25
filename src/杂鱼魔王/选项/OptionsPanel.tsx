// 选项面板组件

import React from 'react';
import { OptionCard } from './OptionCard';
import type { OptionsPanelProps, ParsedOption } from './types';

export const OptionsPanel: React.FC<OptionsPanelProps> = ({ options, onSelect, disabled = false }) => {
  const handleSelect = (option: ParsedOption) => {
    if (disabled) return;

    if (onSelect) {
      onSelect(option);
    }
  };

  if (options.length === 0) {
    return (
      <div className="no-options">
        <p>未找到选项内容</p>
      </div>
    );
  }

  return (
    <div className="options-container">
      {options.map(option => (
        <OptionCard key={option.id} option={option} onSelect={handleSelect} disabled={disabled} />
      ))}
    </div>
  );
};

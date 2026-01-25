// 选项类型定义

export interface ParsedOption {
  id: string; // 选项标识 (A, B, C, D)
  label: string; // 选项标签 (A., B., C., D.)
  icon: string; // 选项图标 (♡, ☆, !, ♪ 等)
  title: string; // 选项标题 (【系统提示♡】等)
  content: string; // 选项内容 (引号内的文字)
  prediction: string; // 预测结果 (括号内的内容)
}

export interface OptionProps {
  option: ParsedOption;
  onSelect?: (option: ParsedOption) => void;
  selected?: boolean;
  disabled?: boolean;
}

export interface OptionsPanelProps {
  options: ParsedOption[];
  onSelect?: (option: ParsedOption) => void;
  disabled?: boolean;
  allowMultiple?: boolean;
}

export interface OptionTheme {
  bg: string;
  border: string;
  text: string;
  icon: string;
  glow: string;
}

// 选项界面入口

import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './global.scss';

$(() => {
  console.info('[选项界面] 开始初始化...');

  // 获取挂载点
  const container = document.getElementById('app');
  if (!container) {
    console.error('[选项界面] 找不到挂载点 #app');
    return;
  }

  // 创建 React 根节点并渲染
  const root = createRoot(container);
  root.render(React.createElement(App));

  console.info('[选项界面] 初始化完成');

  // 卸载时清理
  $(window).on('pagehide', () => {
    console.info('[选项界面] 正在卸载...');
    root.unmount();
  });
});

import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './global.scss';

const $jq = (window as any).$;

if (typeof $jq === 'function') {
  $jq(() => {
    const container = document.getElementById('app');
    if (!container) {
      console.error('[天罚-天罚选项] 找不到挂载点 #app');
      return;
    }

    const root = createRoot(container);
    root.render(createElement(App));

    $jq(window).on('pagehide', () => {
      root.unmount();
    });
  });
} else {
  console.error('[天罚-天罚选项] jQuery 未就绪，无法初始化界面');
}

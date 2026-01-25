import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import './global.scss';

$(() => {
  const container = document.getElementById('app');
  if (container) {
    const root = createRoot(container);
    root.render(createElement(App));
  }
});

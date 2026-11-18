import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import { requestPersistentStorage } from './lib/db';
import { syncThemeColor } from './lib/theme';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Офлайн-режим: приложение сохраняется в телефоне и обновляется само
registerSW({ immediate: true });
requestPersistentStorage();
syncThemeColor();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncThemeColor);

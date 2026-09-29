import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerBrowserNotificationWorker } from './lib/browserNotifications.ts';

registerBrowserNotificationWorker().catch(() => {
  // Notifications remain optional; a failed registration must not block the app.
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

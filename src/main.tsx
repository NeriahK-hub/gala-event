import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { MotionConfig } from 'motion/react';
import { ContentProvider } from './content/ContentContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ContentProvider>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </ContentProvider>
);

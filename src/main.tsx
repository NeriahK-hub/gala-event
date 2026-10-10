import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { MotionConfig } from 'motion/react';
import { ContentProvider } from './content/ContentContext';
import { TeamProvider } from './team/TeamContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ContentProvider>
    <TeamProvider demo={new URLSearchParams(window.location.search).has('demo')}>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </TeamProvider>
  </ContentProvider>
);

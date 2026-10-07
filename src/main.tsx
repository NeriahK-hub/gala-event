import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ContentProvider } from './content/ContentContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ContentProvider>
    <App />
  </ContentProvider>
);

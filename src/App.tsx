import React, { ReactNode } from 'react';
import './App.css';
import { DarkModeProvider } from './hooks/useDarkMode';
import { LanguageProvider } from './contexts/useLanguage';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useClerk } from '@clerk/clerk-react';
import Subscription from './components/Subscription';

interface AppProps {
  children: any;
}

function App({ children }: AppProps) {
  return (
    <div className=''>
      <DarkModeProvider>
        <LanguageProvider>
          <DndProvider backend={HTML5Backend}>
            {children}
          </DndProvider>
        </LanguageProvider>
      </DarkModeProvider>
    </div>
  );
}

export default App;
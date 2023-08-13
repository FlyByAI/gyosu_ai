import React, { ReactNode } from 'react';
import './App.css';
import { DarkModeProvider } from './hooks/useDarkMode';
import { LanguageProvider } from './contexts/useLanguage';


interface AppProps {
  children: any;
}

function App({ children }: AppProps) {
  return (
    <div className=''>
      <DarkModeProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </DarkModeProvider>
    </div>
  );
}

export default App;
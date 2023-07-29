import React, { ReactNode } from 'react';
import './App.css';
import { DarkModeProvider } from './hooks/useDarkMode';


interface AppProps {
  children: ReactNode;
}

function App({ children }: AppProps) {
  return (
    <div className=''>
      <DarkModeProvider>
        {children}
      </DarkModeProvider>
    </div>
  );
}

export default App;
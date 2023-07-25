import React, { ReactNode } from 'react';
import './App.css';


interface AppProps {
  children: ReactNode;
}

function App({ children }: AppProps) {
  return (
    <div className='pb-12'>
      {children}
    </div>
  );
}

export default App;
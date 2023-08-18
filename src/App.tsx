import './App.css';
import { DarkModeProvider } from './hooks/useDarkMode';
import { LanguageProvider } from './contexts/useLanguage';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

interface AppProps {
  children: any;
}

const queryClient = new QueryClient()

function App({ children }: AppProps) {
  return (
    <div className=''>
      <QueryClientProvider client={queryClient}>
        <DarkModeProvider>
          <LanguageProvider>
            <DndProvider backend={HTML5Backend}>
              {children}
            </DndProvider>
          </LanguageProvider>
        </DarkModeProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
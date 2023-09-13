import './App.css';
import { DarkModeProvider } from './hooks/useDarkMode';
import { LanguageProvider } from './contexts/useLanguage';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { SidebarProvider } from './contexts/useSidebarContext';
import { ModalProvider } from './contexts/useModal';
import Notifications from './components/Notifications';
import toast, { Toaster } from 'react-hot-toast';

interface AppProps {
  children: any;
}

const queryClient = new QueryClient()

function App({ children }: AppProps) {
  return (
    <div className=''>
      <Toaster />
      <Notifications />
      <QueryClientProvider client={queryClient}>
        <DarkModeProvider>
          <ModalProvider>
            <SidebarProvider>
              <LanguageProvider>
                <DndProvider backend={HTML5Backend}>
                  {children}
                </DndProvider>
              </LanguageProvider>
            </SidebarProvider>
          </ModalProvider>
        </DarkModeProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
import './App.css';
import { DarkModeProvider } from './contexts/useDarkMode';
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
import { Toaster } from 'react-hot-toast';
import { ScreenSizeProvider } from './contexts/ScreenSizeContext';
import { DragProvider } from './contexts/DragContext';

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
                <ScreenSizeProvider>
                  <DragProvider>
                    <DndProvider backend={HTML5Backend}>
                      {children}
                    </DndProvider>
                  </DragProvider>
                </ScreenSizeProvider>
              </LanguageProvider>
            </SidebarProvider>
          </ModalProvider>
        </DarkModeProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
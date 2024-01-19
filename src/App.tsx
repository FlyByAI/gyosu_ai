import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import './App.css';
import AppModal from './components/AppModal';
import Notifications from './components/Notifications';
import { DragProvider } from './contexts/DragContext';
import { ScreenSizeProvider } from './contexts/ScreenSizeContext';
import { DarkModeProvider } from './contexts/useDarkMode';
import { LanguageProvider } from './contexts/useLanguage';
import { ModalProvider } from './contexts/useModal';
import { SidebarProvider } from './contexts/useSidebarContext';

interface AppProps {
  children: any;
}

const queryClient = new QueryClient()

function App({ children }: AppProps) {
  return (
    <div className=''>

      <QueryClientProvider client={queryClient}>
        <DarkModeProvider>
          <ModalProvider>
          <AppModal modalId={'appModal'} />
            <SidebarProvider>
              <LanguageProvider>
                <ScreenSizeProvider>
                  <HelmetProvider>
                    <DragProvider>
                      <DndProvider backend={HTML5Backend}>
                        <Toaster />
                        <Notifications />
                        {children}
                      </DndProvider>
                    </DragProvider>
                  </HelmetProvider>
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
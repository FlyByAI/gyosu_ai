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
import { HelmetProvider } from 'react-helmet-async';

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
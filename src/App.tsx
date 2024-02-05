import { ClerkProvider } from '@clerk/clerk-react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './App.css';
import AppModal from './components/AppModal';
import Notifications from './components/Notifications';
import { notSecretConstants } from './constants/notSecretConstants';
import { DragProvider } from './contexts/DragContext';
import { ScreenSizeProvider } from './contexts/ScreenSizeContext';
import { DarkModeProvider } from './contexts/useDarkMode';
import { LanguageProvider } from './contexts/useLanguage';
import { ModalProvider } from './contexts/useModal';
import { SidebarProvider } from './contexts/useSidebarContext';
import useEnvironment from './hooks/useEnvironment';
import { getGyosuClerkTheme } from './theme/customClerkTheme';

interface AppProps {
  children: any;
}

const queryClient = new QueryClient()

function App({ children }: AppProps) {
  const navigate = useNavigate();

  const { env } = useEnvironment();

  const clerkKey = env == "production" ? notSecretConstants.clerk.PUBLISHABLE_KEY : notSecretConstants.clerk.PUBLISHABLE_DEV_KEY


  return (
    <div className=''>
      <ClerkProvider
        publishableKey={clerkKey}
        allowedRedirectOrigins={["https://gyosu.ai", "https://www.gyosu.ai", /^https:\/\/(?:.*\.)?gyosu\.ai$/]}
        appearance={getGyosuClerkTheme()}
      >
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
      </ClerkProvider>
    </div>
  );
}

export default App;
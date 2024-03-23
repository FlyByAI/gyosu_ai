import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../contexts/useDarkMode';
import useFetchSubscriptionInfo from '../../hooks/subscription/useFetchSubscriptionInfo';
import useEnvironment from '../../hooks/useEnvironment';
import NewChatIcon from '../../svg/NewChatIcon';
import { getGyosuClerkTheme } from '../../theme/customClerkTheme';
import ChatSessionSidebar from '../ChatSessionSidebar';
import HamburgerWrapper from '../HamburgerWrapper';
import HamburgerWrapperX from '../HamburgerWrapperX';
import ManageSubscriptionButton from '../ManageSubscriptionButton';

const ChatNavbar: React.FC = () => {

  const { darkMode } = useDarkMode();
  const { apiUrl } = useEnvironment();
  const { subscriptionInfo, isLoading } = useFetchSubscriptionInfo(`${apiUrl}/user_data/get_subscription_info/`);
  const navigate = useNavigate();

  const navigateToNewChat = () => {
      navigate('/math-app/chat/', { replace: true, state: { sessionId: undefined }});
  };

  return (<>
    <div className='mt-24 md:mt-20' />
    <header className="z-20 fixed py-4 top-0 left-0 w-full px-6 pb-4 bg-blue-900 text-white dark:bg-gray-900 dark:text-gray-200">
      {/* mobile */}
      <div className="flex justify-between items-center md:hidden">
                    {/* Hamburger Menu */}
                    <HamburgerWrapperX>
                        <ChatSessionSidebar />
                    </HamburgerWrapperX>
                    {/* Title linking to root */}
                    <Link to="/" className="text-xl font-semibold text-white font-mono">Gyosu.ai</Link>

                    {/* New Chat Button */}
                    <button onClick={navigateToNewChat} className="bg-gradient-to-b from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-600 text-white font-bold py-2 px-4 rounded flex flex-row">
                        <div className='mr-2'>
                            New
                        </div>
                        <NewChatIcon />
                    </button>
                </div>
      
      {/* desktop */}
      <div className="justify-between items-center hidden sm:flex">
        <Link to="/" className="text-3xl font-semibold text-white font-mono">Gyosu.ai</Link>
        <div className="flex items-center">
          <nav>
            <Link to="/math-app/chat" className="relative text-lg text-white mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
              GyosuChat
              <span className="absolute top-0 left-12 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-orange-700 rounded-full">
                New!
              </span>
            </Link>
            {/* <Link to="/math-app/playground" className="text-lg text-white mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
              Playground
            </Link> */}
            <Link to="/math-app" className="text-lg text-white mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
              Problem Search
            </Link>
            <Link to="/math-app/documents" className="text-lg text-white mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
              My Documents
            </Link>
            <Link to="/faq" className="text-lg text-white mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
              How To
            </Link>
            <Link to="/subscribe" className="text-lg text-white mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
              Pricing
            </Link>
          </nav>
          <SignedIn>
            {darkMode ? <UserButton afterSignOutUrl={window.location.href} appearance={getGyosuClerkTheme()} /> : <UserButton afterSignOutUrl={window.location.href} />}
            {subscriptionInfo?.has_valid_subscription &&
              <HamburgerWrapper>
                {/* <LanguageDropdown /> */}
                <ManageSubscriptionButton />
                {/* <DeleteAllChatsButton /> */}
              </HamburgerWrapper>
            }
          </SignedIn>
          <SignedOut>
            <div
              className="flex justify-center items-center bg-orange-500 hover:bg-orange-600 rounded-md p-2 cursor-pointer"
              onClick={(e) => {
                // Programmatically click the inner button
                const button = e.currentTarget.querySelector('button');
                if (button) {
                  button.click();
                }
              }}
            >
              <SignInButton mode="modal" afterSignInUrl={window.location.href} />
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  </>);
};

export default ChatNavbar;

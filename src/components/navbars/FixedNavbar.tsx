import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../../contexts/useDarkMode';
import useFetchSubscriptionInfo from '../../hooks/subscription/useFetchSubscriptionInfo';
import useEnvironment from '../../hooks/useEnvironment';
import { getGyosuClerkTheme } from '../../theme/customClerkTheme';
import HamburgerWrapper from '../HamburgerWrapper';
import ManageSubscriptionButton from '../ManageSubscriptionButton';

const FixedNavbar: React.FC = () => {

  const { darkMode } = useDarkMode();
  const { apiUrl } = useEnvironment();
  const { subscriptionInfo, isLoading } = useFetchSubscriptionInfo(`${apiUrl}/user_data/get_subscription_info/`);

  return (<>
    <div className='mt-32 md:mt-20' />
    <header className="z-20 fixed py-4 top-0 left-0 w-full px-6 pb-4 bg-blue-900 text-gray-300 dark:bg-gray-900 dark:text-gray-200">
      {/* mobile */}
      <div className="flex flex-row container mx-auto grid-cols-2 lg:grid-cols-2 items-center justify-between gap-4 sm:hidden">
        <Link to="/" className="text-3xl font-semibold text-gray-300 justify-self-center lg:justify-self-start font-mono">Gyosu.ai</Link>
        <div className="flex items-center justify-self-center sm:block">
          <SignedIn>
            {darkMode ? <UserButton afterSignOutUrl={window.location.href} appearance={getGyosuClerkTheme()} /> : <UserButton afterSignOutUrl={window.location.href} />}
            <HamburgerWrapper>
              <nav className='flex flex-col space-y-2'>
                {/* <LanguageDropdown /> */}
                <Link to="/math-app/chat" className="relative text-lg text-gray-300 mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
                  GyosuChat
                  <span className="absolute top-1 left-12 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-orange-700 rounded-full">
                    New!
                  </span>
                </Link>
                <Link to="/math-app" className="text-lg text-gray-300 mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
                  Problem Search
                </Link>
                <Link to="/math-app/documents" className="text-lg text-gray-300 mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
                  My Documents
                </Link>
                <Link to="/faq" className="text-lg text-gray-300 mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
                  How To
                </Link>
                <Link to="/subscribe" className="text-lg text-gray-300 mx-3 mt-2 hover:underline dark:text-gray-200 font-mono font-bold">
                  Pricing
                </Link>
                <ManageSubscriptionButton />
                {/* <DeleteAllChatsButton /> */}
              </nav>
            </HamburgerWrapper>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal" afterSignInUrl={window.location.href} />
          </SignedOut>
        </div>
      </div>
      {/* desktop */}
      <div className="justify-between items-center hidden sm:flex">
        <Link to="/" className="text-3xl font-semibold text-gray-300 font-mono">Gyosu.ai</Link>
        <div className="flex items-center">
          <nav>
            <Link to="/math-app/chat" className="relative text-lg text-gray-300 mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
              GyosuChat
              <span className="absolute top-0 left-12 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-orange-700 rounded-full">
                New!
              </span>
            </Link>
            {/* <Link to="/math-app/playground" className="text-lg text-gray-300 mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
              Playground
            </Link> */}
            <Link to="/math-app" className="text-lg text-gray-300 mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
              Problem Search
            </Link>
            <Link to="/math-app/documents" className="text-lg text-gray-300 mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
              My Documents
            </Link>
            <Link to="/faq" className="text-lg text-gray-300 mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
              How To
            </Link>
            <Link to="/subscribe" className="text-lg text-gray-300 mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
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

export default FixedNavbar;

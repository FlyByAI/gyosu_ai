import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../../contexts/useDarkMode';
import { getGyosuClerkTheme } from '../../theme/customClerkTheme';
import DeleteAllChatsButton from '../DeleteAllChatsButton';
import HamburgerWrapper from '../HamburgerWrapper';
import ManageSubscriptionButton from '../ManageSubscriptionButton';

const FixedNavbar: React.FC = () => {

  const { darkMode } = useDarkMode();

  return (<>
    <div className='mt-32 md:mt-20' />
    <header className="z-20 fixed top-0 left-0 w-full px-6 pb-4 bg-blue-900 text-white dark:bg-gray-900 dark:text-gray-200">      {/* mobile */}
      <div className="flex flex-row container mx-auto grid-cols-2 lg:grid-cols-2 items-center justify-between gap-4 sm:hidden">
        <Link to="/" className="text-3xl font-semibold text-white justify-self-center lg:justify-self-start font-mono">Gyosu.ai</Link>
        <div className="flex items-center justify-self-center sm:block">
          <SignedIn>
            {darkMode ? <UserButton afterSignOutUrl="/" appearance={getGyosuClerkTheme()} /> : <UserButton afterSignOutUrl="/" />}
            <HamburgerWrapper>
              {/* <LanguageDropdown /> */}
              <ManageSubscriptionButton />
              <DeleteAllChatsButton />
            </HamburgerWrapper>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal" />
          </SignedOut>
        </div>
      </div>
      <nav className="grid grid-cols-2 gap-2 lg:flex lg:space-x-3 pt-4">
        <Link to="/math-app/chat" className="relative text-lg text-white hover:underline dark:text-gray-200 lg:justify-self-end block sm:hidden">
          Chat
          <span className="absolute bottom-2 left-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-orange-700 rounded-full">
            New!
          </span>
        </Link>
        {/* <Link to="/math-app/playground" className="text-lg text-white hover:underline dark:text-gray-200 lg:justify-self-end block sm:hidden">
          Playground
        </Link> */}
        <Link to="/math-app" className="text-lg text-white hover:underline dark:text-gray-200 lg:justify-self-end block sm:hidden">
          Problem Search
        </Link>
        <Link to="/math-app/documents" className="text-lg text-white hover:underline dark:text-gray-200 lg:justify-self-end block sm:hidden">
          My Documents
        </Link>
        <Link to="/faq" className="text-lg text-white hover:underline dark:text-gray-200 lg:justify-self-end block sm:hidden">
          How To
        </Link>
        <Link to="/subscribe" className="text-lg text-white hover:underline dark:text-gray-200 lg:justify-self-end block sm:hidden">
          Pricing
        </Link>
      </nav>

      {/* desktop */}
      <div className="flex justify-between items-center hidden sm:flex">
        <Link to="/" className="text-3xl font-semibold text-white font-mono">Gyosu.ai</Link>
        <div className="flex items-center">
          <nav>
            <Link to="/math-app/chat" className="relative text-lg text-white mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
              Chat
              <span className="absolute bottom-2 right-12 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-orange-700 rounded-full">
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
            {darkMode ? <UserButton afterSignOutUrl="/" appearance={getGyosuClerkTheme()} /> : <UserButton afterSignOutUrl="/" />}
            <HamburgerWrapper>
              {/* <LanguageDropdown /> */}
              <ManageSubscriptionButton />
            </HamburgerWrapper>
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
              <SignInButton mode="modal" />
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  </>);
};

export default FixedNavbar;

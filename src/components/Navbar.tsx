import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDarkMode } from '../hooks/useDarkMode';
import { SignedIn, SignedOut, UserButton, SignInButton, useClerk } from '@clerk/clerk-react';
import { getGyosuClerkTheme } from '../theme/customClerkTheme';
import LanguageDropdown from './LanguageDropdown';

const Navbar: React.FC = () => {

  const { darkMode } = useDarkMode();

  const { session } = useClerk();

  const location = useLocation();
  const isFixed = location.pathname.includes('/document/');

  return (<>
    {isFixed && <div className="mt-16"></div>}
    <header className={isFixed ?
      "fixed top-0 left-0 w-full z-10 px-6 py-4 bg-blue-900 text-white dark:bg-gray-900 dark:text-gray-200" :
      "px-6 pb-4 bg-blue-900 text-white dark:bg-gray-900 dark:text-gray-200"}>
      {/* mobile */}
      <div className="flex flex-row container mx-auto grid-cols-2 lg:grid-cols-2 items-center justify-between gap-4 sm:hidden">
        <Link to="/" className="text-3xl font-semibold text-white justify-self-center lg:justify-self-start font-mono">Gyosu.ai</Link>
        <div className="flex items-center justify-self-center sm:block">
          <LanguageDropdown className="sm:hidden" />
          <SignedIn>
            {darkMode ? <UserButton afterSignOutUrl="http://localhost:5173/" appearance={getGyosuClerkTheme()} /> : <UserButton afterSignOutUrl="http://localhost:5173/" />}
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal" />
          </SignedOut>
        </div>
      </div>
      {!isFixed &&
        <nav className="grid grid-cols-2 gap-2 lg:flex lg:space-x-3 pt-4">
          <Link to="/math-app" className="text-lg text-white hover:underline dark:text-gray-200 lg:justify-self-end block sm:hidden">
            Generate
          </Link>
          <Link to="/contact" className="text-lg text-white hover:underline dark:text-gray-200 lg:justify-self-end block sm:hidden">
            Contact
          </Link>
        </nav>
      }

      {/* desktop */}
      <div className="flex justify-between items-center hidden sm:flex">
        <div className="flex items-center">
          {!isFixed ?
            <Link to="/" className="text-3xl font-semibold text-white font-mono">Gyosu.ai</Link> :
            <Link to="/math-app" className="text-3xl font-semibold text-white font-mono flex">{"< "} V2</Link>
          }
        </div>
        <div className="flex items-center">
          {!isFixed &&
            <nav>
              <Link to="/math-app" className="text-lg text-white mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
                Generate
              </Link>
              <Link to="/contact" className="text-lg text-white mx-3 hover:underline dark:text-gray-200 mr-4 font-mono font-bold">
                Contact
              </Link>
            </nav>
          }
          {isFixed &&
            <nav>
              <Link to="/math-app" className="text-lg text-white mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
                Tool1
              </Link>
              <Link to="/math-app" className="text-lg text-white mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
                Tool2
              </Link>
              <Link to="/contact" className="text-lg text-white mx-3 hover:underline dark:text-gray-200 mr-4 font-mono font-bold">
                Tool3
              </Link>
            </nav>
          }
          <LanguageDropdown className="hidden sm:flex " />
          <SignedIn>
            {darkMode ? <UserButton afterSignOutUrl="/" appearance={getGyosuClerkTheme()} /> : <UserButton afterSignOutUrl="http://localhost:5173/" />}
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal" />
          </SignedOut>
        </div>
      </div>
    </header>
  </>
  );
};

export default Navbar;

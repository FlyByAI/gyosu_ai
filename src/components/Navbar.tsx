import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../hooks/useDarkMode';
import { SignedIn, SignedOut, UserButton, SignInButton, useClerk } from '@clerk/clerk-react';
import { getGyosuClerkTheme } from '../theme/customClerkTheme';
import TokenButton from './TokenButton';

const Navbar: React.FC = () => {

  const { darkMode, setDarkMode, SunIcon, MoonIcon } = useDarkMode();

  const { session } = useClerk();


  return (
    <header className="px-6 py-4 bg-blue-900 text-white dark:bg-gray-900 dark:text-gray-200">
      {/* mobile */}
      <div className="container mx-auto grid-cols-2 lg:grid-cols-2 items-center gap-4 block sm:hidden">
        <Link to="/" className="text-3xl font-semibold text-white justify-self-center lg:justify-self-start font-mono">Gyosu.ai</Link>
        <div className="flex items-center justify-self-center sm:block">
          <button className="justify-self-center lg:justify-self-end p-2 rounded-full bg-gray-200 dark:bg-gray-800 focus:outline-none me-4" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
          <SignedIn>
            {darkMode ? <UserButton afterSignOutUrl="http://localhost:5173/" appearance={getGyosuClerkTheme()} /> : <UserButton afterSignOutUrl="http://localhost:5173/" />}
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal" />
          </SignedOut>
        </div>
      </div>
      <nav className="grid grid-cols-2 gap-2 lg:flex lg:space-x-3 pt-4">
        <Link to="/math-app" className="text-lg text-white hover:underline dark:text-gray-200 lg:justify-self-end block sm:hidden">
          Generate
        </Link>
        {session && <Link to="/materials" className="text-lg text-white hover:underline dark:text-gray-200 lg:justify-self-end block sm:hidden">
          My Materials
        </Link>}
        <Link to="/contact" className="text-lg text-white hover:underline dark:text-gray-200 lg:justify-self-end block sm:hidden">
          Contact
        </Link>
      </nav>
      {/* desktop */}
      <div className="container mx-auto flex justify-between items-center hidden sm:flex">
        <div className="flex items-center">
          <Link to="/" className="text-3xl font-semibold text-white font-mono">Gyosu.ai</Link>
          {/* <button className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 focus:outline-none" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button> */}
        </div>
        <div className="flex items-center">
          <nav>
            {/* <Link to="/blog" className="text-lg text-white mx-3 hover:underline dark:text-gray-200">
              Blog
            </Link> */}
            <Link to="/math-app" className="text-lg text-white mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
              Generate
            </Link>
            {session &&
              <Link to="/materials" className="text-lg text-white hover:underline dark:text-gray-200 lg:justify-self-end block sm:hidden font-mono font-bold">
                My Materials
              </Link>}
            <Link to="/contact" className="text-lg text-white mx-3 hover:underline dark:text-gray-200 mr-4 font-mono font-bold">
              Contact
            </Link>
          </nav>
          <SignedIn>
            {darkMode ? <UserButton afterSignOutUrl="/" appearance={getGyosuClerkTheme()} /> : <UserButton afterSignOutUrl="http://localhost:5173/" />}
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal" />
          </SignedOut>
        </div>
      </div>
      {/* <TokenButton tokens={300} /> */}
    </header>

  );
};

export default Navbar;

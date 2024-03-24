import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../../contexts/useDarkMode';
import useFetchSubscriptionInfo from '../../hooks/subscription/useFetchSubscriptionInfo';
import useEnvironment from '../../hooks/useEnvironment';
import HamburgerWrapper from '../HamburgerWrapper';
import HamburgerWrapperX from '../HamburgerWrapperX';
import ManageSubscriptionButton from '../ManageSubscriptionButton';
import ProblemBankShelf from '../document/ProblemBankShelf';

const ProblemSearchNavbar: React.FC = () => {
  const { darkMode } = useDarkMode();
  const { apiUrl } = useEnvironment();
  const { subscriptionInfo } = useFetchSubscriptionInfo(`${apiUrl}/user_data/get_subscription_info/`);

  return (
    <>
      <div className='mt-20 md:mt-16'></div>
      <header className="navbar fixed top-0 left-0 z-20 w-full bg-base-100">
        {/* Mobile view */}

        <div className="navbar-start md:hidden">
          <HamburgerWrapperX>
            <ProblemBankShelf isExporting={false} />
          </HamburgerWrapperX>
        </div>
        <div className="navbar-center md:hidden">
          <Link to="/" className="btn btn-ghost normal-case text-xl">Gyosu.ai</Link>
        </div>
        <div className="navbar-end md:hidden">
          <HamburgerWrapper>
            <nav className='flex flex-col space-y-2'>
              {/* <LanguageDropdown /> */}
              <Link to="/math-app/chat" className="relative text-lg mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
                GyosuChat
                <span className="absolute top-1 left-12 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-orange-700 rounded-full">
                  New!
                </span>
              </Link>
              <Link to="/math-app" className="text-lg mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
                Problem Search
              </Link>
              <Link to="/math-app/documents" className="text-lg mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
                My Documents
              </Link>
              <Link to="/faq" className="text-lg mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
                How To
              </Link>
              <Link to="/subscribe" className="text-lg mx-3 mt-2 hover:underline dark:text-gray-200 font-mono font-bold">
                Pricing
              </Link>
              <ManageSubscriptionButton />

              <SignedOut>
                <SignInButton mode="modal" afterSignInUrl={window.location.href} />
              </SignedOut>
            </nav>
          </HamburgerWrapper>

        </div>

        {/* Desktop view */}
        <div className="navbar-start hidden md:flex">
          <Link to="/" className="btn btn-ghost normal-case text-xl">Gyosu.ai</Link>
        </div>
        <div className="navbar-end hidden md:flex items-center flex-grow">
          <Link to="/math-app/chat" className="btn btn-ghost">
            GyosuChat <span className="badge badge-info">New!</span>
          </Link>
          <Link to="/math-app" className="btn btn-ghost">Problem Search</Link>
          <Link to="/math-app/documents" className="btn btn-ghost">My Documents</Link>
          <Link to="/faq" className="btn btn-ghost">How To</Link>
          <Link to="/subscribe" className="btn btn-ghost">Pricing</Link>
          <SignedIn>
            <UserButton afterSignOutUrl={window.location.href} />
            {subscriptionInfo?.has_valid_subscription && <ManageSubscriptionButton />}
          </SignedIn>
          <SignedOut>
            <div className="tooltip" data-tip="Sign In">
              <SignInButton mode="modal" afterSignInUrl={window.location.href} />
            </div>
          </SignedOut>
        </div>
      </header>
    </>
  );
};

export default ProblemSearchNavbar;

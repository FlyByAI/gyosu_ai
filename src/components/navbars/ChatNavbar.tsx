import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../contexts/useDarkMode';
import useFetchSubscriptionInfo from '../../hooks/subscription/useFetchSubscriptionInfo';
import useEnvironment from '../../hooks/useEnvironment';
import NewChatIcon from '../../svg/NewChatIcon';
import ChatSessionSidebar from '../ChatSessionSidebar';
import HamburgerWrapperX from '../HamburgerWrapperX';
import ManageSubscriptionButton from '../ManageSubscriptionButton';

const ChatNavbar: React.FC = () => {
  const { SunIcon, MoonIcon, darkMode, setDarkMode } = useDarkMode()
  const { env, apiUrl } = useEnvironment();
  const { subscriptionInfo } = useFetchSubscriptionInfo(`${apiUrl}/user_data/get_subscription_info/`);
  const navigate = useNavigate();

  const navigateToNewChat = () => {
    navigate('/math-app/chat/', { replace: true, state: { sessionId: undefined } });
  };

  return (
    <>
      <div className='mt-16'></div>
      <header className="navbar fixed top-0 left-0 z-20 w-full bg-base-100">
        {/* Mobile view */}
        <div className="navbar-start block md:hidden">
          <HamburgerWrapperX mobileOrDesktop={'mobile'}>
            <ChatSessionSidebar />
          </HamburgerWrapperX>
        </div>
        <div className="navbar-center md:hidden block">
          <Link to="/" className="btn btn-ghost normal-case text-xl">Gyosu.ai</Link>
          {env == "local" && 
          <button onClick={() => setDarkMode(!darkMode)} className='btn btn-ghost'>
            {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>
          }
        </div>
        <div className="navbar-end md:hidden">
          <button onClick={navigateToNewChat} className="btn btn-primary">
            <span className='mr-2'>New</span>
            <NewChatIcon />
          </button>
        </div>
        {/* Desktop view */}
        <div className="navbar-start hidden md:flex">
          <Link to="/" className="btn btn-ghost normal-case text-xl">Gyosu.ai</Link>
          {env == "local" && 
          <button onClick={() => setDarkMode(!darkMode)} className='btn btn-ghost'>
            {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>
          }
        </div>
        <div className="navbar-end items-center flex-grow hidden md:flex">
          <Link to="/math-app/chat" className="btn btn-ghost">
            GyosuChat <span className="badge badge-info">New!</span>
          </Link>
          <Link to="/math-app/bank" className="btn btn-ghost">Problem Banks</Link>
          <Link to="/math-app/search" className="btn btn-ghost">Problem Search</Link>
          <Link to="/math-app/documents" className="btn btn-ghost">My Documents</Link>
          <Link to="/faq" className="btn btn-ghost">How To</Link>
          <Link to="/subscribe" className="btn btn-ghost">Pricing</Link>

          <SignedIn>
            <UserButton afterSignOutUrl={window.location.href} />
            {subscriptionInfo?.has_valid_subscription && <ManageSubscriptionButton />}
          </SignedIn>
          <SignedOut>
            <div className='btn btn-primary'
              onClick={(e) => {
                // Programmatically click the inner button
                const button = e.currentTarget.querySelector('button');
                if (button) {
                  button.click();
                }
              }}>
              <SignInButton mode="modal" afterSignInUrl={window.location.href} />
            </div>
          </SignedOut>
        </div>
      </header>
    </>
  );
};

export default ChatNavbar;
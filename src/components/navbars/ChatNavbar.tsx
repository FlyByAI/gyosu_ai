import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NewChatIcon from '../../svg/NewChatIcon';
import ChatSessionSidebar from '../ChatSessionSidebar';
import DeleteAllChatsButton from '../DeleteAllChatsButton';
import HamburgerWrapper from '../HamburgerWrapper';
import HamburgerWrapperX from '../HamburgerWrapperX';
import ManageSubscriptionButton from '../ManageSubscriptionButton';

const ChatNavbar: React.FC = () => {
    const navigate = useNavigate();

    const navigateToNewChat = () => {
        navigate('/math-app/chat/', { replace: true, state: { sessionId: undefined }});
    };

    return (
        <>
            <div className='mt-16 md:mt-16' />
            <header className="z-20 fixed top-0 left-0 w-full bg-blue-900 text-white dark:bg-gray-900 dark:text-gray-200">
                {/* mobile */}
                <div className="flex justify-between items-center py-2 px-6 md:hidden">
                    {/* Hamburger Menu */}
                    <HamburgerWrapperX>
                        <ChatSessionSidebar />
                    </HamburgerWrapperX>
                    {/* Title linking to root */}
                    <Link to="/" className="text-xl font-semibold text-white font-mono">Gyosu.ai</Link>

                    {/* New Chat Button */}
                    <button onClick={navigateToNewChat} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex flex-row">
                        <div className='mr-2'>
                            New
                        </div>
                        <NewChatIcon />
                    </button>
                </div>

                {/* desktop */}
                <div className="hidden md:flex justify-between items-center py-2">
                    {/* New Chat Button with Margin */}
                    <button onClick={navigateToNewChat} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 flex-row flex">
                        <div className='mr-4 '>New Chat</div>
                        <NewChatIcon />
                    </button>

                    {/* Centered Title */}
                    <div className="flex-grow text-center">
                        <Link to="/" className="text-xl font-semibold text-white font-mono">Gyosu.ai</Link>
                    </div>

                    {/* Placeholder div to balance flex space */}
                    <div className="w-[68px]">
                        <HamburgerWrapper className="hamburger-menu">
                            <div className='flex flex-col space-y-2'>
                                {/* <LanguageDropdown /> */}
                                <ManageSubscriptionButton />
                                <Link to="/math-app" className="text-lg text-white mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
                                    Problem Search
                                </Link>
                                <Link to="/math-app/documents" className="text-lg text-white mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
                                    My Documents
                                </Link>
                                <Link to="/faq" className="text-lg text-white mx-3 hover:underline dark:text-gray-200 font-mono font-bold">
                                    How To
                                </Link>
                                <Link to="/subscribe" className="text-lg text-white mx-3 mt-2 hover:underline dark:text-gray-200 font-mono font-bold">
                                    Pricing
                                </Link>
                                <DeleteAllChatsButton />
                            </div>
                        </HamburgerWrapper>
                    </div> {/* Adjust width to match the New Chat button width */}
                </div>

            </header>
        </>

    );
};

export default ChatNavbar;

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
        navigate('/math-app/chat');
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
                        <NewChatIcon/>
                    </button>

                    {/* Centered Title */}
                    <div className="flex-grow text-center">
                        <Link to="/" className="text-xl font-semibold text-white font-mono">Gyosu.ai</Link>
                    </div>

                    {/* Placeholder div to balance flex space */}
                    <div className="w-[68px]">
                        <HamburgerWrapper>
                            {/* <LanguageDropdown /> */}
                            <ManageSubscriptionButton />
                            <DeleteAllChatsButton/>
                        </HamburgerWrapper>
                    </div> {/* Adjust width to match the New Chat button width */}
                </div>

            </header>
        </>

    );
};

export default ChatNavbar;

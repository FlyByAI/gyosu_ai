import { SignedIn, UserButton, useClerk } from '@clerk/clerk-react';
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useChatSessions, { ChatSession } from '../hooks/tools/math/useChatSessions';
import useEnvironment from '../hooks/useEnvironment';
import EditIcon from '../svg/Edit';
import ShareIcon from '../svg/Share';
import TrashIcon from '../svg/TrashIcon';
import { getGyosuClerkTheme } from '../theme/customClerkTheme';
import DeleteAllChatsButton from './DeleteAllChatsButton';
import ManageSubscriptionButton from './ManageSubscriptionButton';
import OverflowMenuPortal from './OverflowMenuPortal';

type SectionLabels = {
    [key in "Today" | "Yesterday" | "Previous 7 Days" | "Previous 30 Days" | "Previous 90 Days" | "Older"]: string;
};

const categorizeChatsByDate = (chats: ChatSession[]) => {
    const sections = {
        today: [] as ChatSession[],
        yesterday: [] as ChatSession[],
        previous7Days: [] as ChatSession[],
        previous30Days: [] as ChatSession[],
        previous90Days: [] as ChatSession[],
        older: [] as ChatSession[]
    };

    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const sevenDaysAgo = new Date(now.getTime() - 7 * oneDay);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * oneDay);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * oneDay);

    chats.forEach(chat => {
        const updatedAt = new Date(chat.updatedAt);

        if (updatedAt.toDateString() === now.toDateString()) {
            sections.today.push(chat);
        } else if (updatedAt.toDateString() === new Date(now.getTime() - oneDay).toDateString()) {
            sections.yesterday.push(chat);
        } else if (updatedAt > sevenDaysAgo) {
            sections.previous7Days.push(chat);
        } else if (updatedAt > thirtyDaysAgo) {
            sections.previous30Days.push(chat);
        } else if (updatedAt > ninetyDaysAgo) {
            sections.previous90Days.push(chat);
        } else {
            sections.older.push(chat);
        }
    });

    return sections;
};


const ChatSessionSidebar: React.FC = () => {
    const { apiUrl } = useEnvironment();
    const chatSessionsEndpoint = `${apiUrl}/math_app/chat/`;

    const { user } = useClerk();

    const portalRootRef = useRef<HTMLDivElement>(null); // Create a ref for the portal root

    const { chatSessions, isLoading, error, deleteChatSession, renameChatSession, shareChatSession } = useChatSessions(chatSessionsEndpoint);
    const [openOverflowMenuId, setOpenOverflowMenuId] = useState<string | null>(null);
    const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState('');

    const handleEditClick = (sessionId: string, currentTitle: string) => {
        setEditingSessionId(sessionId);
        setEditingTitle(currentTitle);
    };

    const handleShareClick = (sessionId: string) => {
        shareChatSession(sessionId)
    };

    const handleRenameSubmit = (sessionId: string) => {
        if (editingTitle.trim()) {
            renameChatSession({ sessionId, chatTitle: editingTitle.trim() });
        }
        setEditingSessionId(null);
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditingTitle(event.target.value);
    };


    const handleDeleteClick = (sessionId: string) => {
        deleteChatSession(sessionId)

    };


    if (isLoading) return <p className="text-center text-white">Loading...</p>;
    if (error) return <p className="text-red-500">Error loading chat sessions</p>;

    const categorizedChats = categorizeChatsByDate(chatSessions || []);

    const getMarqueeClass = (text: string) => {
        if (text.length >= 15) {
            return 'hover:animate-marqueeShort';
        } else if (text.length >= 30) {
            return 'hover:animate-marqueeMedium';
        } else if (text.length >= 45) {
            return 'hover:animate-marqueeLong';
        }
        return 'hover:animate-none';

    };




    const renderChatsInSection = (chats: ChatSession[], sectionLabel: keyof SectionLabels) => {
        if (chats.length === 0) return null;
        return (
            <>
                <h3 className="text-gray-400 mb-2">{sectionLabel}</h3>
                {chats.map(chat => (
                    <li key={chat.sessionId} className="mb-2 flex justify-between items-center">
                        <div className="overflow-hidden">
                            {editingSessionId === chat.sessionId ? (
                                <input
                                    type="text"
                                    value={editingTitle}
                                    onChange={handleTitleChange}
                                    onBlur={() => handleRenameSubmit(chat.sessionId)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleRenameSubmit(chat.sessionId);
                                        }
                                    }}
                                    className="block w-full text-white bg-transparent border-b border-white focus:outline-none"
                                    autoFocus
                                />
                            ) : (
                                <Link to={`/math-app/chat/${chat.sessionId}`} className="block text-white hover:text-blue-300 whitespace-nowrap overflow-hidden overflow-ellipsis hover:text-left">
                                    <div className={`${getMarqueeClass(chat.chatTitle)}`}>
                                        {chat.chatTitle}
                                    </div>
                                </Link>
                            )}
                        </div>
                        <div>
                            <OverflowMenuPortal
                                portalRoot={portalRootRef}
                                type='iconRow'
                                isOpen={openOverflowMenuId === chat.sessionId}
                                setIsOpen={(isOpen) => setOpenOverflowMenuId(isOpen ? chat.sessionId : null)}
                            >
                                <button onClick={() => handleEditClick(chat.sessionId, chat.chatTitle)}
                                    className="text-green-700 bg-gray-100 rounded-t flex flex-row p-2"
                                    data-tooltip-id={`edit-${chat.sessionId}`}
                                >
                                    <EditIcon />
                                    <div>
                                        Rename
                                    </div>
                                </button>
                                <button onClick={() => handleShareClick(chat.sessionId)}
                                    className="text-green-700 bg-gray-100 flex flex-row p-2"
                                    data-tooltip-id={`edit-${chat.sessionId}`}
                                >
                                    <ShareIcon />
                                    <div>
                                        Share
                                    </div>
                                </button>
                                <button className='text-red-500 bg-gray-100 rounded-b flex flex-row p-2'
                                    data-tooltip-id={`delete-${chat.sessionId}`}
                                    onClick={() => handleDeleteClick(chat.sessionId)}>
                                    <TrashIcon />
                                    Delete
                                </button>
                            </OverflowMenuPortal>
                        </div>
                    </li>
                ))}
            </>
        );
    };



    return (
        <div className="chat-sidebar h-75vh md:h-85vh p-4 max-w-xs md:max-w-none bg-gray-800 md:bg-transparent border border-gray-300 text-white flex flex-col"
            ref={portalRootRef}
            >
            <div className="flex-grow overflow-y-auto">
                <ul>
                    {renderChatsInSection(categorizedChats.today, "Today")}
                    {renderChatsInSection(categorizedChats.yesterday, "Yesterday")}
                    {renderChatsInSection(categorizedChats.previous7Days, "Previous 7 Days")}
                    {renderChatsInSection(categorizedChats.previous30Days, "Previous 30 Days")}
                    {renderChatsInSection(categorizedChats.previous90Days, "Previous 90 Days")}
                    {renderChatsInSection(categorizedChats.older, "Older")}
                </ul>
            </div>
            <hr className='p-1' />
            <div className="user-profile">
                <div className='flex flex-row justify-between'>
                    <SignedIn>
                        <div className="user-name text-white mt-2 text-xs mr-2">
                            {user?.fullName || 'User Name'}
                        </div>
                    </SignedIn>
                    <SignedIn>
                        {<UserButton afterSignOutUrl="/" appearance={getGyosuClerkTheme()} />}
                    </SignedIn>
                </div>
                {/* <div className='text-xs mt-2 md:hidden block'>
                    <LanguageDropdown />
                </div> */}
                <div className='text-xs mt-2 md:hidden block' >
                    <ManageSubscriptionButton />
                </div>
                <div className='text-xs mt-2 md:hidden block' >
                    <DeleteAllChatsButton />
                </div>
            </div>
        </div>

    );
};

export default ChatSessionSidebar;
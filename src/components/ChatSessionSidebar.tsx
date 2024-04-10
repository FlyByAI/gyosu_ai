import { useClerk } from '@clerk/clerk-react';
import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useChatSessions, { ChatSession } from '../hooks/tools/math/useChatSessions';
import useEnvironment from '../hooks/useEnvironment';
import EditIcon from '../svg/Edit';
import NewChatIcon from '../svg/NewChatIcon';
import ShareIcon from '../svg/Share';
import TrashIcon from '../svg/TrashIcon';
import DeleteAllChatsButton from './DeleteAllChatsButton';
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

    const navigate = useNavigate();

    const navigateToNewChat = () => {
        navigate('/math-app/chat/', { replace: true, state: { sessionId: undefined } });
    };

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
                <h3 className="text-info">{sectionLabel}</h3>
                {chats.map(chat => (
                    <li key={chat.sessionId} className="flex justify-between items-center">
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
                                    className="input input-bordered w-full bg-transparent border-base-300 focus:border-blue-500"
                                    autoFocus
                                />
                            ) : (
                                <Link to={`/math-app/chat/${chat.sessionId}`} className="link link-hover text-base-content hover:text-blue-400 whitespace-nowrap overflow-hidden overflow-ellipsis">
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
                                <div className="tooltip" data-tip="Rename">
                                    <button onClick={() => handleEditClick(chat.sessionId, chat.chatTitle)}
                                        className="btn btn-xs btn-success text-base-100 w-full"
                                    >
                                        <EditIcon/> Rename
                                    </button>
                                </div>
                                <div className="tooltip" data-tip="Share">
                                    <button onClick={() => handleShareClick(chat.sessionId)}
                                        className="btn btn-xs btn-success text-base-100 w-full"
                                    >
                                        <ShareIcon /> Share
                                    </button>
                                </div>
                                <div className="tooltip" data-tip="Delete">
                                    <button onClick={() => handleDeleteClick(chat.sessionId)}
                                        className="btn btn-xs btn-error text-base-100 w-full"
                                    >
                                        <TrashIcon /> Delete
                                    </button>
                                </div>
                            </OverflowMenuPortal>

                        </div>
                    </li>
                ))}
            </>
        );
    };




    return (
        <div className="chat-sidebar h-[75vh] md:h-[85vh] p-4 max-w-xs md:max-w-none bg-base-100 md:bg-transparent border border-base-300 text-base-content flex flex-col"
            ref={portalRootRef}
        >
            <button onClick={navigateToNewChat} className="btn btn-primary rounded-lg md:flex md:flex-row hidden">
                New Chat
                <NewChatIcon />
            </button>

            <hr className='my-4 border-black md:block hidden' />

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
            <hr className='my-2 border-black' />
            <div className="user-profile flex flex-col gap-2">
                <div className='text-xs' >
                    <DeleteAllChatsButton />
                </div>
            </div>
        </div>
    );

};

export default ChatSessionSidebar;
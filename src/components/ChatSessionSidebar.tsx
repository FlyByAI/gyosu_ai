import React from 'react';
import { Link } from 'react-router-dom';
import useGetChatSessions, { ChatSession } from '../hooks/tools/math/useGetChatSessions';
import useEnvironment from '../hooks/useEnvironment';

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
    const chatSessionsEndpoint = `${apiUrl}/math_app/chat/list/`;

    const { chatSessions, isLoading, error } = useGetChatSessions(chatSessionsEndpoint);

    if (isLoading) return <p className="text-center text-white">Loading...</p>;
    if (error) return <p className="text-red-500">Error loading chat sessions</p>;

    const categorizedChats = categorizeChatsByDate(chatSessions || []);

    const renderChatsInSection = (chats: ChatSession[], sectionLabel: keyof SectionLabels) => {
        if (chats.length === 0) return null;
        return (
            <>
                <h3 className="text-gray-400 mb-2">{sectionLabel}</h3>
                {chats.map(chat => (
                    <li key={chat.sessionId} className="mb-2">
                        <Link to={`/chat/${chat.sessionId}`} className="text-white hover:text-blue-300">
                            {chat.chatTitle}
                        </Link>
                    </li>
                ))}
            </>
        );
    };

    return (
        <div className="chat-sidebar p-4 bg-zinc-900 border border-gray-300 h-full text-white">
            <ul>
                {renderChatsInSection(categorizedChats.today, "Today")}
                {renderChatsInSection(categorizedChats.yesterday, "Yesterday")}
                {renderChatsInSection(categorizedChats.previous7Days, "Previous 7 Days")}
                {renderChatsInSection(categorizedChats.previous30Days, "Previous 30 Days")}
                {renderChatsInSection(categorizedChats.previous90Days, "Previous 90 Days")}
                {renderChatsInSection(categorizedChats.older, "Older")}
            </ul>
        </div>
    );
};

export default ChatSessionSidebar;
import { useClerk } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import humps from 'humps';
import { IChatMessage } from '../../../pages/GyosuAIChat';

export interface ChatSession {
    sessionId: string;
    userId: number; 
    createdAt: string;
    updatedAt: string;
    chatTitle: string;
    messageHistory: IChatMessage[]; 
}


const fetchChatSessions = async (endpoint: string, token: string | null) => {
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return humps.camelizeKeys(responseData) as ChatSession[];
};

const useGetChatSessions = (endpoint: string) => {
    const { session } = useClerk();

    const query = useQuery<ChatSession[], Error>(['chatSessions'], async () => {
        const token = session ? await session.getToken() : 'none';
        return fetchChatSessions(endpoint, token);
    }, {
        enabled: !!session,
    });

    return {
        getChatSessions: query.refetch,
        isLoading: query.isLoading,
        error: query.error,
        chatSessions: query.data,
    };
};

export default useGetChatSessions;

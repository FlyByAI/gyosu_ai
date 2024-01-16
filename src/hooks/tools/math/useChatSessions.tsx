import { useClerk } from '@clerk/clerk-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import humps from 'humps';
import toast from 'react-hot-toast';
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

const useChatSessions = (endpoint: string) => {
    const { session } = useClerk();
    const queryClient = useQueryClient();

    const query = useQuery<ChatSession[], Error>(['chatSessions'], async () => {
        const token = session ? await session.getToken() : 'none';
        return fetchChatSessions(`${endpoint}list/`, token);
    }, {
        enabled: !!session,
    });

    // const shareChatSessionMutation = useMutation(/* ... */);

    const renameChatSessionMutation = useMutation<any, Error, { sessionId: string, chatTitle: string }>(
        async ({ sessionId, chatTitle }) => {
            const token = session ? await session.getToken() : 'none';
            const body = humps.decamelizeKeys({ chatTitle });
            const response = await fetch(`${endpoint}${sessionId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(humps.camelizeKeys(errorData))}`);
            }

            const responseData = await response.json();
            return humps.camelizeKeys(responseData);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(['chatSessions']);
                toast(`Renamed: ${data.chatTitle}`)
            },
            onError: (error) => {
                queryClient.invalidateQueries(['chatSessions']);
                toast(`Rename failed, error: ${error}`)
            },
        }
    );

    const deleteChatSessionMutation = useMutation(
        async (sessionId: string) => {
            const token = session ? await session.getToken() : 'none';
            await fetch(`${endpoint}${sessionId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
            });
        },
        {
            onSuccess: () => {
                // Invalidate chat sessions query to refresh the list
                queryClient.invalidateQueries(['chatSessions']);
                toast("Session deleted successfully. ", { id: 'error-toast' }); // Show toast notification on error
            },
            onError: (error) => {
                // Invalidate chat sessions query to refresh the list
                queryClient.invalidateQueries(['chatSessions']);
                toast(`Error: ${error}`, { id: 'error-toast' }); // Show toast notification on error
            },
        }
    );

    return {
        getChatSessions: query.refetch,
        isLoading: query.isLoading,
        error: query.error,
        chatSessions: query.data,
        // shareChatSession: shareChatSessionMutation.mutate,
        renameChatSession: renameChatSessionMutation.mutate,
        deleteChatSession: deleteChatSessionMutation.mutate,
    };
};

export default useChatSessions;
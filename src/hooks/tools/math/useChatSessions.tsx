import { useClerk } from '@clerk/clerk-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import humps from 'humps';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ShareLinkModalContent from '../../../components/ShareModalContent';
import { useModal } from '../../../contexts/useModal';
import { SelectedSectionObject } from '../../../pages/ChatArtifacts';
import { IChatMessage } from '../../../pages/GyosuAIChat';

import axios from "../../../helpers/fetchInterceptor" 
import fetchInterceptor from '../../../helpers/fetchInterceptor';

export interface ChatSession {
    sessionId: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    chatTitle: string;
    messageHistory: IChatMessage[];
}

export interface ChatArtifacts {
    sessionId: string;
    outline: string;
    selectedSections: SelectedSectionObject[];
}



const fetchChatSessions = async (endpoint: string, token: string | null) => {
    const response = await fetchInterceptor(endpoint, {
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

const fetchChatSession = async (endpoint: string, sessionId: string, token: string | null) => {
    const response = await fetchInterceptor(`${endpoint}${sessionId}/`, {
        method: 'GET',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return humps.camelizeKeys(responseData) as ChatSession;
};

const fetchArtifacts = async (endpoint: string, sessionId: string, token: string | null) => {
    const response = await fetchInterceptor(`${endpoint}artifacts/${sessionId}/`, {
        method: 'GET',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return humps.camelizeKeys(responseData) as ChatArtifacts;
};

const useChatSessions = (endpoint: string, sessionId?: string) => {

    const { session } = useClerk();

    const navigate = useNavigate()

    const { openModal } = useModal();

    const queryClient = useQueryClient();

    const chatSessionsQuery = useQuery<ChatSession[], Error>(['chatSessions'], async () => {
        const token = session ? await session.getToken() : 'none';
        return fetchChatSessions(`${endpoint}list/`, token);
    }, {
        enabled: !!session,
    });

    const chatSessionQuery = useQuery<ChatSession, Error>(['chatSession', sessionId], async () => {
        if (!sessionId) {
            throw new Error("sessionId is required to fetch a specific chat session.");
        }
        const token = session ? await session.getToken() : 'none';
        return fetchChatSession(`${endpoint}`, sessionId, token);
    }, {
        enabled: !!session && !!sessionId,
        onError: (error) => {
            console.error(`Sorry, we did not find that session. ${sessionId}`, error);
        },
    });

    const chatSessionArtifactsQuery = useQuery<ChatArtifacts, Error>(['chatSessionArtifacts', sessionId], async () => {
        if (!sessionId) {
            throw new Error("sessionId is required to fetch a specific chat session.");
        }
        const token = session ? await session.getToken() : 'none';
        return fetchArtifacts(`${endpoint}`, sessionId, token);
    }, {
        enabled: !!session && !!sessionId,
        onError: (error) => {
            console.error(`Sorry, we did not find that session. ${sessionId}`, error);
        },
    });

    const shareChatSessionMutation = useMutation(
        async (sessionId: string) => {
            const token = session ? await session.getToken() : 'none';
            const response = await fetchInterceptor(`${endpoint}share/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(humps.decamelizeKeys({ sessionId })),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, details: ${errorData}`);
            }

            const responseData = await response.json();
            return humps.camelizeKeys(responseData);
        },
        {
            // Optionally, you can define what happens on success, error, etc.
            onSuccess: (data) => {
                console.log(data)
                console.log('Share link created:', data.shareUrl);
                toast(`Share link created!`);
                openModal('appModal', <ShareLinkModalContent link={data.shareUrl} />);
            },
            onError: (error) => {
                console.error('Error creating share link:', error);
            },
        }
    );

    const acceptShareChatSessionMutation = useMutation(
        async (token: string) => {
            const sessionToken = session ? await session.getToken() : 'none';

            console.log("got token", sessionToken)
            const response = await fetchInterceptor(`${endpoint}share/${token}/`, {
                method: 'GET',
                headers: {
                    'Authorization': sessionToken ? `Bearer ${sessionToken}` : '',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, details: ${errorData}`);
            }

            const responseData = await response.json();
            return humps.camelizeKeys(responseData);
        },
        {
            onSuccess: (data) => {
                if (data.sessionId) {
                    navigate(`/math-app/chat/${data.sessionId}`)
                    toast('Chat session created.')
                    console.log('Chat session accepted:', data);
                }
                else {
                    navigate(`/math-app/chat/`)
                    toast('SessionId was not found in the response data, but session was created.')
                    console.log('SessionId was not found in the response data, but session was created? data:', data);
                }
            },
            onError: (error) => {
                toast('Chat session share failed.')
                navigate(`/math-app/chat/`)
                console.error('Error accepting chat session:', error);
            },
        }
    );

    const renameChatSessionMutation = useMutation<any, Error, { sessionId: string, chatTitle: string }>(
        async ({ sessionId, chatTitle }) => {
            const token = session ? await session.getToken() : 'none';
            const body = humps.decamelizeKeys({ chatTitle });
            const response = await fetchInterceptor(`${endpoint}${sessionId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(humps.decamelizeKeys(body)),
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
            await fetchInterceptor(`${endpoint}${sessionId}/`, {
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
        },
    );

    const deleteAllChatSessionsMutation = useMutation(
        async () => {
            const token = session ? await session.getToken() : 'none';
            await fetchInterceptor(`${endpoint}delete_all/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
            });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['chatSessions']);
                toast("All chat sessions deleted successfully.", { id: 'success-toast' });
            },
            onError: (error) => {
                toast(`Error deleting all chat sessions: ${error}`, { id: 'error-toast' });
            },
        }
    );

    return {
        isLoadingSession: chatSessionQuery.isLoading,
        isLoadingArtifacts: chatSessionArtifactsQuery.isLoading,
        isLoading: chatSessionsQuery.isLoading,
        sessionError: chatSessionQuery.error,
        sessionArtifactsError: chatSessionQuery.error,
        error: chatSessionsQuery.error,
        chatSessions: chatSessionsQuery.data,
        chatSession: chatSessionQuery.data,
        chatSessionArtifacts: chatSessionArtifactsQuery.data,
        acceptShareChatSession: acceptShareChatSessionMutation.mutate,
        shareChatSession: shareChatSessionMutation.mutate,
        renameChatSession: renameChatSessionMutation.mutate,
        deleteChatSession: deleteChatSessionMutation.mutate,
        deleteAllChatSessions: deleteAllChatSessionsMutation.mutate,

    };
};

export default useChatSessions;
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useClerk } from '@clerk/clerk-react';  
import { IChatMessage } from '../pages/GyosuAIChat';

const useChat = (endpoint: string, sessionId?: string) => {
    const queryClient = useQueryClient();
    const { session } = useClerk(); 

    const getBearerToken = async () => {
        return session ? `Bearer ${await session.getToken()}` : 'none';
    };

    // Fetch chat data
    const { data: chatData, isLoading, isError, error } = useQuery(['chat', sessionId], async () => {
        // Only fetch if a sessionId is provided
        if (!sessionId) return;
        const bearerToken = await getBearerToken();
        const response = await axios.get(`${endpoint}/${sessionId}/`, {
            headers: {
                'Authorization': bearerToken,
            },
        });
        return response.data;
    }, {
        enabled: !!sessionId  // Only run query if sessionId is available
    });

    // Send message mutation
    const sendMessageMutation = useMutation(async ({ newMessage, allMessages }: { newMessage: IChatMessage, allMessages: IChatMessage[] }) => {
        const bearerToken = await getBearerToken();
        const payload = {
            newMessage,
            conversation: allMessages,
        };
        const url = sessionId ? `${endpoint}/${sessionId}/` : endpoint;
        const response = await axios.post(url, payload, {
            headers: {
                'Authorization': bearerToken,
            },
        });
        return response.data;
    }, {
        onSuccess: (data) => {
            // Update the query data with the response
            queryClient.setQueryData(['chat', sessionId], data);
        }
    });

    // sendMessage function to call from component
    const sendMessage = (newMessage: IChatMessage, allMessages: IChatMessage[]) => {
        sendMessageMutation.mutate({ newMessage, allMessages });
    };

    return { chatData, isLoading, isError, error, sendMessage };
};

export default useChat;

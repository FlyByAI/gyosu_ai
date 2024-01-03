import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { IChatMessage } from '../pages/GyosuAIChat';

const useChat = (endpoint: string, sessionId?: string) => {
    const queryClient = useQueryClient();

    // Fetch chat data
    const { data: chatData, isLoading, isError, error } = useQuery(['chat', sessionId], async () => {
        // Only fetch if a sessionId is provided
        if (!sessionId) return;
        const response = await axios.get(`${endpoint}/${sessionId}/`);
        return response.data;
    }, {
        enabled: !!sessionId  // Only run query if sessionId is available
    });

    // Send message mutation
    const sendMessageMutation = useMutation(async ({ newMessage, allMessages }: { newMessage: IChatMessage, allMessages: IChatMessage[] }) => {
        const payload = {
            newMessage,
            conversation: allMessages,
        };
        const url = sessionId ? `${endpoint}/${sessionId}/` : endpoint;
        const response = await axios.post(url, payload);
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

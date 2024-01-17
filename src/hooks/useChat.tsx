import { useClerk } from '@clerk/clerk-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import humps from 'humps';
import { IChatMessage } from '../pages/GyosuAIChat';

const useChat = (endpoint: string, sessionId?: string) => {
    const queryClient = useQueryClient();
    const { session } = useClerk(); 

    const getBearerToken = async () => {
        return session ? `Bearer ${await session.getToken()}` : 'none';
    };

   
    const { data: chatData, isLoading, isError, error } = useQuery(['chat', sessionId], async () => {
        if (!sessionId) return;
        const bearerToken = await getBearerToken();
        const response = await axios.get(`${endpoint}/${sessionId}/`, {
            headers: {
                'Authorization': bearerToken,
            },
        });
        return humps.camelizeKeys(response.data);  
    }, {
        enabled: !!session && !!sessionId
    });

   
    const sendMessageMutation = useMutation(async ({ newMessage, allMessages }: { newMessage: IChatMessage, allMessages: IChatMessage[] }) => {
        const bearerToken = await getBearerToken();
        const payload = {
            newMessage,
            conversation: allMessages,
        };
        const url = sessionId ? `${endpoint}/${sessionId}/` : endpoint;
        const response = await axios.post(url, humps.decamelizeKeys(payload), { 
            headers: {
                'Authorization': bearerToken,
            },
        });
        return humps.camelizeKeys(response.data); 
    }, {
        onSuccess: (data) => {
           
            queryClient.setQueryData(['chat', sessionId], data);
        }
    });

   
    const sendMessage = (newMessage: IChatMessage, allMessages: IChatMessage[]) => {
        sendMessageMutation.mutate({ newMessage, allMessages });
    };

    return { chatData, isLoading, isError, error, sendMessage };
};

export default useChat;

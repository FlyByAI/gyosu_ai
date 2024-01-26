import { useClerk } from '@clerk/clerk-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import humps from 'humps';
import toast from 'react-hot-toast';

export interface ChatUsageData {
    uniqueChatters: number;
    chatSessionsPerChatter: string; // Assuming this is a string representation of the type
    singleChatUserCount: number;
    averageMessagesPerUser: string; // JSON string, might need parsing in the front-end
    averageMessagesPerUserPerDay: string; // JSON string, might need parsing in the front-end
    activeUsersOverDays: number[]; // Assuming this is an array of numbers
    activeUsersOverWeeks: number[]; // Assuming this is an array of numbers
    activeUsersOverMonths: number[]; // Assuming this is an array of numbers
    mostActiveUsers: string[]; // Assuming this is an array of strings
}

const fetchChatUsageData = async (endpoint: string, token: string | null) => {
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
    return humps.camelizeKeys(responseData) as ChatUsageData;
};

const useUsageData = (endpoint: string) => {
    const { session } = useClerk();
    const queryClient = useQueryClient(); // will    be used later

    const query = useQuery<ChatUsageData, Error>(['chatUsageData'], async () => {
        const token = session ? await session.getToken() : 'none';
        return fetchChatUsageData(`${endpoint}chat_stats/`, token);
    }, {
        enabled: !!session,
        onError: (error) => {
            toast.error(`Error fetching chat usage data: ${error}`);
        },
    });

    return {
        getChatUsageData: query.refetch,
        isLoading: query.isLoading,
        error: query.error,
        chatUsageData: query.data,
    };
};

export default useUsageData;

import { useClerk } from '@clerk/clerk-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import humps from 'humps';
import toast from 'react-hot-toast';

export interface ChatUsageData {
    uniqueChatters: string[];
    chatSessionsPerChatter: { [username: string]: number };
    singleChatUserCount: number;
    averageMessagesPerUser: { [username: string]: number };
    averageMessagesPerUserPerDay: { [day: string]: number }; 
    activeUsersOverDays: number;
    activeUsersOverWeeks: number;
    activeUsersOverMonths: number;
    mostActiveUsers: { username: string; chatSessionCount: number }[];
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
    console.log("fetched chat usage data:", responseData);
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

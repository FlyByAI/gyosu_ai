import { useClerk } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import humps from 'humps';
import toast from 'react-hot-toast';

interface ChatUser {
    username: string;
    chatSessionCount: number;
  }
  
  interface UsersBySubscriptionType {
    Free: number;
    Lite: number;
    Paid: number;
    Premium: number;
  }
  
  export interface ChatStats {
    uniqueChatters: number;
    mostActiveUsers: ChatUser[];
    usersBySubscription_type: UsersBySubscriptionType;
    singleChatUserCount: number;
    activeUsersOverDays: number;
    activeUsersOverWeeks: number;
    activeUsersOverMonths: number;
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
    return humps.camelizeKeys(responseData) as ChatStats;
};

const useUsageData = (endpoint: string) => {
    const { session } = useClerk();

    const query = useQuery<ChatStats, Error>(['chatUsageData'], async () => {
            const token = session ? await session.getToken() : 'none';
        return fetchChatUsageData(`${endpoint}chat_stats/`, token);
    }, {
        enabled: !!session,
        onError: (error) => {
            toast.error(`Error fetching chat usage data: ${error}`);
        },
    });

    return {
        isLoading: query.isLoading,
        error: query.error,
        chatUsageData: query.data,
    };
};

export default useUsageData;

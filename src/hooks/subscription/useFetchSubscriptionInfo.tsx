import { useClerk } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';

interface SubscriptionInfo {
    has_valid_subscription: boolean;
    active_trial: boolean;
    has_activated_trial: boolean;
    time_left_in_trial?: number;
}

const fetchSubscriptionInfo = async (endpoint: string, token: string | null) => {
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData as SubscriptionInfo;
};

const useFetchSubscriptionInfo = (endpoint: string) => {
    const { session } = useClerk();

    const query = useQuery<SubscriptionInfo, Error>(['subscription', endpoint], async () => {
        const token = session ? await session.getToken() : 'none';
        return fetchSubscriptionInfo(endpoint, token);
    }, {
        enabled: !!session,
    });

    return {
        isLoading: query.isLoading,
        error: query.error,
        subscriptionInfo: query.data,
    };
};

export default useFetchSubscriptionInfo;

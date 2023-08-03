import { useClerk } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';

interface SubscriptionInfo {
    has_valid_subscription: boolean;
    active_trial: boolean;
    has_activated_trial: boolean;
}

const useFetchSubscriptionInfo = (endpoint: string) => {
    const { session } = useClerk();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);


    useEffect(() => {
        const fetchSubscriptionInfo = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = session ? await session.getToken() : "none";

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
                setSubscriptionInfo(responseData);

                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchSubscriptionInfo();
    }, [endpoint, session]);

    return { subscriptionInfo, isLoading, error };
};

export default useFetchSubscriptionInfo;

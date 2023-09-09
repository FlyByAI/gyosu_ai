import React from 'react';
import { useClerk } from '@clerk/clerk-react';
import useFetchSubscriptionInfo from '../hooks/subscription/useFetchSubscriptionInfo';
import useEnvironment from '../hooks/useEnvironment';

const Subscription: React.FC = () => {
    const { apiUrl } = useEnvironment();
    const { subscriptionInfo, isLoading } = useFetchSubscriptionInfo(`${apiUrl}/user_data/get_subscription_info/`);

    const { session } = useClerk();

    return (
        session ? <div>
            {!isLoading && subscriptionInfo && (
                <>
                    {/* {(subscriptionInfo?.has_valid_subscription || subscriptionInfo?.active_trial) ? null : <RedirectToSubscribePageButton />} */}
                </>
            )}
        </div> : null
    );
};

export default Subscription;

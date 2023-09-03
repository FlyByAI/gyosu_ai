import React from 'react';
import { useClerk } from '@clerk/clerk-react';
import ManageSubscriptionButton from './ManageSubscriptionButton';
import { RedirectToSubscribePageButton } from './SubscribeButton';
import TrialButton from './TrialButton';
import { notSecretConstants } from '../constants/notSecretConstants';
import useFetchSubscriptionInfo from '../hooks/subscription/useFetchSubscriptionInfo';

const Subscription: React.FC = () => {
    const { subscriptionInfo, isLoading } = useFetchSubscriptionInfo(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/user_data/get_subscription_info/`);

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

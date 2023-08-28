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
                    {!subscriptionInfo?.has_valid_subscription && subscriptionInfo?.has_activated_trial && !subscriptionInfo?.active_trial && <RedirectToSubscribePageButton />}
                    {!subscriptionInfo?.has_valid_subscription && (subscriptionInfo?.active_trial || !subscriptionInfo?.has_activated_trial) && <TrialButton />}
                    {subscriptionInfo?.has_valid_subscription && <ManageSubscriptionButton />}
                </>
            )}
        </div> : null
    );
};

export default Subscription;

import React from 'react';

import CheckIcon from '../svg/CheckIcon';
import useInitiatePortalSession from '../hooks/subscription/useInitiatePortalSession';
import useFetchSubscriptionInfo from '../hooks/subscription/useFetchSubscriptionInfo';
import useEnvironment from '../contexts/useEnvironment';

const ManageSubscriptionButton: React.FC = () => {

    const { initiatePortalSession } = useInitiatePortalSession();

    const { apiUrl } = useEnvironment();

    const redirectToPortal = async () => {
        const manageSubLink = await initiatePortalSession(apiUrl);
        if (manageSubLink) {
            window.location.replace(manageSubLink);
        }
    };

    const { subscriptionInfo, isLoading } = useFetchSubscriptionInfo(`${apiUrl}/user_data/get_subscription_info/`);

    return (
        subscriptionInfo?.has_valid_subscription ?
            <div
                onClick={redirectToPortal}
                className=" mx-2 py-2 rounded h-auto w-32 flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-800"
            >
                <p>Manage Subscription</p>
            </div>
            : null
    );
};

export default ManageSubscriptionButton;
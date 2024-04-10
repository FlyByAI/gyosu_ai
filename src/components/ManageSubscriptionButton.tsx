import React from 'react';

import useFetchSubscriptionInfo from '../hooks/subscription/useFetchSubscriptionInfo';
import useInitiatePortalSession from '../hooks/subscription/useInitiatePortalSession';
import useEnvironment from '../hooks/useEnvironment';

const ManageSubscriptionButton: React.FC = () => {

    const { initiatePortalSession } = useInitiatePortalSession();

    const { apiUrl } = useEnvironment();

    const redirectToPortal = async () => {
        const manageSubLink = await initiatePortalSession(apiUrl);
        if (manageSubLink) {
            window.location.replace(manageSubLink);
        }
        else
            console.log("no link provided")
    };

    const { subscriptionInfo, isLoading } = useFetchSubscriptionInfo(`${apiUrl}/user_data/get_subscription_info/`);

    return (
        subscriptionInfo?.has_valid_subscription ?
            <div
                onClick={redirectToPortal}
                className="rounded flex h-auto items-center justify-center cursor-pointer"
            >
                <button className='btn btn-secondary w-full'>Manage Subscription</button>
            </div>
            : null
    );
};

export default ManageSubscriptionButton;
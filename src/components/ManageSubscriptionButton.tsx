import React, { useEffect } from 'react';

import { GridLoader } from 'react-spinners';
import useFetchSubscriptionInfo from '../hooks/subscription/useFetchSubscriptionInfo';
import useInitiatePortalSession from '../hooks/subscription/useInitiatePortalSession';
import useEnvironment from '../hooks/useEnvironment';

const ManageSubscriptionButton: React.FC = () => {

    const { initiatePortalSession, data, isLoading, error } = useInitiatePortalSession();

    const { apiUrl } = useEnvironment();

    const redirectToPortal = async () => {
        await initiatePortalSession(apiUrl);
    };

    useEffect(() => {
        if (data) {
            window.location.replace(data.url);
        }
        else
            console.log("no link provided")
    }, [initiatePortalSession, apiUrl, data]);

    const { subscriptionInfo } = useFetchSubscriptionInfo(`${apiUrl}/user_data/get_subscription_info/`);

    return (
        subscriptionInfo?.has_valid_subscription ?
            <div
                onClick={redirectToPortal}
                className="rounded flex flex-col h-auto items-center justify-center cursor-pointer"
            >
                <button className='btn btn-secondary w-full'>Manage Subscription</button>
                {isLoading &&
                    <div>
                        <div>
                            <GridLoader color="#4A90E2" size={4} margin={4} speedMultiplier={.75} className='mr-2 my-4' />
                        </div>
                        <p>Thank you for supporting us!</p>
                        <p>Just a moment while we collect your subscription information for you to review.</p>
                    </div>
                }
                <div>
                    {error && <p className="text-red-500">{error.message}</p>}
                </div>
            </div>
            : null
    );
};

export default ManageSubscriptionButton;
import React from 'react';

import CheckIcon from '../svg/CheckIcon';
import useInitiatePortalSession from '../hooks/subscription/useInitiatePortalSession';

const ManageSubscriptionButton: React.FC = () => {

    const { initiatePortalSession } = useInitiatePortalSession();

    const redirectToPortal = async () => {
        const manageSubLink = await initiatePortalSession();
        if (manageSubLink) {
            window.location.replace(manageSubLink);
        }
    };
    return (
        <div
            onClick={redirectToPortal}
            className="py-2 rounded h-auto w-32 flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-800"
        >
            <p>Manage Subscription</p>
        </div>

    );
};

export default ManageSubscriptionButton;
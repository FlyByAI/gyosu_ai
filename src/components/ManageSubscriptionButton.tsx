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
            className="fixed bottom-4 left-4 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white text-sm rounded-lg h-10 w-32 flex items-center justify-center shadow-2xl cursor-pointer transition-colors z-50">
            <p className='text-center me-1'>Subscribed</p><CheckIcon />
        </div>

    );
};

export default ManageSubscriptionButton;
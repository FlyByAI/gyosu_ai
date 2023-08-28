import React from 'react';

import useInitiateCheckout from '../hooks/subscription/useInitiateCheckout';
import { notSecretConstants } from '../constants/notSecretConstants';
import CheckIcon from '../svg/CheckIcon';



const ManageSubscriptionButton: React.FC = () => {

    const { initiateCheckout } = useInitiateCheckout(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/stripe/create-checkout-session/`)
    const manageSubLink = "https://billing.stripe.com/p/login/test_28oeWCcQV0fQ03S144"
    return (
        <div
            onClick={() => window.location.replace(manageSubLink)}
            className="fixed bottom-4 left-4 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white text-sm rounded-lg h-10 w-32 flex items-center justify-center shadow-2xl cursor-pointer transition-colors z-50">
            <p className='text-center me-1'>Subscribed</p><CheckIcon />
        </div>

    );
};

export default ManageSubscriptionButton;
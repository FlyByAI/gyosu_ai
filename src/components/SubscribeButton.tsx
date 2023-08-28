import React from 'react';

import useInitiateCheckout from '../hooks/subscription/useInitiateCheckout';
import { notSecretConstants } from '../constants/notSecretConstants';
import { Link } from 'react-router-dom';
import useFetchSubscriptionInfo from '../hooks/subscription/useFetchSubscriptionInfo';




const SubscribePremiumButton = ({ className }: { className: string }) => {

    const { initiateCheckout } = useInitiateCheckout(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/stripe/create-checkout-session/premium/`)

    return (
        <div
            onClick={initiateCheckout}
            className={className}
        >
            <p className='ms-2'>Get Premium</p>
        </div>
    );
};


const SubscribeLiteButton = ({ className }: { className: string }) => {

    const { initiateCheckout } = useInitiateCheckout(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/stripe/create-checkout-session/lite/`)

    return (
        <div
            onClick={initiateCheckout}
            className={className}
        >
            <p className='ms-2'>Get Lite</p>
        </div>
    );
};



const RedirectToSubscribePageButton: React.FC = () => {
    const { subscriptionInfo, isLoading } = useFetchSubscriptionInfo(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/user_data/get_subscription_info/`)

    return (
        <Link
            to='/subscribe'
            className="font-bold fixed bottom-4 left-4 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white text-sm rounded-lg h-10 w-36 flex items-center justify-center shadow-2xl cursor-pointer transition-colors z-50">
            <p className='ms-2'>{(!subscriptionInfo?.has_activated_trial && !subscriptionInfo?.has_valid_subscription) ? "Get Free Trial" : "Get Premium"}</p>
        </Link>
    );
};

export { RedirectToSubscribePageButton, SubscribeLiteButton, SubscribePremiumButton }

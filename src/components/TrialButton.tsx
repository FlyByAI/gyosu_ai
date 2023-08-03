import React from 'react';

import useInitiateCheckout from '../hooks/subscription/useInitiateCheckout';
import { notSecretConstants } from '../constants/notSecretConstants';
import useFetchSubscriptionInfo from '../hooks/subscription/useFetchSubscriptionInfo';
import useActivateTrial from '../hooks/subscription/useActivateTrial';

const TokenIcon: React.FC = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="url(#goldGradient)"
            stroke="#af7543"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-5 m-1"
        >
            <defs>
                <linearGradient id="goldGradient" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style={{ stopColor: "#FFD700" }} />
                    <stop offset="100%" style={{ stopColor: "#FFCC33" }} />
                </linearGradient>
            </defs>
            <ellipse cx="12" cy="16" rx="10" ry="8" />
            <ellipse cx="12" cy="12" rx="10" ry="8" />
            <ellipse cx="12" cy="8" rx="10" ry="8" />
        </svg>
    );
};


interface TrialButtonProps {
    tokens: number;
}

const TrialButton: React.FC<TrialButtonProps> = ({ tokens }) => {

    const { trialActivated, activateTrial } = useActivateTrial(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/stripe/activate-trial/`)
    const { subscriptionInfo, isLoading } = useFetchSubscriptionInfo(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/user_data/get_subscription_info/`)
    return (!isLoading ?
        <div
            onClick={activateTrial}
            className="font-bold fixed bottom-4 left-4 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white text-sm rounded-lg h-10 w-32 flex items-center justify-center shadow-2xl cursor-pointer transition-colors z-50">
            <TokenIcon />{trialActivated || subscriptionInfo?.active_trial ? <p className='ms-2'>Trial Active</p> : <p className='ms-2'>Free Trial</p>}
        </div> : null
    );
};

export default TrialButton;
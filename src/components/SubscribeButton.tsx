import React from 'react';

import useInitiateCheckout from '../hooks/subscription/useInitiateCheckout';
import { notSecretConstants } from '../constants/notSecretConstants';

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


interface SubscribeButtonProps {
    tokens: number;
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({ tokens }) => {

    const { initiateCheckout } = useInitiateCheckout(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/stripe/create-checkout-session/`)

    return (
        <div
            onClick={initiateCheckout}
            className="font-bold fixed bottom-4 left-4 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white text-sm rounded-lg h-10 w-36 flex items-center justify-center shadow-2xl cursor-pointer transition-colors z-50">
            <TokenIcon /><p className='ms-2'>Get Premium</p>
        </div>
    );
};

export default SubscribeButton;
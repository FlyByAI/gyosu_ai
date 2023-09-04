import React from 'react';

import useInitiateCheckout from '../hooks/subscription/useInitiateCheckout';
import { notSecretConstants } from '../constants/notSecretConstants';
import { Link } from 'react-router-dom';
import useFetchSubscriptionInfo from '../hooks/subscription/useFetchSubscriptionInfo';




const SubscribePremiumButton = ({ className }: { className: string }) => {

    const url = `${window.location.href.includes("https://test.gyosu.ai")
        ? notSecretConstants.testDjangoApi
        : import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/stripe/create-checkout-session/premium/`

    const { initiateCheckout } = useInitiateCheckout(`${window.location.href.includes("https://test.gyosu.ai")
        ? notSecretConstants.testDjangoApi
        : import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/stripe/create-checkout-session/premium/`);

    const diamondCount = 10;
    const diamonds = Array.from({ length: diamondCount }, (_, i) => {
        return {
            x: (i / (diamondCount - 1)) * 100,
            y: Math.floor(Math.random() * 200) - 100
        };
    });

    return (
        <div
            onClick={initiateCheckout}
            className={`${className} relative group overflow-hidden rain-diamonds`}
        >
            <p className='z-10 relative'>Get Premium</p>
            {diamonds.map((pos, i) => (
                <div
                    key={i}
                    className={`diamond absolute opacity-0 group-hover:opacity-100`}
                    style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        animationDelay: `${i * 0.1}s`
                    }}
                >
                    💎
                </div>
            ))}
        </div>
    );
};


const SubscribeLiteButton = ({ className }: { className: string }) => {

    const { initiateCheckout } = useInitiateCheckout(`${window.location.href.includes("https://test.gyosu.ai")
        ? notSecretConstants.testDjangoApi
        : import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/stripe/create-checkout-session/lite/`)

    return (
        <div
            onClick={initiateCheckout}
            className={`${className} relative group`}
        >
            <p className=''>Get Lite</p>
            <div className='absolute left-0 bottom-0 transform opacity-0 group-hover:opacity-100 group-hover:translate-x-[250px] transition-transform duration-500 ease-in-out transition-opacity'>
                🚀
            </div>
        </div>
    );
};



const RedirectToSubscribePageButton: React.FC = () => {
    const { subscriptionInfo, isLoading } = useFetchSubscriptionInfo(`${window.location.href.includes("https://test.gyosu.ai")
        ? notSecretConstants.testDjangoApi
        : import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/user_data/get_subscription_info/`)

    return (
        <Link
            to='/subscribe'
            className="font-bold fixed bottom-4 left-4 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white text-sm rounded-lg h-10 w-36 flex items-center justify-center shadow-2xl cursor-pointer transition-colors z-50">
            <p className=''>Get Premium</p>
        </Link>
    );
};

export { RedirectToSubscribePageButton, SubscribeLiteButton, SubscribePremiumButton }

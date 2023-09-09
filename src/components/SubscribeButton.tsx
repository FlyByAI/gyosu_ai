import React from 'react';

import useInitiateCheckout from '../hooks/subscription/useInitiateCheckout';
import { Link } from 'react-router-dom';
import useEnvironment from '../hooks/useEnvironment';
import { useClerk } from '@clerk/clerk-react';
import { use } from 'i18next';


const SubscribeFreeButton = ({ className }: { className: string }) => {

    const { openSignIn } = useClerk();

    const handleCheckout = () => {
        openSignIn()
    }

    const {session} = useClerk();

    return (
        <div
            onClick={handleCheckout}
            className={`${className} relative group overflow-hidden rain-diamonds`}
        >
            <p className='z-10 relative'>{!session ? "Sign Up" : "Free"}</p>
        </div>
    );
};



const SubscribePremiumButton = ({ className }: { className: string }) => {
    const { apiUrl } = useEnvironment();

    const { session, openSignIn } = useClerk();

    const url = `${apiUrl}/stripe/create-checkout-session/premium/`

    const { initiateCheckout } = useInitiateCheckout(`${apiUrl}/stripe/create-checkout-session/premium/`);

    const handleCheckout = () => {
        if (session) {
            initiateCheckout()
        }
        else {
            openSignIn()
        }
    }

    return (
        <div
            onClick={handleCheckout}
            className={`${className} relative group overflow-hidden rain-diamonds`}
        >
            <p className='z-10 relative'>Subscribe</p>
        </div>
    );
};


const SubscribeLiteButton = ({ className }: { className: string }) => {
    const { session, openSignIn } = useClerk();

    const { apiUrl } = useEnvironment();
    const { initiateCheckout } = useInitiateCheckout(`${apiUrl}/stripe/create-checkout-session/lite/`)

    const handleCheckout = () => {
        if (session) {
            initiateCheckout()
        }
        else {
            openSignIn()
        }
    }

    return (
        <div
            onClick={handleCheckout}
            className={`${className} relative group`}
        >
            <p className=''>Subscribe</p>
        </div>
    );
};



const RedirectToSubscribePageButton: React.FC = () => {
    const { apiUrl } = useEnvironment();

    return (
        <Link
            to='/subscribe'
            className="font-bold fixed bottom-4 left-4 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white text-sm rounded-lg h-10 w-36 flex items-center justify-center shadow-2xl cursor-pointer transition-colors z-50">
            <p className=''>Subscribe</p>
        </Link>
    );
};

export { RedirectToSubscribePageButton, SubscribeLiteButton, SubscribePremiumButton, SubscribeFreeButton }

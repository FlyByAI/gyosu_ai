import React, { FormEvent } from 'react';

import { useClerk } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import useInitiateCheckout from '../hooks/subscription/useInitiateCheckout';
import useEnvironment from '../hooks/useEnvironment';


const SubscribeFreeButton = ({ className }: { className: string }) => {

    const { openSignIn } = useClerk();

    const handleCheckout = () => {
        openSignIn({
            afterSignInUrl: window.location.href
        });
    }

    const { session } = useClerk();

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

    const handleCheckout = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const coupon = formData.get("coupon") as string; // Retrieve coupon

        if (session) {
            initiateCheckout({ coupon }); // Pass coupon to initiateCheckout
        } else {
            openSignIn({
                afterSignInUrl: window.location.href
            });
        }
    };

    return (
        <form onSubmit={handleCheckout}>

            <button
                type="submit"
                className={`${className} relative group w-32`}
            >
                <p className="">Subscribe</p>
            </button>
            <div className="flex flex-col items-center bg-gray-800">
                <input
                    type="text"
                    name="coupon"
                    placeholder="Enter coupon"
                    className="mt-4 p-2 rounded bg-gray-700 w-64"
                />
            </div>
        </form>
    );
};


const SubscribeLiteButton = ({ className }: { className: string }) => {
    const { session, openSignIn } = useClerk();

    const { apiUrl } = useEnvironment();
    const { initiateCheckout } = useInitiateCheckout(`${apiUrl}/stripe/create-checkout-session/lite/`)

    const handleCheckout = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const coupon = formData.get("coupon") as string; // Retrieve coupon

        if (session) {
            initiateCheckout({ coupon }); // Pass coupon to initiateCheckout
        } else {
            openSignIn({
                afterSignInUrl: window.location.href
            });
        }
    };

    return (
        <form onSubmit={handleCheckout}>
            <button
                type="submit"
                className={`${className} relative group w-32`}
            >
                <p className="">Subscribe</p>
            </button>
            <div className="flex flex-col items-center bg-gray-800">
                <input
                    type="text"
                    name="coupon"
                    placeholder="Enter coupon"
                    className="mt-4 p-2 rounded bg-gray-700 w-64"
                />
            </div>
        </form>

    );
};

const SubscribePaidButton = ({ className }: { className?: string }) => {
    const { session, openSignIn } = useClerk();

    const { apiUrl } = useEnvironment();
    const { initiateCheckout } = useInitiateCheckout(`${apiUrl}/stripe/create-checkout-session/paid/`)

    const handleCheckout = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const coupon = formData.get("coupon") as string; // Retrieve coupon

        if (session) {
            initiateCheckout({ coupon }); // Pass coupon to initiateCheckout
        } else {
            openSignIn({
                afterSignInUrl: window.location.href
            });
        }
    };

    return (
        <form onSubmit={handleCheckout} className={"flex flex-col items-center " + className}>
            <div className="form-control w-full mt-4">
                <input
                    type="text"
                    name="coupon"
                    placeholder="Enter coupon"
                    className="input input-bordered"
                />
            </div>
            <button
                type="submit"
                className="btn btn-primary mt-4 w-full"
            >
                Subscribe
            </button>
        </form>

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

export { RedirectToSubscribePageButton, SubscribeFreeButton, SubscribeLiteButton, SubscribePaidButton, SubscribePremiumButton };


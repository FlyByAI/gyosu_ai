import { useState } from 'react';
import { useClerk } from '@clerk/clerk-react';
import { loadStripe } from '@stripe/stripe-js';
import { notSecretConstants } from '../../constants/notSecretConstants';

interface ICheckoutResponse {
    message: string;
    sessionId: string;
}

const useInitiateCheckout = (endpoint: string) => {
    const { session } = useClerk();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ICheckoutResponse | null>(null);

    const stripePromise = loadStripe(notSecretConstants.stripe.PUBLISHABLE_KEY);

    const initiateCheckout = async (): Promise<void> => {
        setLoading(true);
        setError(null);


        try {
            const token = session ? await session.getToken() : "none";

            // Call your backend to create the Checkout Session
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({
                    success_url: "https://gyosu.ai",
                    cancel_url: "https://gyosu.ai"
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.statusText} ${response.status}`);
            }

            const sessionData = await response.json() as ICheckoutResponse;
            setData(sessionData);

            // Get Stripe.js instance
            const stripe = await stripePromise;

            // When the customer clicks on the button, redirect them to Checkout.
            const result = await stripe?.redirectToCheckout({
                sessionId: sessionData.sessionId,
            });

            if (result?.error) {
                throw new Error(result.error.message);
            }

            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return { initiateCheckout, isLoading, error, data };
};

export default useInitiateCheckout;

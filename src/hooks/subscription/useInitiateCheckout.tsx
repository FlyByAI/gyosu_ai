import { useState } from 'react';
import { useClerk } from '@clerk/clerk-react';
import { loadStripe } from '@stripe/stripe-js';
import { notSecretConstants } from '../../constants/notSecretConstants';
import useEnvironment from '../useEnvironment';

interface ICheckoutResponse {
    message: string;
    sessionId: string;
}

interface IInitiateOptions {
    coupon?: string;
}

const useInitiateCheckout = (endpoint: string) => {
    const { session } = useClerk();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ICheckoutResponse | null>(null);

    const { env } = useEnvironment();
    const stripePromise = loadStripe(env === "production" ? notSecretConstants.stripe.PUBLISHABLE_KEY : notSecretConstants.stripe.PUBLISHABLE_DEV_KEY);

    const initiateCheckout = async (options: IInitiateOptions = {}): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const token = session ? await session.getToken() : "none";

            const requestBody = {
                success_url: "https://gyosu.ai",
                cancel_url: "https://gyosu.ai",
                ...options
            };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.statusText} ${response.status}`);
            }

            const sessionData = await response.json() as ICheckoutResponse;
            setData(sessionData);

            const stripe = await stripePromise;

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

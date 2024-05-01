import { useClerk } from '@clerk/clerk-react';
import { StripeError, loadStripe } from '@stripe/stripe-js';

import { useState } from 'react';
import { notSecretConstants } from '../../constants/notSecretConstants';
import useEnvironment from '../useEnvironment';
import fetchInterceptor from '../../helpers/fetchInterceptor';

interface ICheckoutResponse {
    message: string;
    sessionId: string;
}

interface IInitiateOptions {
    coupon?: string;
}

const useInitiateCheckout = (endpoint: string): {
    initiateCheckout: (options: IInitiateOptions) => Promise<void>;
    isLoading: boolean;
    error: Error | null;
    data: ICheckoutResponse | null;
} => {
    const { session } = useClerk();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
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

            const response = await fetchInterceptor(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorResponse: Error | StripeError = await response.json();  // Fetch error message if any
                throw new Error(errorResponse.message || `HTTP error! Status: ${response.statusText} ${response.status}`);
            }

            const sessionData: ICheckoutResponse = await response.json();
            setData(sessionData);

            const stripe = await stripePromise;
            const result = await stripe?.redirectToCheckout({
                sessionId: sessionData.sessionId,
            });

            if (result?.error) {
                throw new Error(result.error.message);
            }

            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
            setLoading(false);
        }
    };

    return { initiateCheckout, isLoading, error, data };
};

export default useInitiateCheckout;
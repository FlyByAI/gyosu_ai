import { useState } from 'react';
import { useClerk } from '@clerk/clerk-react';

interface ISubmitUrlResponse {
    message: string;
    sessionId: string;
}

const useSubmitUrl = (endpoint: string) => {
    const { session } = useClerk();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ISubmitUrlResponse | null>(null);

    const submitUrl = async (url: string): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const token = session ? await session.getToken() : "none";
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.statusText} ${response.status}`);
            }

            const responseData = await response.json() as ISubmitUrlResponse;
            setData(responseData);
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return { submitUrl, isLoading, error, data };
};

export default useSubmitUrl;

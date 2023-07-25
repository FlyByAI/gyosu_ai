import { useClerk } from '@clerk/clerk-react';
import { useState } from 'react';

const useSubmitTextWithMarkdown = (endpoint: string) => {
    const { session } = useClerk();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any | null>(null);

    const submitTextWithMarkdown = async (text: string, markdown: string) => {
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
                body: JSON.stringify({ text, markdown })  // Add markdown variable here

            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            setData(responseData);

            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return { submitTextWithMarkdown, isLoading, error, data };
};

export default useSubmitTextWithMarkdown;

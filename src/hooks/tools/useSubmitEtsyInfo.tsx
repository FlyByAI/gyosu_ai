import { useClerk } from '@clerk/clerk-react';
import { useState } from 'react';

const useSubmitEtsyInfo = (endpoint: string) => {
    const { session } = useClerk();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any | null>(null);

    const submitEtsyInfo = async (form_data: { shopInformation: string, productInformation: string, targetAudience: string, additionalText: string }) => {

        setLoading(true);
        setError(null);
        const token = session ? await session.getToken() : "none";

        const payload = {
            user_input: {
                ...form_data
            }
        }
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(payload)

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

    return { submitEtsyInfo, isLoading, error, data };
};

export default useSubmitEtsyInfo;
import { useClerk } from '@clerk/clerk-react';
import { useState } from 'react';

const useActivateTrial = (endpoint: string) => {
    const { session } = useClerk();

    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [trialActivated, setTrialActivated] = useState<boolean | null>(null);

    const activateTrial = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = session ? await session.getToken() : "none";

            const response = await fetch(endpoint, {
                method: 'POST', // Assuming you want to use POST for this endpoint
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            setTrialActivated(responseData.trial);

            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return { trialActivated, isLoading, error, activateTrial };
};

export default useActivateTrial;

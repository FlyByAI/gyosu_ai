// New hook: useInitiatePortalSession.ts
import { useClerk } from '@clerk/clerk-react';
import humps from 'humps';
import { useCallback, useState } from 'react';
import fetchInterceptor from '../../helpers/fetchInterceptor';

interface IPortalSessionResponse {
    url: string;
}

export default function useInitiatePortalSession() {
    const { session } = useClerk();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<IPortalSessionResponse | null>(null);

    const initiatePortalSession = useCallback(async (apiUrl: string): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const token = session ? await session.getToken() : "none";
            const currentURL = window.location.href;

            const response = await fetchInterceptor(`${apiUrl}/stripe/create-portal-session/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(humps.decamelizeKeys({
                    returnUrl: currentURL
                }))
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || `HTTP error! Status: ${response.status}`);
            }

            const sessionData: IPortalSessionResponse = await response.json();
            setData(sessionData);
            setLoading(false);
            
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
            setLoading(false);
        }
    }, [session]);

    return { initiatePortalSession, isLoading, error, data };
}

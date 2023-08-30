// New hook: useInitiatePortalSession.ts
import { useCallback } from 'react';
import axios from 'axios';
import { notSecretConstants } from '../../constants/notSecretConstants';
import { useClerk } from '@clerk/clerk-react';
import humps from 'humps';


export default function useInitiatePortalSession() {
    const { session } = useClerk();

    const initiatePortalSession = useCallback(async () => {
        try {
            const token = session ? await session.getToken() : "none";
            const currentURL = window.location.href;

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/stripe/create-portal-session/`,
                humps.decamelizeKeys({
                    returnUrl: currentURL
                }),
                {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    },
                }
            );
            return response.data.url;
        } catch (error) {
            console.error('Failed to initiate portal session', error);
        }
    }, [session]);

    return { initiatePortalSession };
}

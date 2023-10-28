import { useClerk } from '@clerk/clerk-react';
import humps from 'humps';
import { useState } from 'react';
import { useLanguage } from '../../../contexts/useLanguage';
import { languageNames } from '../../../helpers/language';

export interface PlaygroundFormData {
    textbook: string;
    useExistingBank: boolean;
    problemBankId: number | null;
    teachingTarget: string;
    contentType: string;
    contentLength: string;
    additionalDetails: string;
}

const useSubmitPlayground = (endpoint: string) => {
    const { session } = useClerk();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any | null>(null);

    const { language } = useLanguage();
    const options = { site_language: languageNames[language] };

    const submitPlayground = async (formData: PlaygroundFormData) => {
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
                body: JSON.stringify(humps.decamelizeKeys({ ...formData, ...options }))
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json().then((json) => humps.camelizeKeys(json));
            setData(responseData);

            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return { submitPlayground, isLoading, error, data };
};

export default useSubmitPlayground;

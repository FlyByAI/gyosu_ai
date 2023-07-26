import { useClerk } from '@clerk/clerk-react';
import humps from 'humps';
import { useState } from 'react';

export interface MathFormData {
    id?: number;
    creator: string | null | undefined;
    sourceMaterial: string;
    documentType: string;
    chapter?: string;
    section: string;
    problemType?: string;
    userInput: string;
    upvotes?: number;
    tips?: number;
}

const useSubmitMathForm = (endpoint: string) => {
    const { session } = useClerk();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any | null>(null);

    const submitMathForm = async (formData: MathFormData) => {
        setLoading(true);
        setError(null);
        try {
            const token = session ? await session.getToken() : "none";

            console.log(formData)

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(humps.decamelizeKeys({ ...formData, type: formData.documentType }))
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

    return { submitMathForm, isLoading, error, data };
};

export default useSubmitMathForm;

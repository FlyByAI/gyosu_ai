import { useClerk } from '@clerk/clerk-react';
import { useState } from 'react';
import { MathFormData } from './useSubmitMathForm';
import humps from 'humps';

interface DocumentData {
    markdown: string;
    formData: MathFormData;
}

const useSubmitDocument = (endpoint: string) => {
    const { session } = useClerk();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any | null>(null);

    const submitDocument = async (documentData: DocumentData) => {

        setLoading(true);
        setError(null);
        try {
            const token = session ? await session.getToken() : "none";

            const payload = humps.decamelizeKeys({ markdown: documentData.markdown, ...documentData.formData })
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

            setData(humps.camelizeKeys(responseData) as MathFormData);


            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return { submitDocument, isLoading, error, data };
};

export default useSubmitDocument;

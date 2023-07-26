import { useClerk } from '@clerk/clerk-react';
import humps from 'humps';
import { useState } from 'react';

export interface SearchFormData {
    sourceMaterial: string;
    documentType: string;
    chapter?: string;
    section?: string;
}

export interface MathDocument {
    // Define the structure of your MathDocument object here
    // Adjust the properties to match your actual API response
    id: number;
    creator: string | null | undefined;
    markdown: string;
    sourceMaterial: string;
    documentType: string;
    chapter?: string;
    section?: string;
    problemType?: string;
    userInput: string;
    upvotes?: number;
    tips?: number;
}

const useSearchMathDocuments = (endpoint: string) => {
    const { session } = useClerk();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<MathDocument[] | null>(null);

    const searchMathDocuments = async (formData: SearchFormData) => {
        setLoading(true);
        setError(null);
        try {
            const token = session ? await session.getToken() : 'none';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(humps.decamelizeKeys(formData)),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json().then((json) => humps.camelizeKeys(json));

            setData(responseData as MathDocument[]);

            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return { searchMathDocuments, isLoading, error, data };
};

export default useSearchMathDocuments;

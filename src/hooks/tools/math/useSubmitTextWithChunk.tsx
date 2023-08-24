import { useClerk } from '@clerk/clerk-react';
import humps from 'humps';
import { useState } from 'react';
import { Chunk, ProblemData } from '../../../interfaces';
import { useLanguage } from '../../../contexts/useLanguage';

const useSubmitTextWithChunk = (endpoint: string) => {
    const { session } = useClerk();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any | null>(null);

    const submitTextWithChunk = async (userInput: string, chunk: Chunk, options = { language: "en", topic: "none" }) => {
        setLoading(true);
        setError(null);

        try {
            const token = session ? await session.getToken() : "none";

            const body = humps.decamelizeKeys({ userInput, chunk, ...options });

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(body)  // Add Chunk variable here

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

    return { submitTextWithChunk, isLoading, error, data };
};

export default useSubmitTextWithChunk;

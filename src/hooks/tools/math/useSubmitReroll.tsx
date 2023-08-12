import { useState } from 'react';
import { useClerk } from '@clerk/clerk-react';
import humps from 'humps';
import { ProblemData } from '../../../interfaces';


const useSubmitReroll = (endpoint: string) => {
    const { session } = useClerk();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any | null>(null);

    const submitReroll = async (problem: string, data: ProblemData): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const token = session ? await session.getToken() : "none";
            const body = humps.decamelizeKeys({ problem: problem, ...data, chapter: data.section.split(".")[0], section: data.section.split(".")[1] });
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.statusText} ${response.status}`);
            }

            const responseData = await response.json().then((json) => humps.camelizeKeys(json));
            setData(responseData);
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return { submitReroll, isLoading, error, data };
};

export default useSubmitReroll;

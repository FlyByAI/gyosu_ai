import { useClerk } from '@clerk/clerk-react';
import humps from 'humps';
import { useCallback, useState } from 'react';

const useStreamedResponse = (endpoint: string, headers: any) => {
    const [data, setData] = useState<string | null>(null);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { session } = useClerk();

    const startStreaming = useCallback(async (bodyContent: any) => {
        setData("");
        const abortController = new AbortController();
        const token = session ? await session.getToken() : 'none';

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : '',
                        ...headers
                    },
                    body: JSON.stringify(humps.decamelizeKeys(bodyContent)),
                    signal: abortController.signal,
                });

                const reader = response?.body?.getReader();
                const decoder = new TextDecoder('utf-8');

                reader?.read().then(function processText({ done, value }): Promise<void> {
                    if (done) {
                        setLoading(false);
                        return Promise.resolve();
                    }

                    setData((prevData) => prevData + decoder.decode(value));
                    return reader.read().then(processText);
                });

            } catch (error: any) {
                setError(error.message);
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchData();
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
            abortController.abort();
        };
    }, [endpoint, headers, session]);

    return { data, isLoading, error, startStreaming };
};

export default useStreamedResponse;

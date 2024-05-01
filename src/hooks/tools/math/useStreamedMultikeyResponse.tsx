import { useClerk } from '@clerk/clerk-react';
import humps from 'humps';
import { useCallback, useEffect, useState } from 'react';
import fetchInterceptor from '../../../helpers/fetchInterceptor';

interface StreamedData {
    [key: string]: string;
}

interface StreamedBodyContentPayload {
    data: AIChatPayload
}

interface AIChatPayload {
    sourceMaterial: string;
    userInput: string;
}

const useStreamedMultikeyResponse = (endpoint: string, headers: any) => {
    const [data, setData] = useState<StreamedData>({});
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { session } = useClerk();

    const startStreaming = useCallback(async (bodyContent: StreamedBodyContentPayload) => {
        const abortController = new AbortController();
        const token = session ? await session.getToken() : 'none';

        const fetchData = async () => {
            setData({});
            try {
                setLoading(true);
                const response = await fetchInterceptor(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : '',
                        ...headers
                    },
                    body: JSON.stringify(humps.decamelizeKeys(bodyContent.data)),
                    signal: abortController.signal,
                });

                const reader = response?.body?.getReader();
                const decoder = new TextDecoder('utf-8');

                reader?.read().then(function processText({ done, value }): Promise<void> {
                    if (done) {
                        setLoading(false);
                        return Promise.resolve();
                    }

                    // Decode the stream chunk to a string
                    const chunk = decoder.decode(value, { stream: true });

                    // Helper function to process a JSON chunk
                    const processJsonChunk = (jsonString: string) => {
                        try {
                            const jsonChunk: Record<string, string> = JSON.parse(jsonString);
                            setData(prevData => {
                                const newData = { ...prevData };
                                for (const [key, chunkValue] of Object.entries(jsonChunk)) {
                                    // If the key already exists, append the new value, otherwise just set it
                                    newData[key] = newData[key] ? newData[key] + chunkValue : chunkValue;
                                }
                                return newData;
                            });
                        } catch (e) {
                            console.error("Error parsing JSON chunk:", e, "jsonString: ", jsonString);
                        }
                    };

                    // This regular expression matches the closing } of JSON objects
                    const jsonSplitRegex = /(?<=})(?=\{)/g;
                    // Split the chunk using the regex and process each JSON string
                    const jsonStrings = chunk.split(jsonSplitRegex);
                    jsonStrings.forEach(jsonStr => processJsonChunk(jsonStr));

                    return reader.read().then(processText);
                });


            } catch (error: any) {
                setError(error.message);
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchData();
        }, 500);

        return () => {
            clearTimeout(timeoutId);
            abortController.abort();
        };
    }, [endpoint, headers, session]);

    return { data, isLoading, error, startStreaming };
};

export default useStreamedMultikeyResponse;

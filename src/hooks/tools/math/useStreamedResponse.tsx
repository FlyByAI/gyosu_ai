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

                if (!session) {
                    // If no session, retry after a short delay
                    setTimeout(fetchData, 1000);
                    return;
                }

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
                let buffer = ''; // Buffer to accumulate chunks
        
                reader?.read().then(function processText({ done, value }): Promise<void> {
                    if (done) {
                        setLoading(false);
                        return Promise.resolve();
                    }
        
                    buffer += decoder.decode(value, { stream: true });
        
                    // Process buffer to extract JSON objects
                    try {
                        while (buffer) {
                            // Find the end of the JSON object
                            let endOfJson = buffer.indexOf('}\n');
                            if (endOfJson === -1) {
                                // If no complete JSON object is found, wait for more data
                                break;
                            }
                            endOfJson += 1; // Adjust to include the closing brace
        
                            // Extract and parse the JSON object
                            const jsonString = buffer.substring(0, endOfJson);
                            const json = JSON.parse(jsonString);
        
                            // Handle the JSON object (update state, etc.)
                            setData((prevData) => prevData + JSON.stringify(json) + '\n');
        
                            // Remove the processed JSON object from the buffer
                            buffer = buffer.substring(endOfJson).trim();
                        }
                    } catch (e) {
                        // If parsing fails, wait for more data
                        console.error('Error parsing JSON:', e);
                    }
        
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

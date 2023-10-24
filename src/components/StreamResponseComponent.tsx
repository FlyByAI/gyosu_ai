import React, { useEffect, useState } from 'react';
import useEnvironment from '../hooks/useEnvironment';

function StreamedResponseComponent() {

    const [data, setData] = useState('');
    const { apiUrl } = useEnvironment();
    const streamPlaygroundEndpoint = `${apiUrl}/math_app/playground/stream_example/`;

    useEffect(() => {
        const abortController = new AbortController();
        const fetchData = async () => {
            try {
                const response = await fetch(streamPlaygroundEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // include other headers such as CSRF tokens if necessary
                    },
                    body: JSON.stringify({ /* your POST data here */ }),
                    signal: abortController.signal, // passing the signal to the fetch call
                });

                const reader = response?.body?.getReader();
                const decoder = new TextDecoder('utf-8');

                setData("");

                reader?.read().then(function processText({ done, value }) {
                    if (done) {
                        return;
                    }

                    console.log(decoder.decode(value))

                    // Decode the text and append it to the state
                    setData((prevData) => prevData + decoder.decode(value));

                    // Read and process the next chunk
                    return reader.read().then(processText);
                });
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    console.error('An unexpected error occurred:', error);
                }
            }
        };

        fetchData();

        // Cleanup function to cancel the fetch operation if the component is unmounted
        return () => {
            abortController.abort();
        };
    }, []); // Empty dependency array ensures the effect runs once when the component mounts

    return (
        <div className='text-white flex justify-center'>
            <p>Streamed Data: {data}</p>
        </div>
    );
}

export default StreamedResponseComponent;

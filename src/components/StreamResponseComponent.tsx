import React, { useCallback } from 'react';
import useStreamedResponse from '../hooks/tools/math/useStreamedResponse';

interface StreamedResponseProps {
    endpoint: string;
    initialBodyContent?: any;
    headers?: any;
    onSubmit?: (startStreaming: (bodyContent: any) => void) => void;
}

function StreamedResponseComponent({
    endpoint,
    initialBodyContent = {},
    headers = {},
    onSubmit
}: StreamedResponseProps) {
    const { data, isLoading, error, startStreaming } = useStreamedResponse(endpoint, headers);

    const handleSubmit = useCallback(() => {
        if (onSubmit) {
            onSubmit(startStreaming);
        } else {
            startStreaming(initialBodyContent);
        }
    }, [startStreaming, onSubmit, initialBodyContent]);

    return (
        <div className='flex flex-col  justify-center'>
            <button onClick={handleSubmit}>Submit</button>
            <div>
                {isLoading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                {data && <p>Streamed Data: {data}</p>}
            </div>
        </div>
    );
}

export default StreamedResponseComponent;

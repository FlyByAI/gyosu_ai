import React, { useCallback } from 'react';
import useStreamedResponse from '../hooks/tools/math/useStreamedResponse';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

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
        <div className='flex flex-col justify-center'>
            <button onClick={handleSubmit}>Submit</button>
            <div>
                {isLoading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                {data && <p>Streamed Data: {
                    <ReactMarkdown
                        className="text-sm z-10 p-1 m-1 border-2 border-transparent border-dashed hover:border-yellow-500"
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                    >
                        {`${data}`}
                    </ReactMarkdown>
                }</p>}
            </div>
        </div>
    );
}

export default StreamedResponseComponent;

import React, { useCallback, useState, useEffect } from 'react';
import useStreamedMultikeyResponse from '../hooks/tools/math/useStreamedMultikeyResponse';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import CreateDocsFromMarkdownComponent from './CreateDocxFromMarkdownComponent';

interface StreamedResponseProps {
    endpoint: string;
    initialBodyContent?: any;
    headers?: any;
    onSubmit?: (startStreaming: (bodyContent: any) => void) => void;
}

interface StreamedData {
    [key: string]: string;
}

const StreamedResponseMultikeyComponent: React.FC<StreamedResponseProps> = ({
    endpoint,
    initialBodyContent = {},
    headers = {},
    onSubmit
}) => {
    const { data, isLoading, error, startStreaming } = useStreamedMultikeyResponse(endpoint, headers);

    const handleSubmit = useCallback(() => {
        if (onSubmit) {
            onSubmit(startStreaming);
        } else {
            startStreaming(initialBodyContent);
        }
    }, [startStreaming, onSubmit, initialBodyContent]);

    return (
        <div className='flex flex-col justify-center'>
            <button
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                onClick={handleSubmit}>Submit</button>
            <div>
                {isLoading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                {data && Object.entries(data).map(([key, value]) => (
                    <div key={key}>
                        <h3 className="font-bold">{key.replace(/_/g, ' ').toUpperCase()}</h3>
                        <ReactMarkdown
                            className="text-sm z-10 p-1 m-1 border-2 border-transparent border-dashed hover:border-yellow-500"
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                        >
                            {value}
                        </ReactMarkdown>
                        <CreateDocsFromMarkdownComponent markdown={value} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StreamedResponseMultikeyComponent;

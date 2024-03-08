import { useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import useStreamedResponse from '../hooks/tools/math/useStreamedResponse';

interface StreamedResponseProps {
    endpoint: string;
    initialBodyContent?: any;
    headers?: any;
    onSubmit?: (startStreaming: (bodyContent: any) => void) => void;
    buttonLabel?: string;
}

function StreamedResponseComponent({
    endpoint,
    initialBodyContent = {},
    headers = {},
    onSubmit,
    buttonLabel = 'Submit',
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
        <div className='flex flex-col justify-center text-gray-300'>
            <div>
                {isLoading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                {data && <>
                    <p>
                        <ReactMarkdown
                            className="text-sm z-10 p-1 m-1 border-2 border-transparent border-dashed"
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                        >
                            {`${data}`}
                        </ReactMarkdown>
                    </p>
                </>
                }
            </div>
            <button
                className="w-full bg-blue-500 hover:bg-blue-700 text-gray-300 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                onClick={handleSubmit}>{buttonLabel}</button>
        </div>
    );
}

export default StreamedResponseComponent;

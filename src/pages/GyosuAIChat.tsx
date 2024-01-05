import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useEnvironment from '../hooks/useEnvironment';
import { useClerk } from '@clerk/clerk-react';
import useStreamedResponse from '../hooks/tools/math/useStreamedResponse';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import CreateDocsFromMarkdownComponent from '../components/CreateDocxFromMarkdownComponent';

export interface IChatMessage {
    role: string;
    content: string;
}

const GyosuAIChat = () => {
    const [messages, setMessages] = useState<IChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [streamingIndex, setStreamingIndex] = useState<number | null>(null); // Track the index of the streaming message
    const { apiUrl } = useEnvironment();
    const streamedResponseEndpoint = `${apiUrl}/math_app/chat/`; // Update with actual endpoint

    const { sessionId = '' } = useParams();
    const { session, openSignIn } = useClerk();
    const endOfMessagesRef = useRef(null);

    // Streaming hook setup
    const { data: streamedData, isLoading, error, startStreaming } = useStreamedResponse(streamedResponseEndpoint, {});

    useEffect(() => {
        if (!session) {
            openSignIn();
        }
    }, [session, openSignIn]);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (streamedData && typeof streamingIndex === 'number') {
            // Update the streaming message with the new content
            setMessages(prev => prev.map((msg, idx) => idx === streamingIndex ? {...msg, content: streamedData} : msg));
        }
    }, [streamedData, streamingIndex]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
    };

    const handleChatSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newMessage: IChatMessage = { role: 'user', content: userInput };
        setMessages(prev => [...prev, newMessage]); // Add new user message to the chat
        
        // Add a placeholder for the streaming response
        const streamingPlaceholder: IChatMessage = { role: 'bot', content: 'Waiting for response...' };
        setMessages(prev => [...prev, streamingPlaceholder]);
        // Set the index for the new streaming message
        const newStreamingIndex = messages.length + 1; // +1 because we're adding two messages
        setStreamingIndex(newStreamingIndex);

        // Prepare payload with current and new messages
        const payload = {
            newMessage: {
                role: 'user',
                content: userInput,
            },
            messages: messages.concat(newMessage),
            sessionId: sessionId,
        };
        startStreaming(payload);  // Start streaming with the payload

        setUserInput(''); // Clear the input field after submission
    };

    return (
        <>
            <div className="h-60vh overflow-y-scroll p-2 border border-gray-300">
                {messages.map((message, index) => (
                    <div key={index} className={`p-2 my-1 border border-gray-200 rounded max-w-80% ${message.role === 'user' ? 'ml-auto bg-blue-100' : 'mr-auto bg-gray-100'}`}>
                        <strong>{message.role == "bot" ? "gyosu bot" : message.role}</strong>
                        {message.role === 'bot' ? (
                            <ReactMarkdown
                                className="text-md z-10 p-1 m-1 border-2 border-transparent border-dashed"
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                            >
                                {message.content}
                            </ReactMarkdown>

                        ) : 
                        <p>{message.content}</p>
                        }
                    </div>
                ))}
                <div ref={endOfMessagesRef} />
            </div>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <form onSubmit={handleChatSubmit} className="flex mt-2">
                <input
                    type="text"
                    name="input"
                    placeholder="Type your message..."
                    value={userInput}
                    onChange={handleInputChange}
                    className="flex-grow p-2 mr-2 rounded border border-gray-300"
                />
                <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white">
                    Send
                </button>
            </form>
            {streamedData && (
                <div>
                    <CreateDocsFromMarkdownComponent markdown={streamedData} />
                </div>
            )}
        </>
    );
};

export default GyosuAIChat;

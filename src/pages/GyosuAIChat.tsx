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

    const [sessionIdState, setSessionIdState] = useState(sessionId || '');  // State to store the session ID
    const [jsonBuffer, setJsonBuffer] = useState(''); // Buffer to accumulate incoming JSON data


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
        let updatedBuffer = jsonBuffer + streamedData;

        try {
            let endOfJson = updatedBuffer.indexOf('}\n');
            while (endOfJson !== -1) {
                const jsonString = updatedBuffer.substring(0, endOfJson + 1).trim();
                updatedBuffer = updatedBuffer.substring(endOfJson + 2);

                const data = JSON.parse(jsonString.replace("null", ""));
                if (data.session_id) {
                    setSessionIdState(data.session_id);
                } else if (data.message) {
                    setMessages(prev => {
                        // Replace the placeholder if the index matches
                        if (typeof streamingIndex === 'number' && prev[streamingIndex]) {
                            const newMessages = [...prev];
                            newMessages[streamingIndex] = { role: 'assistant', content: data.message };
                            return newMessages;
                        }
                        return [...prev, { role: 'assistant', content: data.message }];
                    });
                }
                endOfJson = updatedBuffer.indexOf('}\n');
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
        setJsonBuffer(updatedBuffer);
    }, [streamedData, streamingIndex]);
    

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUserInput(event.target.value); // Update the text in the textarea
    };

    const handleChatSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newMessage: IChatMessage = { role: 'user', content: userInput };
        setMessages(prev => [...prev, newMessage]);

        const newStreamingIndex = messages.length + 1; // Index of the next message
        setStreamingIndex(newStreamingIndex);

        const streamingPlaceholder: IChatMessage = { role: 'assistant', content: 'Waiting for response...' };
        setMessages(prev => [...prev, streamingPlaceholder]);

        // Prepare payload with current and new messages
        const payload = {
            newMessage: {
                role: 'user',
                content: userInput,
            },
            messages: messages.concat(newMessage),
            sessionId: sessionIdState,
        };
        startStreaming(payload);  // Start streaming with the payload

        setUserInput(''); // Clear the input field after submission
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Check if Enter is pressed without the Shift key
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent the default action (new line)
            handleChatSubmit(event as unknown as React.FormEvent<HTMLFormElement>); // Submit the form
        }
        // Otherwise, allow the default behavior (Shift + Enter for a new line)
    };

    return (
        <>
            <div className="h-60vh overflow-y-scroll p-2 border border-gray-300">
                {messages.map((message, index) => (
                    <div key={index} className={`p-2 my-1 border border-gray-200 rounded max-w-80% ${message.role === 'user' ? 'ml-auto bg-blue-100' : 'mr-auto bg-gray-100'}`}>
                        <strong>{message.role}</strong>
                        {message.role === 'assistant' ? (
                            message.content.split(/\n\s*\n/).map((chunk, idx) => (
                                <React.Fragment key={idx}>
                                    <ReactMarkdown
                                        className="text-md z-10 p-1 m-1 border-2 border-transparent border-dashed"
                                        remarkPlugins={[remarkMath]}
                                        rehypePlugins={[
                                            [rehypeKatex, {
                                                // Define custom delimiters for inline and block math
                                                delimiters: [
                                                    { left: "\\(", right: "\\)", display: false },
                                                    { left: "\\[", right: "\\]", display: true },
                                                ],
                                            }],
                                        ]}
                                    >
                                        {chunk.trim()}
                                    </ReactMarkdown>
                                    {idx < message.content.split(/\n\s*\n/).length - 1 && <br />}
                                </React.Fragment>
                            ))
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
                <textarea
                    name="input"
                    placeholder="Type your message..."
                    value={userInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    className="flex-grow p-2 mr-2 rounded border border-gray-300"
                    rows={3}
                />
                <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white">
                    Send
                </button>
            </form>
        </>
    );

};

export default GyosuAIChat;

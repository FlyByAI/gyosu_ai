import { useClerk } from '@clerk/clerk-react';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast/headless';
import ReactMarkdown from 'react-markdown';
import { useLocation, useParams } from 'react-router-dom';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import ChatSessionSidebar from '../components/ChatSessionSidebar';
import useGetChatSessions from '../hooks/tools/math/useGetChatSessions';
import useStreamedResponse from '../hooks/tools/math/useStreamedResponse';
import useEnvironment from '../hooks/useEnvironment';

export interface IChatMessage {
    role: string;
    content: string;
}

const GyosuAIChat = () => {
    const [messages, setMessages] = useState<IChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [streamingIndex, setStreamingIndex] = useState<number | null>(null);
    const { apiUrl } = useEnvironment();
    const streamedResponseEndpoint = `${apiUrl}/math_app/chat/`;
    const { user } = useClerk();
    const username = user?.firstName ? user.firstName : "User";

    const { sessionId = '' } = useParams();
    const { session, openSignIn } = useClerk();
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    const [sessionIdState, setSessionIdState] = useState(sessionId || '');
    const [jsonBuffer, setJsonBuffer] = useState('');

    const { state } = useLocation();

    const { data: streamedData, isLoading, error, startStreaming } = useStreamedResponse(streamedResponseEndpoint, {});

    const { chatSessions } = useGetChatSessions(`${apiUrl}/math_app/chat/list/`);

    useEffect(() => {
        if (sessionId && chatSessions) {
            chatSessions.forEach((chatSession) => {
                if (chatSession.sessionId === sessionId) {
                    setMessages(chatSession.messageHistory);
                }
            })
        }
        if (!sessionId) {
            setSessionIdState(sessionId)
            setMessages([])
        }
    }, [chatSessions, sessionId]);


    useEffect(() => {
        if (state?.text) {
            setUserInput(state.text);
        }

    }, [state]);

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
                console.log(data)
                if (data.session_id) {
                    setSessionIdState(data.session_id);
                }
                else if (data.message) {
                    setMessages(prev => {

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
        setUserInput(event.target.value);
    };

    useEffect(() => {
        if (error) {
            toast(error, { id: 'error-toast' }); // Show toast notification on error
        }
    }, [error]);

    const handleChatSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isLoading) return;

        const newMessage: IChatMessage = { role: 'user', content: userInput };
        setMessages(prev => [...prev, newMessage]);

        const newStreamingIndex = messages.length + 1;
        setStreamingIndex(newStreamingIndex);

        const streamingPlaceholder: IChatMessage = { role: 'assistant', content: 'Waiting for response...' };
        setMessages(prev => [...prev, streamingPlaceholder]);


        const payload = {
            newMessage: {
                role: 'user',
                content: userInput,
            },
            messages: messages.concat(newMessage),
            sessionId: sessionIdState,
        };
        startStreaming(payload);

        setUserInput('');
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {

        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleChatSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
        }

    };

    return (
        <>
            <div className="flex flex-row">
                <div className="w-1/12 h-75vh hidden md:block">
                    <ChatSessionSidebar />
                </div>
                <div className="flex-grow mx-auto">
                    <div className="h-60vh overflow-y-scroll p-2 border border-gray-300 mx-2">
                        {messages.map((message, index) => (
                            <div key={index} className={`p-2 my-1 border border-gray-200 rounded max-w-80% ${message.role === 'user' ? 'ml-auto bg-blue-100' : 'mr-auto bg-gray-100'}`}>
                                <strong>{message.role == "user" ? username : message.role}</strong>
                                {message.role === 'assistant' ? (
                                    message.content.split(/\n\s*\n/).map((chunk, idx) => (
                                        <React.Fragment key={idx}>
                                            <ReactMarkdown
                                                className="text-md z-10 p-1 m-1 border-2 border-transparent border-dashed"
                                                remarkPlugins={[remarkMath]}
                                                rehypePlugins={[
                                                    [rehypeKatex, {

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
                            placeholder={isLoading ? "Loading..." : "Type your message..."}
                            value={userInput}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyPress}
                            className="flex-grow p-2 mx-2 rounded border border-gray-300"
                            rows={3}
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 mr-2 rounded bg-blue-500 text-white disabled:bg-gray-300"
                            disabled={isLoading}
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>


        </>
    );

};

export default GyosuAIChat;

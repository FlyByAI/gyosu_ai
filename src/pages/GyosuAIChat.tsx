import { useClerk } from '@clerk/clerk-react';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast/headless';
import ReactMarkdown from 'react-markdown';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Tooltip as ReactTooltip } from "react-tooltip";
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import ChatActions from '../components/ChatActions';
import ChatSessionSidebar from '../components/ChatSessionSidebar';
import MessageSuggestions from '../components/MessageSuggestions';
import { useScreenSize } from '../contexts/ScreenSizeContext';
import useChatSessions from '../hooks/tools/math/useChatSessions';
import useStreamedResponse from '../hooks/tools/math/useStreamedResponse';
import useEnvironment from '../hooks/useEnvironment';
import { useRequireSignIn } from '../hooks/useRequireSignIn';
import ShareIcon from '../svg/Share';

export interface IChatMessage {
    role: string;
    content: string;
}

const GyosuAIChat = () => {
    const [messages, setMessages] = useState<IChatMessage[]>([]);
    const [tokens, setTokens] = useState('');

    const [actions, setActions] = useState("");
    const [timeElapsed, setTimeElapsed] = useState(0);
    const actionTimerRef = useRef(null);

    const [userInput, setUserInput] = useState('');
    const { apiUrl } = useEnvironment();
    const chatEndpoint = `${apiUrl}/math_app/chat/`;
    const { user } = useClerk();
    const username = user?.firstName ? user.firstName : "User";
    const navigate = useNavigate();

    const { sessionId } = useParams();
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    const [jsonBuffer, setJsonBuffer] = useState('');

    const { state } = useLocation();

    const { data: streamedData, isLoading, error, startStreaming } = useStreamedResponse(chatEndpoint, {});

    const { chatSessions, shareChatSession, isLoading: isLoadingChatSessions, error: errorChatSessions, isLoadingSession, sessionError } = useChatSessions(chatEndpoint, sessionId);

    const { isDesktop } = useScreenSize();

    const handleShareClick = (sessionId: string) => {
        shareChatSession(sessionId)
    };

    const handleSuggestionClick = (suggestionText: string) => {
        handleSubmitWithText(suggestionText);
    };


    useEffect(() => {
        if (sessionId && chatSessions) {
            chatSessions.forEach((chatSession) => {
            if (chatSession.sessionId === sessionId) {
                setMessages(chatSession.messageHistory);
                }
            })
        }
        if (!sessionId) {
            setMessages([])
        }
        if(sessionError) {
            toast(sessionError.message, { id: 'error-toast' });
            navigate(`/math-app/chat/`, { replace: true, state: { ...state, sessionId: undefined } });
            setMessages([])
        }
    }, [chatSessions, navigate, sessionError, sessionId, state]);
        
    const handleSubmitWithText = (text: string) => {
        if (isLoading) return;

        const newMessage: IChatMessage = { role: 'user', content: text };


        const payload = {
            newMessage: newMessage,
            messages: messages.concat(newMessage),
            sessionId: sessionId,
        };

        setMessages(prevMessages => [...prevMessages, newMessage]);

        startStreaming(payload);
    };

    useEffect(() => {
        if (state?.text && messages.length === 0) {
            handleSubmitWithText(state.text);
        }
    }, [messages]); // eslint-disable-line react-hooks/exhaustive-deps


    useRequireSignIn();


    useEffect(() => {
        if (!isLoading) {
            setActions("")
            setTimeElapsed(0);
        }
    }, [isLoading, messages, actions]);

    useEffect(() => {
        if (actions) {
            // Reset time elapsed and start timer when actions change
            setTimeElapsed(0);
            if (actionTimerRef.current) {
                clearInterval(actionTimerRef.current); // Clear existing timer if any
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            actionTimerRef.current = setInterval(() => {
                setTimeElapsed((prevTimeElapsed) => prevTimeElapsed + 1);
            }, 1000);
        } else {
            // Clear timer and reset time elapsed when actions are unset
            if (actionTimerRef.current) {
                clearInterval(actionTimerRef.current);
            }
            setTimeElapsed(0);
        }

        // Cleanup on component unmount or actions change
        return () => {
            if (actionTimerRef.current) {
                clearInterval(actionTimerRef.current);
            }
        };
    }, [actions]);

    useEffect(() => {
        let updatedBuffer = jsonBuffer + streamedData;

        try {
            let endOfJson = updatedBuffer.indexOf('\n');
            while (endOfJson !== -1) {
                const jsonString = updatedBuffer.substring(0, endOfJson).trim();
                updatedBuffer = updatedBuffer.substring(endOfJson + 1);

                const data = JSON.parse(jsonString);
                if (data.actions && !data.message) {
                    setActions(data.actions);
                    console.log('setting action');
                }
                if (data.session_id) {
                    navigate(`/math-app/chat/${data.session_id}`, { replace: true, state: { ...state, sessionId: data.session_id } });
                    console.log('setting session_id');
                }
                if (data.token) {
                    setTokens(prevTokens => prevTokens + data.token);
                }
                if (data.message) {
                    if (data.message !== messages[messages.length - 1]?.content)
                        setMessages(messages => [...messages, { role: "assistant", content: data.message }]);
                    setTokens('');
                }

                endOfJson = updatedBuffer.indexOf('\n');
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
        setJsonBuffer(updatedBuffer);
    }, [streamedData]);


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


        const payload = {
            newMessage: newMessage,
            messages: messages.concat(newMessage),
            sessionId: sessionId,
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

    const getRole = (messageRole: string) => {
        switch (messageRole) {
            case 'user':
                return username;
            case 'assistant':
                return 'Gyosu';
            default:
                return messageRole;
        }
    }

    useEffect(() => {
        if (endOfMessagesRef.current) {
            const scrollHeight = endOfMessagesRef.current.scrollHeight;
            // Using smooth scroll behavior
            endOfMessagesRef.current.scrollTo({
                top: scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [actions, tokens]);

    useEffect(() => {
        // Check if the endOfMessagesRef current property is not null
        if (endOfMessagesRef.current) {
            // Scroll the element into view
            const scrollHeight = endOfMessagesRef.current.scrollHeight;
            endOfMessagesRef.current.scrollTop = scrollHeight;
        }
    }, [messages, isLoading]);

    useEffect(() => {
        // Add the class to the body when the component mounts
        document.body.classList.add('main-container');

        // Remove the class when the component unmounts
        return () => {
            document.body.classList.remove('main-container');
        };
    }, []);


    return (
        <div className='main-container flex-col flex'>
            <div className="flex flex-row">
                <div className="w-1/6 hidden md:block">
                    <ChatSessionSidebar />
                </div>
                <div className="flex-grow mx-auto relative">
                    <div className={`${messages.length === 0 && "flex flex-col"} h-70vh overflow-y-auto p-2 border border-gray-300 mx-2 text-gray-100 scroll-smooth`}
                        ref={endOfMessagesRef}>

                        {sessionId && <div className='absolute top-0 right-4 p-4'>
                            <button onClick={() => handleShareClick(sessionId || "")}
                                disabled={!sessionId}
                                className="bg-gray-900 rounded flex flex-row p-2"
                                data-tooltip-id={`shareChatSession`}
                            >
                                <ShareIcon width="32" height='32' />
                                {isDesktop && <ReactTooltip
                                    id='shareChatSession'
                                    place="left"
                                    variant="light"
                                    content={"Share this chat session with a friend!"}
                                />}
                            </button>
                        </div>}

                        {messages.map((message, index) => (
                            <div key={index} className={`p-2 my-1 border border-transparent rounded max-w-80% ${message.role === 'user' ? 'ml-auto bg-transparent' : 'mr-auto bg-transparent'}`}>
                                <strong>{message.role === "user" ? username : getRole(message.role)}</strong>
                                {message.role === 'assistant' ? (
                                    message.content === "Waiting for response..." && actions.length > 0 ? null : // If true, render nothing
                                        message.content.split(/\n\s*\n/).map((chunk, idx) => (
                                            <div key={idx} className="flex flex-row items-center">
                                                <ReactMarkdown
                                                    className="text-md z-10 p-1 m-1 border-2 border-transparent border-dashed markdown"
                                                    remarkPlugins={[remarkMath]}
                                                    rehypePlugins={[
                                                        [rehypeKatex],
                                                    ]}
                                                >
                                                    {chunk.trim()}
                                                </ReactMarkdown>
                                                {idx < message.content.split(/\n\s*\n/).length - 1 && <br />}
                                            </div>
                                        ))
                                ) :
                                    <>
                                        <p>{message.content}</p>
                                    </>
                                }
                            </div>
                        ))}
                        {tokens && (
                            <div className={`p-2 my-1 border border-transparent rounded max-w-80% mr-auto bg-transparent`}>
                                <strong>Gyosu</strong>
                                <div className="flex flex-row items-center">
                                    <ReactMarkdown
                                        className="text-md z-10 p-1 m-1 border-2 border-transparent border-dashed markdown"
                                        remarkPlugins={[remarkMath]}
                                        rehypePlugins={[
                                            [rehypeKatex],
                                        ]}
                                    >
                                        {tokens}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}
                        {user && !isLoading && messages.length === 0 && (
                            <div className="mt-auto pb-4">
                                <MessageSuggestions
                                    onClick={handleSuggestionClick}
                                />
                            </div>
                        )}
                        {actions && (
                            <div className="text-center text-sm p-1">
                                Time elapsed on current action: {timeElapsed} seconds
                            </div>
                        )}
                        <ChatActions actions={actions} />
                        {
                            isLoading && !tokens && !actions && <div>
                                <p className="">Waiting for response...</p>
                            </div>
                        }
                    </div>
                    <div className='h-1vh'></div>

                    <form onSubmit={handleChatSubmit} className="flex h-14vh">
                        <textarea
                            name="input"
                            placeholder={isLoading ? "Loading..." : "Ask for what you need here..."}
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
                    {error && <p>Error: {error}</p>}
                </div>
            </div >

            <div className='md:block text-white text-sm self-center text-center'>Note: This feature is in beta, if you are having issues please email us at <a href="mailto:support@gyosu.ai" className="text-blue-300 underline">support@gyosu.ai</a></div>
        </div>
    );

};

export default GyosuAIChat;

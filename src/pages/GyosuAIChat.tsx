import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import useEnvironment from '../hooks/useEnvironment';
import useChat from '../hooks/useChat';
import { useClerk } from '@clerk/clerk-react';
import StreamedResponseComponent from '../components/StreamResponseComponent';

export interface IChatMessage {
    role: string;
    content: string;
}

interface RouteParams {
    sessionId?: string;
}

const GyosuAIChat = () => {
    const [messages, setMessages] = useState<IChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [showStreamedResponse, setShowStreamedResponse] = useState(false);
    const { apiUrl } = useEnvironment();
    const endpoint = `${apiUrl}/math_app/chat/`;

    const { sessionId = '' } = useParams();
    const { sendMessage, chatData } = useChat(endpoint, sessionId);
    const { session, openSignIn } = useClerk();
    const endOfMessagesRef = useRef(null);


    useEffect(() => {
        if (!session) {
            openSignIn();
        }
    }, [session, openSignIn]);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {

        if (chatData?.messages) {
            setMessages(chatData.messages);
        }
    }, [chatData]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
    };

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newMessage: IChatMessage = { role: 'user', content: userInput };

        if (userInput.trim() === "special command or condition") {
            setShowStreamedResponse(true);
        } else {
            setShowStreamedResponse(false);
            sendMessage(newMessage, messages);
            setMessages([...messages, newMessage]);
        }

        setUserInput('');
    }, [userInput, messages, sendMessage]);

    const handleStreamSubmit = (startStreaming: (bodyContent: any) => void) => {
        const newMessage: IChatMessage = { role: 'user', content: userInput };
        const bodyContent = { newMessage, messages };
        startStreaming(bodyContent);
    };

    return (
        <>
            <div className="h-60vh overflow-y-scroll p-2 border border-gray-300">
                {messages.map((message, index) => (
                    <div key={index} className={`p-2 my-1 border border-gray-200 rounded max-w-80% ${message.role === 'user' ? 'ml-auto bg-blue-100' : 'mr-auto bg-gray-100'}`}>
                        <strong>{message.role}</strong>
                        <p>{message.content}</p>
                    </div>
                ))}
                <div ref={endOfMessagesRef} />
                
            </div>
            <StreamedResponseComponent
                    endpoint={endpoint}
                    onSubmit={handleStreamSubmit}
                />
            <input
                type="text"
                name="input"
                placeholder="Type your message..."
                value={userInput}
                onChange={handleInputChange}
                className="flex-grow p-2 mr-2 rounded border border-gray-300"
            />
                
        </>
    );
};

export default GyosuAIChat;

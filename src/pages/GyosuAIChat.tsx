import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useEnvironment from '../hooks/useEnvironment';
import useChat from '../hooks/useChat';

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
    const { apiUrl } = useEnvironment();
    const { sessionId = '' } = useParams();
    const { sendMessage, chatData } = useChat(`${apiUrl}/math_app/chat/`, sessionId);
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        // Scroll to the latest message
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        // Update messages state when chatData changes
        if (chatData?.messages) {
            setMessages(chatData.messages);
        }
    }, [chatData]); // Depend on chatData

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newMessage: IChatMessage = { role: 'user', content: userInput };
        sendMessage(newMessage, messages); // Send message via the hook
        setMessages([...messages, newMessage]); // Optimistically update the UI
        setUserInput('');
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
            <form onSubmit={handleSubmit} className="flex mt-2">
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
        </>
    );
};

export default GyosuAIChat;

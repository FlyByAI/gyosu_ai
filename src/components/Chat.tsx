import React, { useState } from 'react';
import { Message } from '../interfaces';
import useChat from '../hooks/useChat';
import Plot from 'react-plotly.js';

interface ChatProps {
    sessionId: string;
}

const Chat: React.FC<ChatProps> = ({ sessionId }) => {
    const { chatData, isLoading, error, sendMessage } = useChat(`/chat/${sessionId}`, sessionId);
    const [inputMessage, setInputMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inputMessage.trim() !== '') {
            await sendMessage({ text: inputMessage });
            setInputMessage('');
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="mt-4 p-4 bg-white dark:bg-gray-900 shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-2 dark:text-white">Chat:</h2>

            {chatData && chatData.messages.map((message: Message, i: number) => (
                <div key={i} className="p-2 bg-gray-100 dark:bg-gray-800 rounded mb-2">
                    <p className="text-gray-700 dark:text-gray-300">{message.text}</p>
                    {message.plotlyData &&
                        <Plot
                            data={message.plotlyData.data}
                            layout={message.plotlyData.layout}
                        />
                    }
                </div>
            ))}

            <form onSubmit={handleSubmit} className="mt-4">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="border-2 border-gray-300 rounded w-full p-2"
                    placeholder="Type a message"
                />
                <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded">Send</button>
            </form>
        </div>
    );
};

export default Chat;

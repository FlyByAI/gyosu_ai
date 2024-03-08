import React, { useEffect, useState } from 'react';

interface Props {
    messages: string[];
    label?: string;
}

const ChatHistory: React.FC<Props> = ({ messages, label }) => {
    const [isExpanded, setExpanded] = useState(false);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setExpanded(false);
            }
        };

        window.addEventListener('keydown', handleEscape);

        return () => window.removeEventListener('keydown', handleEscape);
    }, []);

    return (
        <div className="w-full border bg-gray-800 text-gray-300">
            <div
                onClick={() => setExpanded(!isExpanded)}
                className="cursor-pointer py-2 px-4 flex justify-between items-center"
            >
                <span>{label || "Chat History"}</span>
                <span>{isExpanded ? '▲' : '▼'}</span>
            </div>
            {isExpanded && (
                <div className="overflow-auto max-h-[300px] space-y-2 px-4">
                    {messages.map((message, index) => (
                        <div key={index}>
                            {message}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChatHistory;

import React, { useState, useEffect, useRef } from 'react';
import ChatBox from './math/ChatBox';
import { notSecretConstants } from '../constants/notSecretConstants';
import useSubmitTextWithMarkdown from '../hooks/tools/math/useSubmitTextWithChunk';
import useSubmitTextWithChunk from '../hooks/tools/math/useSubmitTextWithChunk';
import useEnvironment from '../hooks/useEnvironment';

interface AIChatProps {
    markdown?: string;
    onChatChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    additionalInfo?: string;
    problems?: string[];
}

const AIChat: React.FC<AIChatProps> = ({ markdown, additionalInfo }) => {
    const [focus, setFocus] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const [chat, setChat] = useState("");
    const { apiUrl } = useEnvironment();
    const { isLoading, error } = useSubmitTextWithChunk(`${apiUrl}/ai_chat/`);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                setFocus(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [formRef]);

    const handleChatChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setChat(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (typeof chat === 'string' && markdown) {
            // await submitTextWithChunk(chat, chunk, problemType);
        }
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} style={{
            position: "fixed",
            bottom: 0,
            width: focus ? "75%" : "50%",
            minHeight: "auto",
            maxHeight: "75%",
            transition: "width 0.5s ease, max-height 0.5s ease"
        }}>
            <div className="flex items-center bg-gray-300 dark:bg-gray-700 rounded-l p-2 mb-2 flex-col">
                <p className="font-bold text-white text-left whitespace-nowrap flex-shrink-0 me-2">AI Chat</p>
                {focus && additionalInfo && <p>{additionalInfo}</p>}
                {focus && <div className='pb-2'><p className='dark: text-white'>"Can you help me fix the formatting of my problems?"</p>
                    <p className='dark: text-white'>"Problems 2 and 4 are too difficult."</p>
                    <p className='dark: text-white'>"Please make problem 4 a word problem."</p>
                    <p className='dark: text-white'>"How do I edit a problem?"</p>
                </div>}

                <div className="flex items-center w-full">
                    <ChatBox
                        className="m-0 p-2 my-0 bg-gray-100 dark:bg-gray-800 rounded dark:text-white flex-grow"
                        handleChange={handleChatChange}
                        value={chat}
                        onFocusChange={setFocus}  // Pass setFocus as a prop
                    />
                    <button type="submit" className="ms-2 p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">Send</button>
                </div>

                {error as Error && <p className="text-red-600 mt-4 text-center">Error: {(error as Error).message}</p>}
                {isLoading && <p className="dark:text-white">Loading...</p>}

            </div>
        </form >
    );
};

export default AIChat;



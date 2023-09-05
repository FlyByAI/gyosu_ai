import { useEffect, useRef, useState } from "react";
import SendIcon from "../../svg/SendIcon";
import { notSecretConstants } from "../../constants/notSecretConstants";
import { Chunk, ProblemData } from "../../interfaces";
import { useLanguage } from "../../contexts/useLanguage";
import useSubmitTextWithChunk from "../../hooks/tools/math/useSubmitTextWithChunk";
import useEnvironment from "../../hooks/useEnvironment";

interface AIChatSmallWrapperProps {
    children: React.ReactNode;
    chunk: Chunk;
    index: number;
    className?: string;
    updateChunk: (updatedChunk: Chunk, chunkIndex: number) => void;
}

const AIChatSmallWrapper: React.FC<AIChatSmallWrapperProps> = ({ updateChunk, className, chunk, index, children }) => {

    const [smallChatText, setSmallChatText] = useState('');
    const formRef = useRef<HTMLFormElement>(null);
    const submitButtonRef = useRef<HTMLButtonElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);


    const { apiUrl } = useEnvironment();
    const { submitTextWithChunk, isLoading, error, data } = useSubmitTextWithChunk(`${apiUrl}/math_app/chat/problem/`);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        console.log("handleSubmit called for some reason?")
        event.preventDefault();
        if (typeof smallChatText === 'string' && chunk) {
            submitTextWithChunk({ userInput: smallChatText, chunk },
                {
                    onSuccess: (responseData) => {
                        // Extract the updated chunk and update it
                        const updatedChunk = responseData?.updatedChunk || chunk;
                        updateChunk && updateChunk(updatedChunk, index);
                    }
                }
            );
        }
    };

    const handleSmallChatChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSmallChatText(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            // submitButtonRef?.current?.click();
        }
    };

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
        }
    }, [smallChatText]);

    // Note, do not wrap the children with the form element, because it can cause the form to submit
    return (
        <div className="flex flex-col items-center justify-center bg-gray-900">
            {children}
            <form ref={formRef} onSubmit={handleSubmit} className="rounded-l flex flex-row w-full mt-2">
                <textarea
                    ref={textAreaRef}
                    id={`ai-chat-textbox-${index}`}
                    value={smallChatText}
                    onChange={handleSmallChatChange}
                    onKeyDown={handleKeyDown}
                    className={className + " px-2 resize-none bg-gray-100 dark:bg-gray-800 rounded dark:text-white form-textarea block w-full"}
                    placeholder="Change this problem with AI"
                />
                <button ref={submitButtonRef} type="submit" className="ms-2 p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex flex-col justify-center items-center">
                    <SendIcon className="h-3 w-3" />
                    <p className="text-xs">Send</p>
                </button>
            </form>

            {isLoading && <p className="dark:text-white">Loading...</p>}
        </div>

    )
};

export default AIChatSmallWrapper;

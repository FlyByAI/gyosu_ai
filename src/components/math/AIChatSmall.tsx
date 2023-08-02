import { useEffect, useRef, useState } from "react";
import SendIcon from "../../svg/SendIcon";
import useSubmitTextWithMarkdown from "../../hooks/tools/math/useSubmitTextWithMarkdown";
import { notSecretConstants } from "../../constants/notSecretConstants";
import ChatBox from "./ChatBox";

interface ResponseBoxProps {
    className: string;
    problemIndex: number;
    markdown: string;
    problemType: string;
}

const AIChatSmall: React.FC<ResponseBoxProps> = ({ className, problemIndex, markdown, problemType }) => {

    const [smallChatText, setSmallChatText] = useState('');
    const formRef = useRef<HTMLFormElement>(null);
    const submitButtonRef = useRef<HTMLButtonElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);  // Add this ref


    const { isLoading, submitTextWithMarkdown } = useSubmitTextWithMarkdown(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/chat/problem/`)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (typeof smallChatText === 'string' && markdown) {
            await submitTextWithMarkdown(smallChatText, markdown, problemType);
        }
    };

    const handleSmallChatChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSmallChatText(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            // Here we call the submit function when the user hits 'Enter'
            submitButtonRef?.current?.click();
            setSmallChatText("");
        }
    };

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
        }
    }, [smallChatText]);

    return (
        <form ref={formRef} onSubmit={handleSubmit}>
            <div className=" mt-2 rounded-l flex">
                <textarea
                    ref={textAreaRef}
                    id={`ai-chat-textbox-${problemIndex}`}
                    value={smallChatText}
                    onChange={handleSmallChatChange}
                    onKeyDown={handleKeyDown}
                    className={className + " px-2 resize-none bg-gray-100 dark:bg-gray-700 rounded dark:text-white form-textarea block w-full"}
                    placeholder="Change this problem with AI"
                />

                <button ref={submitButtonRef} type="submit" className="ms-2 p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex flex-col justify-center items-center">
                    <SendIcon className="h-3 w-3" />
                    <p className="text-xs">Send</p>
                </button>
            </div>
            {isLoading && <p className="dark:text-white">Loading...</p>}
        </form>
    )
};

export default AIChatSmall;

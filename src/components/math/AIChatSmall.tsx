import { useEffect, useRef, useState } from "react";
import SendIcon from "../../svg/SendIcon";
import { notSecretConstants } from "../../constants/notSecretConstants";
import { Chunk, ProblemData } from "../../interfaces";
import { useLanguage } from "../../contexts/useLanguage";
import ChangeProblemModal from "./ChangeProblemModal";
import useSubmitTextWithChunk from "../../hooks/tools/math/useSubmitTextWithChunk";

interface ResponseBoxProps {
    className: string;
    problemIndex: number;
    chunk: Chunk;
    updateProblem?: (index: number, newProblem: Chunk) => void
    problemData: ProblemData;
}

const AIChatSmall: React.FC<ResponseBoxProps> = ({ className, problemIndex, chunk, updateProblem, problemData }) => {

    const [smallChatText, setSmallChatText] = useState('');
    const formRef = useRef<HTMLFormElement>(null);
    const submitButtonRef = useRef<HTMLButtonElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);  // Add this ref
    const [isModalOpen, setModalOpen] = useState(false);
    const [newProblem, setNewProblem] = useState<Chunk>();

    const { language } = useLanguage();

    const options = { language: language, topic: "none" };

    const handleCloseModal = () => {
        setModalOpen(false);
        // setSmallChatText('');
    };

    const { error, isLoading, submitTextWithChunk, data } = useSubmitTextWithChunk(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/chat/problem/`)

    useEffect(() => {
        if (data) {
            setNewProblem(data.problem);
        }
    }, [data]);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (typeof smallChatText === 'string' && chunk) {
            setModalOpen(true);
            await submitTextWithChunk(smallChatText, chunk, problemData, options);
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
            <div className=" m-2 rounded-l flex">
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
            {updateProblem && <ChangeProblemModal error={error} problemIndex={problemIndex} updateProblem={updateProblem} onClose={handleCloseModal} isOpen={isModalOpen} setNewProblem={setNewProblem} markdown={""} newProblem={""} />}
        </form>
    )
};

export default AIChatSmall;

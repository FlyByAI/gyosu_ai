import ReactMarkdown from "react-markdown";
import AIChatSmall from "./AIChatSmall";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useEffect, useRef } from "react";

interface ResponseBoxProps {
    value: string;
    handleChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className: string;
    edit?: boolean;
    showChat?: boolean;
    problemIndex: number;
    problemType: string;
    updateProblem?: (index: number, newProblem: string) => void
}

const ResponseBox: React.FC<ResponseBoxProps> = ({ value, handleChange, className, edit, problemIndex, problemType, updateProblem, showChat }) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
        }
    }, [value, edit]);

    return (
        <>
            {edit ? <textarea
                ref={textAreaRef}
                disabled={!edit}
                value={value}
                onChange={handleChange}
                className={className + "  resize-none form-textarea mt-1 block w-full"}
                rows={5}
                placeholder="Problems appear here"
            />
                :
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    className={className + " form-textarea mt-1 block w-full"}
                >
                    {value}
                </ReactMarkdown>}
            {showChat && <AIChatSmall className={""} problemIndex={problemIndex} markdown={value} problemType={problemType} updateProblem={updateProblem} />}
        </>)
};

export default ResponseBox;
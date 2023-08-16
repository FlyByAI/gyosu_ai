import { useEffect, useRef } from "react";
import { Chunk, ProblemData } from "../../interfaces";
import { ChunkComponent } from "../AST";
import AIChatSmall from "./AIChatSmall";

interface ResponseBoxProps {
    value: Chunk
    handleChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className: string;
    edit?: boolean;
    showChat?: boolean;
    problemIndex: number;
    updateProblem?: (index: number, newProblem: Chunk) => void
    data: ProblemData;
}

const ResponseBox: React.FC<ResponseBoxProps> = ({ value, handleChange, className, edit, problemIndex, updateProblem, showChat, data }) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
        }
    }, [value, edit]);

    console.log(value)

    return (
        <>
            {edit ? <textarea
                ref={textAreaRef}
                disabled={!edit}
                value={value.toString()}
                onChange={handleChange}
                className={className + "  resize-none form-textarea mt-1 block w-full"}
                rows={5}
                placeholder="Problems appear here"
            />
                :
                <ChunkComponent content={value} />}
            {showChat && <AIChatSmall className={""} problemIndex={problemIndex} markdown={value.toString()} problemData={data} updateProblem={updateProblem} />}
        </>)
};

export default ResponseBox;
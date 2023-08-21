import { useEffect, useRef } from "react";
import { Chunk, ProblemData } from "../../interfaces";
import { ChunkComponent } from "../AST";
import AIChatSmall from "./AIChatSmall";

interface ResponseBoxProps {
    chunk: Chunk
    handleChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className: string;
    edit?: boolean;
    showChat?: boolean;
    problemIndex: number;
    updateProblem?: (index: number, newProblem: Chunk) => void
    data: ProblemData;
}

const ResponseBox: React.FC<ResponseBoxProps> = ({ chunk, className, edit, problemIndex, updateProblem, showChat, data }) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
        }
    }, [chunk, edit]);

    return (<div className="p-2">
        <div className={className}>
            {chunk && <ChunkComponent chunk={chunk} />}
        </div>
        {showChat && <AIChatSmall className="p-1" problemIndex={problemIndex} chunk={chunk} problemData={data} updateProblem={updateProblem} />}
    </div>)

};

export default ResponseBox;
import ReactMarkdown from "react-markdown";
import AIChatSmall from "./AIChatSmall";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface ResponseBoxProps {
    value: string;
    handleChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className: string;
    edit?: boolean;
    problemIndex: number;
}

const ResponseBox: React.FC<ResponseBoxProps> = ({ value, handleChange, className, edit, problemIndex }) => {

    return (
        <>
            {edit ? <textarea
                disabled={!edit}
                defaultValue={value}
                onChange={handleChange}
                className={className + " form-textarea mt-1 block w-full"}
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
            {edit && <AIChatSmall className={""} problemIndex={problemIndex} markdown={value} />}
        </>)
};

export default ResponseBox;
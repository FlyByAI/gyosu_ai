import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { SubproblemsComponent } from '../components/ast/SubproblemsComponent';
import { Image, Instruction, Math, Problem, Subproblems, Table, Text } from '../interfaces';

import 'katex/dist/katex.min.css';

export const renderContent = (content: (Text | Math | Table | Image | Subproblems)[], debug = false) => {
    return content?.map((item, index) => {
        return <div key={index}>{renderItem(item, debug)}</div>
    });
}
export const renderItem = (item: Text | Math | Table | Image | Subproblems | Problem | Instruction, debug=false) => {
    switch (item.type) {
        case 'text':
            return (
                <div
                    className={`${debug && "tooltip"} text-xs md:text-lg z-10  border-2 border-transparent border-dashed hover:border-2 p-1 m-1 group-hover:border-2 group-hover:border-dashed`}
                    data-tip={debug ? "text" : undefined}
                >
                    {item.value}
                </div>
            );
        case 'math':
            return (
                <div
                    data-tip={debug ? "math" : undefined}
                    className='tooltip'
                >
                    <ReactMarkdown
                        className={`${debug && "tooltip"} text-xs md:text-lg z-10  border-gray-100 border-2 border-transparent border-dashed hover:border-2 p-1 m-1 group-hover:border-2 group-hover:border-dashed`}
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        
                    >

                        {String.raw`$${item.value}$`.replace("?", "\\text{?}").replace("\\[", "$$").replace("\\]", "$$").replace("\\(", "$").replace("\\)", "$")}
                    </ReactMarkdown>
                </div>
            );
        case 'table':
            return (
                <div
                    data-tip={debug ? "table" : undefined}
                    className={`${debug && "tooltip"} `}>
                    <ReactMarkdown
                        className={"text-xs md:text-lg z-10  border-gray-100 border-2 border-transparent border-dashed hover:border-2 p-1 m-1 group-hover:border-2 group-hover:border-dashed"}
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                    >
                        {String.raw`${item.value}`}
                    </ReactMarkdown>
                </div>
                    
            );
        case 'image':
            //todo: get better alt descriptions added to the image ASTs
            // console.log("image", item)
            return (
                <img
                    data-tip={debug ? "image" : undefined}
                    src={item.value}
                    alt="Description"
                    className={`${debug && "tooltip"} text-xs md:text-lg z-10 p-1 m-1 border-2 border-transparent border-dashed hover:border-2 group-hover:border-2 group-hover:border-dashed`}
                />
            );
        case 'subproblems':
            return <SubproblemsComponent subproblems={item} />;
        default:
            return null;
    }
}
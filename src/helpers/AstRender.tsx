import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { SubproblemsComponent } from '../components/ast/SubproblemsComponent';
import { Image, Instruction, Math, Problem, Subproblems, Table, Text } from '../interfaces';


export const renderContent = (content: (Text | Math | Table | Image | Subproblems)[]) => {
    return content?.map((item, index) => {
        return <div key={index}>{renderItem(item)}</div>
    });
}
export const renderItem = (item: Text | Math | Table | Image | Subproblems | Problem | Instruction) => {
    switch (item.type) {
        case 'text':
            return (
                <div
                    className={'text-xs md:text-lg z-10  border-2 border-transparent border-dashed hover:border-2 p-1 m-1 group-hover:border-2 group-hover:border-dashed'}
                >
                    {item.value}
                </div>
            );
        case 'math':
            return (
                <ReactMarkdown
                    className={"text-xs md:text-lg z-10  border-gray-100 border-2 border-transparent border-dashed hover:border-2 p-1 m-1 group-hover:border-2 group-hover:border-dashed"}
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                >

                    {String.raw`$${item.value}$`.replace("?", "\\text{?}")}
                </ReactMarkdown>
            );
        case 'table':
            return (
                <ReactMarkdown
                    className={"text-xs md:text-lg z-10  border-gray-100 border-2 border-transparent border-dashed hover:border-2 p-1 m-1 group-hover:border-2 group-hover:border-dashed"}
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                >
                    {String.raw`${item.value}`}
                </ReactMarkdown>
            );
        case 'image':
            //todo: get better descriptions added to the ASTs
            // console.log("image", item)
            return (
                <img
                    src={item.value}
                    alt="Description"
                    className="text-xs md:text-lg z-10 p-1 m-1 border-2 border-transparent border-dashed hover:border-2 group-hover:border-2 group-hover:border-dashed"
                />
            );
        case 'subproblems':
            return <SubproblemsComponent subproblems={item} />;
        default:
            return null;
    }
}
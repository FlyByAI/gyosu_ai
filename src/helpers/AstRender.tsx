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

const escapeDollarSigns = (text: string): string => {
    // This regex matches a dollar sign followed by digits, but only if the dollar sign
    // is either at the start of the string or preceded by a non-word character (like a space or punctuation).
    // It ensures that the dollar sign used in expressions like $12 is escaped, but not in LaTeX like $x+y$
    return text.replace(/(^|\W)\$(?=\d+)/g, '$1\\$');
  };

  const testCases = [
    "It costs $20 to enter.",
    "The formula $2x+1$ when x = 5 is 11.",
    "The integral of $x^2$ from $0$ to $2$ is $\frac{2^3}{3} - \frac{0^3}{3}$.",
    "You owe me $100.",
    "$1000 is a lot of money.",
    "He said, \"$100 is not much.\"",
    "What is the value of $x$ if $2x + $10 = $50?"
  ];
  
  // Apply the escape function to each test case
  testCases.forEach(text => {
    console.log(`Original: ${text}`);
    console.log(`Escaped: ${escapeDollarSigns(text)}`);
    console.log('---');
  });

export const renderItem = (item: Text | Math | Table | Image | Subproblems | Problem | Instruction, debug = false) => {
    switch (item.type) {
        case 'text':
            return (
                <div
                    className={`${debug && "tooltip"} text-left text-xs md:text-lg z-10  border-2 border-transparent border-dashed hover:border-2 mx-1 mt-1 group-hover:border-2 group-hover:border-dashed`}
                    data-tip={debug ? "text" : undefined}
                >
                    <ReactMarkdown
                        className={`${debug && "tooltip"} text-left text-xs md:text-lg z-10  border-gray-100 border-2 border-transparent border-dashed hover:border-2 mx-1 mt-1 group-hover:border-2 group-hover:border-dashed`}
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}

                    >
                        {escapeDollarSigns(item.value)}
                    </ReactMarkdown>
                </div>
            );
        case 'math':
            return (
                <div
                    data-tip={debug ? "math" : undefined}
                    className='tooltip'
                >
                    <ReactMarkdown
                        className={`${debug && "tooltip"} text-left text-xs md:text-lg z-10  border-gray-100 border-2 border-transparent border-dashed hover:border-2 mx-1 mt-1 group-hover:border-2 group-hover:border-dashed`}
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
                        className={"text-left text-xs md:text-lg z-10  border-gray-100 border-2 border-transparent border-dashed hover:border-2 mx-1 mt-1 group-hover:border-2 group-hover:border-dashed"}
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
                    className={`${debug && "tooltip"} text-left text-xs md:text-lg z-10 mx-1 mt-1 border-2 border-transparent border-dashed hover:border-2 group-hover:border-2 group-hover:border-dashed`}
                />
            );
        case 'subproblems':
            return <SubproblemsComponent subproblems={item} />;
        default:
            return null;
    }
}
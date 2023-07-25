import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MathMarkdownProps {
    markdown: string;
}


const MathMarkdown: React.FC<MathMarkdownProps> = ({ markdown }) => {

    const [printReadyMarkdown, setPrintReadyMarkdown] = useState<string[]>([]);

    function markdownProblemsToArr(markdown: string) {
        const spacedMarkdown = markdown.replace(/\n\n\*\*Problem /g, "\n\n\n\n\n\n\n**Problem ");
        const spaceBeforeImageMarkdown = spacedMarkdown.replace(/!\[/g, "\n\n![");
        const array = spaceBeforeImageMarkdown.split("\n\n")
        return array;
    }

    useEffect(() => {
        setPrintReadyMarkdown(markdownProblemsToArr(markdown))
    }, [markdown])


    return (
        <>
            {markdown && <>
                {/* this hidden div gets printed, it contains extra formatting for the printed document */}
                <div className="text-gray-700 dark:text-white" id="markdownToPrint" hidden={true}>
                    {printReadyMarkdown.map((problem, index) => {
                        return (
                            <div key={index}>
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                >
                                    {problem}
                                </ReactMarkdown>
                                <br />
                            </div>
                        )
                    })}
                </div>
            </>}
        </>
    );
}

export default MathMarkdown;

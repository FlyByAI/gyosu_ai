import ReactMarkdown from 'react-markdown';

import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import RemarkMathPlugin from "remark-math";


// an alternative to just pure react-markdown, not sure yet if this changes anything

function Markdown(props) {
    const newProps = {
        ...props,
        plugins: [
            RemarkMathPlugin,
        ],
        renderers: {
            ...props.renderers,
            math: (props) => <BlockMath math={props.value} />,
            inlineMath: (props) => <InlineMath math={props.value} />
        }
    };
    return (
        <ReactMarkdown {...newProps} />
    );
}

export default Markdown;
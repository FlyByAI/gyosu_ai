import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import Plot from 'react-plotly.js';

// This component displays complex objects returned by our backend for text, latex, or matplotlib formats. 

const TextMessage: React.FC<{ message: string }> = ({ message }) => <p>{message}</p>;

const LatexMessage: React.FC<{ message: string }> = ({ message }) => <InlineMath>{message}</InlineMath>;

// const MatplotlibMessage: React.FC<{ code: string }> = ({ code }) => <Plot code={code} />;

interface Message {
    type: string;
    message?: string;
    code?: string;
}

interface MessageListProps {
    messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => (
    <>
        {messages.map((message, index) => {
            switch (message.type) {
                case 'text':
                    return <TextMessage key={index} message={message.message!} />;
                case 'latex':
                    return <LatexMessage key={index} message={message.message!} />;
                // case 'matplotlib':
                //     return <MatplotlibMessage key={index} code={message.code!} />;
                default:
                    return null;
            }
        })}
    </>
);

export default MessageList;

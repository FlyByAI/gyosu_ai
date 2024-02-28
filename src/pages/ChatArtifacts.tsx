import { useClerk } from "@clerk/clerk-react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import Accordion from "../components/Accordion";
import useChatSessions from "../hooks/tools/math/useChatSessions";
import useEnvironment from "../hooks/useEnvironment";

const ChatArtifacts = () => {

    const { apiUrl } = useEnvironment();
    const chatEndpoint = `${apiUrl}/math_app/chat/`;
    const { user } = useClerk();

    const { sessionId } = useParams();

    const { chatSessionArtifacts } = useChatSessions(chatEndpoint, sessionId);

    console.log(chatSessionArtifacts)
    return (
        <div>
            {chatSessionArtifacts &&
                <div className='text-green-200'>
                    {chatSessionArtifacts.sessionId}
                </div>
            }
            {chatSessionArtifacts &&
                Object.keys(chatSessionArtifacts).map((key) => (
                    <ul>
                        <Accordion title={`${key}: ${chatSessionArtifacts[key as keyof typeof chatSessionArtifacts] ? "created" : "empty"}`} children={
                            <ReactMarkdown
                                className={"text-xs md:text-lg z-10 text-white"}
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                            >
                                {String.raw`${chatSessionArtifacts[key as keyof typeof chatSessionArtifacts]}`}
                            </ReactMarkdown>
                        } />
                    </ul>
                ))}
        </div>
    );
};

export default ChatArtifacts;

import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import Accordion from "../components/Accordion";
import useChatSessions from "../hooks/tools/math/useChatSessions";
import useEnvironment from "../hooks/useEnvironment";


export interface SelectedSectionObject {
    [key: string]: string | SelectedSectionObject[];
}

const ChatArtifacts = () => {

    const { apiUrl } = useEnvironment();
    const chatEndpoint = `${apiUrl}/math_app/chat/`;

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
            {chatSessionArtifacts && Object.keys(chatSessionArtifacts).map((key) => (
                <ul key={key} className="text-gray-300">
                    <Accordion
                        title={`${key}: ${chatSessionArtifacts[key as keyof typeof chatSessionArtifacts] ? typeof(chatSessionArtifacts[key as keyof typeof chatSessionArtifacts]): 'empty'
                            }`}
                        children={
                            <>
                                {Array.isArray(chatSessionArtifacts[key as keyof typeof chatSessionArtifacts]) ? (
                                    (chatSessionArtifacts[key as keyof typeof chatSessionArtifacts] as SelectedSectionObject[]).map(
                                        (item, index) => (
                                            <div key={index} className="pb-2">
                                                {Object.keys(item).map((fieldKey) => (
                                                    <p key={fieldKey}>{`${fieldKey}: ${(item)[fieldKey]}`}</p>
                                                ))}
                                            </div>
                                        )
                                    )
                                ) : (
                                    <ReactMarkdown
                                        className={'text-xs md:text-lg z-10 text-gray-300'}
                                        remarkPlugins={[remarkGfm, remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                    >
                                        {String.raw`${chatSessionArtifacts[key as keyof typeof chatSessionArtifacts]}`}
                                    </ReactMarkdown>
                                )}
                            </>
                        }
                    />
                </ul>
            ))}

        </div>
    );
};

export default ChatArtifacts;

import { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { useParams } from 'react-router-dom';
import { useRunTutorial } from '../contexts/RunTutorialContext2';
import useChatSessions from '../hooks/tools/math/useChatSessions';
import { StartStreamingPayload } from '../hooks/tools/math/useStreamedResponse';
import useEnvironment from '../hooks/useEnvironment';
import { IChatMessage } from '../pages/GyosuAIChat';

interface ChatTutorialProps {
    startStreaming: (bodyContent: StartStreamingPayload) => Promise<() => void>
}
const ChatTutorial = ({ startStreaming }: ChatTutorialProps) => {
    const [run, setRun] = useState(false);

    const { runTutorial, setRunTutorial } = useRunTutorial();

    const { sessionId } = useParams();



    const [steps, setSteps] = useState([
        {
            target: '.chat-sidebar',
            content: 'This sidebar contains your previous chat sessions. You can revisit them anytime.',
            placement: 'right' as const,
        },
        {
            target: '.text-input',
            content: 'Start by asking what topic you want to create a worksheet for, like "Create a worksheet on fractions for my 5th grade class."',
            placement: 'top' as const,
        },
        {
            target: '.send-button',
            content: 'Click here to send your chat message to the AI agent.',
            placement: 'top' as const,
        },
        {
            target: '.chat-sidebar-session-ellipsis',
            content: 'Click here to see options for sharing, renaming, and deleting a session.',
            placement: 'right' as const,
        },
        {
            target: '.hamburger-menu',
            content: 'Use this menu to navigate to different parts of the application, including viewing any exported documents created by the agent.',
            placement: 'right' as const,
        },
        {
            target: '.share-button',
            content: 'Share a copy of this chat session with another user.',
            placement: 'left' as const,
        },
        {
            target: '.artifact-button',
            content: 'Use this button to see the selected sections, the outline, document, and export options as the AI processes your request.',
            placement: 'left' as const,
            spotlightPadding: 10,
        },
        {
            target: '#start-tutorial-button',
            content: 'If you ever need to see this tutorial again, click this button. It will guide you through the features step by step.',
            placement: 'top' as const,
        },
    ]);


    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
        }
    };

    const { apiUrl } = useEnvironment();
    const chatEndpoint = `${apiUrl}/math_app/chat/`;
    const {chatSession} = useChatSessions(chatEndpoint, sessionId);

    const startTutorialStream = () => {
        const newMessage: IChatMessage = { role: 'user', content: 'I am using the chat tutorial, please help me get started creating content for my classroom. ' };

            const payload = {
                newMessage: newMessage,
                messages: chatSession?.messageHistory.concat(newMessage) || [newMessage],
                sessionId: sessionId,
            };

            startStreaming(payload);
    }

    const handleStartTutorial = () => {
        if (!sessionId) {
            setRunTutorial(true);
            startTutorialStream();
        }
        else {
            setRun(true);
        }
    }

    useEffect(() => {
        if (runTutorial && sessionId) {
            setRun(true);
            setRunTutorial(false);
        }
    }, [runTutorial, sessionId, setRunTutorial])

    return (
        <div className='w-full flex items-center'>
            <button className='mx-auto p-4 border-2 border-white' onClick={handleStartTutorial}>Start Tutorial</button>
            <Joyride
                continuous
                run={run}
                steps={steps}
                callback={handleJoyrideCallback}
                showProgress
                showSkipButton
                disableOverlayClose={true} 
                disableCloseOnEsc={true}
                styles={{
                    options: {
                        zIndex: 10000,
                    },
                }}
            />
        </div>
    );
};

export default ChatTutorial;
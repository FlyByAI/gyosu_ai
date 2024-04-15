import { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { useParams } from 'react-router-dom';
import { useRunTutorial } from '../contexts/RunTutorialContext';
import useChatSessions from '../hooks/tools/math/useChatSessions';
import { StartStreamingPayload } from '../hooks/tools/math/useStreamedResponse';
import useEnvironment from '../hooks/useEnvironment';
import { IChatMessage } from '../pages/GyosuAIChat';

interface ChatTutorialProps {
    startStreaming: (bodyContent: StartStreamingPayload) => Promise<() => void>
    updateTextbox: (text: string) => void;
}
const ChatTutorial = ({ startStreaming, updateTextbox}: ChatTutorialProps) => {
    const [run, setRun] = useState(false);

    const { runTutorial, setRunTutorial } = useRunTutorial();

    const { sessionId } = useParams();

    const [showStartButton, setShowStartButton] = useState(localStorage.getItem('tutorialSeen') !== 'true');

    useEffect(() => {
        // Optionally, if the runTutorial state changes and you want to react to it
        // This ensures that if the tutorial state is programmatically changed elsewhere, it updates the button visibility accordingly
        const tutorialSeen = localStorage.getItem('tutorialSeen') === 'true';
        setShowStartButton(!tutorialSeen);
    }, [runTutorial, sessionId]);

    const [steps, setSteps] = useState([
       
        {
            target: '.chat-sidebar',
            content: 'This sidebar contains your previous chat sessions. You can revisit them anytime.',
            placement: 'right' as const,
        },
        {
            target: '.chat-sidebar-session-ellipsis',
            content: 'Click here to see options for sharing, renaming, and deleting a session.',
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
        {
            target: '.text-input',
            content: 'Start by asking what topic you want to create a worksheet for, like "What textbooks are available for 5th grade math?".',
            placement: 'top' as const,
        },
        {
            target: '.send-button',
            content: 'Click here to send your chat message.',
            placement: 'top' as const,
        },
    ]);


    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status, action, index } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    
        // Check if the tutorial has been finished or skipped
        if (finishedStatuses.includes(status)) {
            setRun(false);
            localStorage.setItem('tutorialSeen', 'true');
        }

        // Assuming step 2 is the one where you want to input text, and 'index' is zero-based
        if (index === 7 && action === 'next') {
            // Programmatically set the value of the text input
            // This assumes you have a way to reference the text input, for example using a ref or document.querySelector
            updateTextbox('What textbooks are available for 5th grade math?');
        }
    };
    

    const { apiUrl } = useEnvironment();
    const chatEndpoint = `${apiUrl}/math_app/chat/`;
    const {chatSession, isLoading} = useChatSessions(chatEndpoint, sessionId);

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
            setShowStartButton(false); 
        }
        else {
            setRun(true);
            setShowStartButton(false); 
        }
    }

    useEffect(() => {
        if(chatSession && chatSession?.messageHistory.length !== 0) {
            setShowStartButton(false);
        }
    }, [chatSession, chatSession?.messageHistory.length, sessionId])

    useEffect(() => {
        if (runTutorial && sessionId) {
            setRun(true);
            setRunTutorial(false);
        }
    }, [runTutorial, sessionId, setRunTutorial])

    return (
        <div className='w-full flex items-center'>
            {showStartButton && !isLoading &&
                <button className='mx-auto p-4 rounded bg-gradient-to-b btn btn-primary border-white' onClick={handleStartTutorial}>Start Tutorial</button>
            }
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
import { useClerk } from '@clerk/clerk-react';
import { useQueryClient } from '@tanstack/react-query';
import humps from 'humps';
import { useCallback, useState } from 'react';
import { useModal } from '../../../contexts/useModal';
import { IChatMessage } from '../../../pages/GyosuAIChat';
import { ChatSession } from "./useChatSessions";


export interface StartStreamingPayload {
    newMessage: IChatMessage;
    messages: IChatMessage[];
    sessionId?: string;
}


const useStreamedResponse = (endpoint: string, headers: any) => {
    const [data, setData] = useState<string>("");
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { session } = useClerk();
    const queryClient = useQueryClient();

    const { currentModal, modalContent, openModal, closeModal } = useModal();

    const modalComponentContent = () => (<div className="rounded-lg bg-gray-100 mx-auto max-w-2xl">
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-left">Unlock Full Gyosu Potential</h2>
            <div className="text-left">
                <p className="text-md mb-6">Upgrade to Gyosu Pro to gain access to our advanced GyosuChat Teacher Assistant.</p>
                <p className="text-md mb-6">Enjoy a higher daily message limit, and get exclusive access to new features.</p>
                <ul className="text-sm pl-0 list-outside space-y-1">
                    <li>100 messages per day</li>
                    <li>Full access to problem database</li>
                    <li>Save Documents to profile</li>
                    <li>Early access to upcoming features</li>
                </ul>
                <div className='text-bold'>
                    Use code GYOSU50 to get 50% off monthly rate. Cancel anytime.
                </div>
            </div>
        </div>
    </div>
    )

    


    const startStreaming = useCallback(async (bodyContent: StartStreamingPayload) => {
        setData("");
        const abortController = new AbortController();
        const token = session ? await session.getToken() : 'none';

        const previousChatSession = queryClient.getQueryData<ChatSession>(['chatSession', bodyContent.sessionId]);
        if (previousChatSession && bodyContent.messages) {
            queryClient.setQueryData<ChatSession>(['chatSession', bodyContent.sessionId], {
                ...previousChatSession,
                messageHistory: [...previousChatSession.messageHistory, bodyContent.newMessage],
            });
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : '',
                        ...headers
                    },
                    body: JSON.stringify(humps.decamelizeKeys(bodyContent)),
                    signal: abortController.signal,
                });

                if (!response.ok) {
                    if (response.status === 429) {
                        setError("You are out of uses for this week :(");
                        openModal("subscribe", modalComponentContent())
                        console.log("openedModal")
                    }
                }
                const reader = response?.body?.getReader();
                const decoder = new TextDecoder('utf-8');

                reader?.read().then(function processText({ done, value }): Promise<void> {
                    if (done) {
                        setLoading(false);
                        return Promise.resolve();
                    }

                    const newText = decoder.decode(value, { stream: true });
                    setData(() => newText);

                    // Continue reading
                    return reader.read().then(processText);
                });

            } catch (error: any) {
                setError(error.message);
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchData();
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            abortController.abort();
        };
    }, [endpoint, headers, session, queryClient]);

    return { data, isLoading, error, startStreaming };
};

export default useStreamedResponse;
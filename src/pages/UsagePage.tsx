import React, { useEffect, useState } from 'react';
import useUsageData from '../hooks/usageStats/useUsageData';
import useEnvironment from '../hooks/useEnvironment';

export interface ChatUsageData {
    uniqueChatters: number;
    chatSessionsPerChatter: number;
    singleChatUserCount: number;
    averageMessagesPerUser: number;
    averageMessagesPerUserPerDay: number;
    activeUsersOverDays: number[];
    activeUsersOverWeeks: number[];
    activeUsersOverMonths: number[];
    mostActiveUsers: string[];
}

const UsagePage: React.FC = () => {
    const { apiUrl } = useEnvironment();
    const chatEndpoint = `${apiUrl}/usage/`;
    const { getChatUsageData, isLoading, error, chatUsageData } = useUsageData(chatEndpoint);
    const [usageData, setUsageData] = useState<ChatUsageData | null>(null);

    useEffect(() => {
        getChatUsageData();
    }, [getChatUsageData]);

    useEffect(() => {
        if (chatUsageData) {
            setUsageData(chatUsageData);
        }
    }, [chatUsageData]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>Chat Usage Data</h1>
            {usageData && (
                <div>
                    {/* Render your chat usage data here */}
                    <p>Unique Chatters: {usageData.uniqueChatters}</p>
                    {/* Add more fields as needed */}
                </div>
            )}
        </div>
    );
};

export default UsagePage;

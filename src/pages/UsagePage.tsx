import React, { useEffect, useState } from 'react';
import useUsageData, { ChatUsageData } from '../hooks/usageStats/useUsageData';
import useEnvironment from '../hooks/useEnvironment';

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
        <div className='text-white'>
            <h1 className='text-2xl'>Chat Usage Data:</h1>
            {usageData && (
                <div>
                    <p className="p-2">Unique Chatters: {usageData.uniqueChatters?.toString()}</p>
                    <p className="p-2">Chat Sessions Per Chatter: {usageData.chatSessionsPerChatter}</p>
                    <p className="p-2">Single Chat User Count: {usageData.singleChatUserCount}</p>
                    <p className="p-2">Average Messages Per User: {usageData.averageMessagesPerUser && Object.keys(usageData.averageMessagesPerUser)}</p>
                    <p className="p-2">Average Messages Per User Per Day:
                        {Object.entries(usageData.averageMessagesPerUserPerDay || {}).map(([key, value]) => (
                            <div key={key}>
                                {key}: {value}
                            </div>
                        ))}
                    </p>
                    <p className="p-2">Active Users Over Days: {usageData.activeUsersOverDays?.toString()}</p>
                    <p className="p-2">Active Users Over Weeks: {usageData.activeUsersOverWeeks?.toString()}</p>
                    <p className="p-2">Active Users Over Months: {usageData.activeUsersOverMonths?.toString()}</p>
                    <p className="p-2">Most Active Users: {usageData.mostActiveUsers.map((user) => user.userUsername)}</p>
                </div>
            )}
        </div>
    );
};

export default UsagePage;

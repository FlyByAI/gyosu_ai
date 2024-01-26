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
                    <p className="p-2">
                        Chat Sessions Per Chatter: 
                        {usageData.chatSessionsPerChatter && usageData.chatSessionsPerChatter.map((user, index) => (
                            <span key={index}>
                                {user.username} has {user.numChats} chats{index < usageData.chatSessionsPerChatter.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </p>

                    <p className="p-2">Single Chat User Count: {usageData.singleChatUserCount}</p>
                    <p className="p-2">Average Messages Per User: {usageData.averageMessagesPerUser}</p>
                    <p className="p-2">Average Messages Per User Per Day:{usageData.averageMessagesPerUserPerDay}</p>
                    <p className="p-2">Active Users Over Days: {usageData.activeUsersOverDays}</p>
                    <p className="p-2">Active Users Over Weeks: {usageData.activeUsersOverWeeks}</p>
                    <p className="p-2">Active Users Over Months: {usageData.activeUsersOverMonths}</p>
                    <p className="p-2">
                        Most Active Users: 
                        {usageData.mostActiveUsers && usageData.mostActiveUsers.map((user, index) => (
                            <span key={index}>
                                {user.username} Sessions: {user.chatSessionCount} {index < usageData.mostActiveUsers.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </p>

                </div>
            )}
        </div>
    );
};

export default UsagePage;

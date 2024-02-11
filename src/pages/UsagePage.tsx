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
                    <p className="p-2">Unique Chatters: {usageData.uniqueChatters?.join(', ')}</p>

                    {usageData.chatSessionsPerChatter && (
                        <>
                            <div className="p-2">
                                Chat Sessions Per Chatter:
                            </div>
                            {Object.entries(usageData.chatSessionsPerChatter).map(([username, numChats], index, array) => (
                                <li key={username}>
                                    {username} has {numChats} chats{index < array.length - 1 ? ', ' : ''}
                                </li>
                            ))}
                        </>
                    )}

                    <p className="p-2">Single Chat User Count: {usageData.singleChatUserCount}</p>

                    {usageData.averageMessagesPerUser && (
                        <>
                            <div className="p-2">
                                Average Messages Per User:
                            </div>
                            {Object.entries(usageData.averageMessagesPerUser).map(([username, count], index, array) => (
                                <li key={username}>{username}: {count}{index < array.length - 1 ? ', ' : ''}</li>
                            ))}
                        </>
                    )}

                    {usageData.averageMessagesPerUserPerDay && (
                        <>
                            <div className="p-2">
                                Average Messages Per User Per Day:
                            </div>
                            {Object.entries(usageData.averageMessagesPerUserPerDay).map(([day, count], index, array) => (
                                <li key={day}>Day {day}: {count}{index < array.length - 1 ? ', ' : ''}</li>
                            ))}
                        </>
                    )}

                    <p className="p-2">Active Users Over Days: {usageData.activeUsersOverDays}</p>
                    <p className="p-2">Active Users Over Weeks: {usageData.activeUsersOverWeeks}</p>
                    <p className="p-2">Active Users Over Months: {usageData.activeUsersOverMonths}</p>

                    {usageData.mostActiveUsers && (
                        <p className="p-2">
                            Most Active Users:
                            {usageData.mostActiveUsers.map((user, index) => (
                                <li key={index}>
                                    {user.username} Chat sessions: {user.chatSessionCount}{index < usageData.mostActiveUsers.length - 1 ? ', ' : ''}
                                </li>
                            ))}
                        </p>
                    )}

                </div>
            )}

        </div>
    );
};

export default UsagePage;

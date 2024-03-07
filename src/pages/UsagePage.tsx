import React, { useEffect, useState } from 'react';
import useUsageData, { ChatStats } from '../hooks/usageStats/useUsageData';
import useEnvironment from '../hooks/useEnvironment';

const UsagePage: React.FC = () => {
    const { apiUrl } = useEnvironment();
    const chatEndpoint = `${apiUrl}/usage/`;
    const { isLoading, error, chatUsageData } = useUsageData(chatEndpoint);
    const [usageData, setUsageData] = useState<ChatStats | null>(null);

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
                    <p className="p-2">Unique Chatters: {usageData.uniqueChatters}</p>

                    {usageData.mostActiveUsers && usageData.mostActiveUsers.length > 0 && (
                        <>
                            <div className="p-2">
                                Chat Sessions Per Chatter:
                            </div>
                            {usageData.mostActiveUsers.map((user, index) => (
                                <li key={user.username}>
                                    {user.username} has {user.chatSessionCount} chats{index < usageData.mostActiveUsers.length - 1 ? ', ' : ''}
                                </li>
                            ))}
                        </>
                    )}

                    <p className="p-2">Single Chat User Count: {usageData.singleChatUserCount}</p>

                    <p className="p-2">Active Users Over Days: {usageData.activeUsersOverDays}</p>
                    <p className="p-2">Active Users Over Weeks: {usageData.activeUsersOverWeeks}</p>
                    <p className="p-2">Active Users Over Months: {usageData.activeUsersOverMonths}</p>

                    {usageData.usersBySubscription_type && (
                        <div className="p-2">
                            Users By Subscription Type:
                            <li>Free: {usageData.usersBySubscription_type.Free}</li>
                            <li>Lite: {usageData.usersBySubscription_type.Lite}</li>
                            <li>Paid: {usageData.usersBySubscription_type.Paid}</li>
                            <li>Premium: {usageData.usersBySubscription_type.Premium}</li>
                        </div>
                    )}
                </div>
            )}
        </div>

    );
};

export default UsagePage;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { IChatData, Message } from '../interfaces';



const useChat = (endpoint: string, sessionId: string) => {


    const [chatData, setChatData] = useState<IChatData>();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendMessage = async (message: Message) => {
        setIsLoading(true);
        try {
            let response;
            if (chatData) {
                response = await axios.post(`${endpoint}/${sessionId}/`, { message });
            }
            setChatData(response?.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchChat = async (sessionId: string) => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${endpoint}/${sessionId}/`);
                setChatData(response.data);
            } catch (err: any) {
                if (err.response && err.response.status !== 404) {
                    setError(err.message);
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (sessionId) {
            fetchChat(sessionId);
        }
        else {
            console.log("no session id")
        }
    }, [sessionId, endpoint]);

    return { chatData, isLoading, error, sendMessage };
};

export default useChat;

import { ISubscriptionData, ISubscriptionDataSnake } from '../interfaces';
import { useState, useEffect } from 'react';
import axios from 'axios';
import humps from 'humps';

const useSubscribe = (endpoint: string, email: string) => {
    const [subscriptionData, setSubscriptionData] = useState<ISubscriptionData>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const submitSubscriptions = async (subscriptionDataPayload: ISubscriptionData) => {
        setIsLoading(true);
        const data = humps.decamelizeKeys(subscriptionDataPayload) as ISubscriptionDataSnake;

        try {
            let response;
            if (subscriptionData) {
                response = await axios.put(`${endpoint}/${data.email}/`, data);
            } else {
                response = await axios.post(`${endpoint}/`, data);
            }
            // Camelize the response data here
            setSubscriptionData(humps.camelizeKeys(response.data) as ISubscriptionData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        const fetchSubscriptions = async (email: string) => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${endpoint}/${email}/`);
                // Camelize the response data here
                setSubscriptionData(humps.camelizeKeys(response.data) as ISubscriptionData);
            } catch (err: any) {
                if (err.response && err.response.status !== 404) {
                    setError(err.message);
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (email) {
            fetchSubscriptions(email);
        }
        else {
            console.log("no email")
        }
    }, [email, endpoint]);

    return { subscriptionData, isLoading, error, submitSubscriptions };
};

export default useSubscribe;

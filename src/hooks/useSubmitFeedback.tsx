import { useState } from 'react';
import { IFeedbackData } from '../interfaces';
import humps from 'humps';





const useSubmitFeedback = (endpoint: string) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any | null>(null);

    const submitFeedback = async (feedbackData: IFeedbackData) => {
        setLoading(true);
        setError(null);

        const feedbackDataWithChapSec = { ...feedbackData, chapter: feedbackData.section.split(".")[0], section: feedbackData.section.split(".")[1] };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(humps.decamelizeKeys(feedbackDataWithChapSec))
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json().then((json) => humps.camelizeKeys(json));
            setData(responseData);

            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return { submitFeedback, isLoading, error, data };
};

export default useSubmitFeedback;

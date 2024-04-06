import React from 'react';
import SurveyComponent, { Survey } from './SurveyComponent';


const survey: Survey= {
    id: 'survey1',
    questions: [
        {
            id: '1',
            type: 'radio',
            text: 'How did you hear about us?',
            options: [
                { id: 'teacher', text: 'another teacher' },
                { id: 'google', text: 'google' },
                { id: 'tiktok-gyosuai', text: 'tiktok' },
                { id: 'other', text: 'other' },
            ],
        },
        {
            id: '2',
            type: 'radio',
            text: 'What describes you best?',
            options: [
                { id: 'teacher', text: 'teacher' },
                { id: 'tutor', text: 'tutor' },
                { id: 'parent', text: 'parent' },
                { id: 'student', text: 'student' },
            ],
        },
        {
            id: '3',
            type: 'checkbox',
            text: 'What would you most like to be able to do with AI?',
            options: [
                { id: 'create-docs', text: 'Create documents for teaching.' },
                { id: 'search-for-problems', text: 'Search for problems for my subject.' },
                { id: 'create-custom-problems', text: 'Create custom problems more easily.' },
                { id: 'grade', text: 'Grade student work.' },
                { id: 'other', text: 'Other.' },
            ],
        }
    ],
};




const Surveys: React.FC = () => {

    // const { apiUrl } = useEnvironment();
    // const { subscriptionInfo } = useFetchSubscriptionInfo(`${apiUrl}/user_data/get_subscription_info/`);
  
    return <SurveyComponent introText="Help us improve your experience." survey={survey} />;
};

export default Surveys;

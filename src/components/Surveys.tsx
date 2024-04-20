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
                { id: 'tiktok', text: 'tiktok' },
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

const survey2: Survey= {
    id: 'survey2',
    questions: [
        {
            id: '1',
            type: 'radio',
            text: 'Which feature is your preferred feature within GyosuAI?',
            options: [
                { id: 'gyosu-chat-agent', text: 'An AI agent that makes documents for me.' },
                { id: 'problem-bank', text: 'An easy way to make custom math problems myself.' },
                { id: 'other', text: 'Something else.' },
            ],
        },
        {
            id: '2',
            type: 'text',
            text: 'What are you trying to do on GyosuAI?',
        },
        {
            id: '3',
            type: 'text',
            text: 'Anything else you would like the GyosuAI team to know?',
        }
    ],
};




const Surveys: React.FC = () => {

    return <>
        <SurveyComponent introText="Help us improve your experience." survey={survey2} />
    </>;
};

export default Surveys;

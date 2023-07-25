import React from 'react';
import 'tailwindcss/tailwind.css';
import ProblemManager from './ProblemManager';

interface MathTeacherEditProps {
    typeOptions: string[];
    documentType: string;
    handleTypeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    section: string;
    handleSectionChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    response: string;
    handleResponseChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    chat: string;
    setChat: (value: string) => void;
    handleChatChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    numQuestions: number;
    handleNumQuestionsChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    highlightedText: string;
    setHighlightedText: React.Dispatch<React.SetStateAction<string>>;
    chatHistory: string[];
    setChatHistory: React.Dispatch<React.SetStateAction<string[]>>;
    editMode: boolean;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}


const MathTeacherEdit: React.FC<MathTeacherEditProps> = ({ ...props }) => {

    const { setChat, response, handleResponseChange } = props;

    const handleMarkdownChange = (newMarkdown: string) => {
        handleResponseChange({ target: { value: newMarkdown } } as React.ChangeEvent<HTMLTextAreaElement>);
    };

    return (
        <>
            <ProblemManager initialMarkdown={response} setChat={setChat} onMarkdownChange={handleMarkdownChange} />
        </>
    );
};

export default MathTeacherEdit;


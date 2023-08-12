import React from 'react';
import 'tailwindcss/tailwind.css';
import ProblemManager from './ProblemManager';
import { ProblemData } from '../../interfaces';

interface MathTeacherEditProps {
    typeOptions: string[];
    handleTypeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    handleSectionChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    markdown: string;
    handleMarkdownChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    chat: string;
    setChat: (value: string) => void;
    handleChatChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    highlightedText: string;
    setHighlightedText: React.Dispatch<React.SetStateAction<string>>;
    chatHistory: string[];
    setChatHistory: React.Dispatch<React.SetStateAction<string[]>>;
    editMode: boolean;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    data: ProblemData
}


const MathTeacherEdit: React.FC<MathTeacherEditProps> = ({ ...props }) => {

    const { setChat, markdown, handleMarkdownChange, data } = props;

    const onMarkdownChange = (newMarkdown: string) => {
        handleMarkdownChange({ target: { value: newMarkdown } } as React.ChangeEvent<HTMLTextAreaElement>);
    };

    return (
        <>
            <ProblemManager initialMarkdown={markdown} setChat={setChat} onMarkdownChange={onMarkdownChange}
                data={data}
            />
        </>
    );
};

export default MathTeacherEdit;


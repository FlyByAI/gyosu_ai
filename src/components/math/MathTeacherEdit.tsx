import React from 'react';
import 'tailwindcss/tailwind.css';
import ProblemManager from './ProblemManager';
import { ProblemData } from '../../interfaces';

interface MathTeacherEditProps {
    markdown: string;
    handleMarkdownChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    setChat: (value: string) => void;
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


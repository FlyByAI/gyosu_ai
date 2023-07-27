import React, { useState, useEffect } from 'react';
import ResponseBox from './ResponseBox'; // Replace with your actual import
import ArrowLeft from '../../svg/ArrowLeftIcon';
import ArrowRight from '../../svg/ArrowRightIcon';
import RefreshResult from './RefreshResult';
import PrintResult from './PrintResult';
import TrashIcon from '../../svg/TrashIcon';
import PlusIcon from '../../svg/PlusIcon';
import LatexIcon from '../../svg/LatexIcon';
import MathProblem from './MathProblem';
import ResponseFeedback from '../ResponseFeedback';

interface ProblemManagerProps {
    initialMarkdown: string;
    onMarkdownChange: (newMarkdown: string) => void;
    setChat: (value: string) => void;
}

const ProblemManager: React.FC<ProblemManagerProps> = ({ initialMarkdown, onMarkdownChange, setChat, }) => {
    const [problems, setProblems] = useState<string[]>(markdownToProblemsArr(initialMarkdown));

    useEffect(() => {
        const updateMarkdown = (problems: string[]) => {
            onMarkdownChange(problems.join("\n\n"));
        }
        updateMarkdown(problems)
    }, [problems, onMarkdownChange]);

    function markdownToProblemsArr(markdown: string) {
        const spacedMarkdown = markdown.replace(/(\*\*Problem \d+\*\*)/g, "<br>$1");
        const array = spacedMarkdown.split("<br>");
        return array.slice(1);
    }



    const updateProblems = (newProblems: string[]) => {
        setProblems(newProblems);
    }

    const updateProblem = (index: number, newProblem: string) => {
        const newProblems = [...problems];
        newProblems[index] = newProblem.trim();
        updateProblems(newProblems);
    }

    const insertProblem = (indexToInsertAfter: number) => {
        const newProblem = "**Problem New**\nInstructions: \n";
        const newProblems = [...problems];
        newProblems.splice(indexToInsertAfter + 1, 0, newProblem);
        updateProblems(newProblems);
    }

    const deleteProblem = (index: number) => {
        const newProblems = problems.filter((_, i) => i !== index);
        updateProblems(newProblems);
    }

    const handleChange = (index: number) => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateProblem(index, event.target.value);
    }

    const handleFixLatexFormatting = () => {
        console.log("fix formatting");
    }

    return (
        <div>
            {problems.map((problem, index) => (
                <MathProblem
                    key={index}
                    index={index}
                    problem={problem}
                    handleChange={handleChange(index)}
                    handleFixLatexFormatting={handleFixLatexFormatting}
                    deleteProblem={deleteProblem}
                    insertProblem={insertProblem}
                    setChat={setChat}
                    updateProblem={updateProblem}

                />

            ))}
        </div>
    );
};

export default ProblemManager;

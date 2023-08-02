import React, { useState, useEffect } from 'react';
import MathProblem from './MathProblem';

interface ProblemManagerProps {
    initialMarkdown: string;
    onMarkdownChange: (newMarkdown: string) => void;
    setChat: (value: string) => void;
    problemType: string;
}

const ProblemManager: React.FC<ProblemManagerProps> = ({ initialMarkdown, setChat, onMarkdownChange, problemType }) => {
    const [problems, setProblems] = useState<string[]>(markdownToProblemsArr(initialMarkdown));

    useEffect(() => {
        const updateMarkdown = (problems: string[]) => {
            onMarkdownChange(problems.join("\n\n"));
        }
        updateMarkdown(problems)
    }, [problems, onMarkdownChange]);

    function markdownToProblemsArr(markdown: string) {
        const spacedMarkdown = markdown.replace(/(\*\*Problem #?\d+\*\*)/g, "<br>$1");
        const array = spacedMarkdown.split("<br>");
        return array.slice(1);
    }



    const updateProblems = (newProblems: string[]) => {
        setProblems(newProblems);

    }

    const updateProblem = (index: number, newProblem: string) => {
        const newProblems = [...problems];
        newProblems[index] = newProblem;
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

    return (
        <div>
            {problems.map((problem, index) => (
                <MathProblem
                    key={index}
                    index={index}
                    problem={problem}
                    handleChange={handleChange(index)}
                    deleteProblem={deleteProblem}
                    insertProblem={insertProblem}
                    setChat={setChat}
                    updateProblem={updateProblem}
                    problemType={problemType}

                />

            ))}
        </div>
    );
};

export default ProblemManager;

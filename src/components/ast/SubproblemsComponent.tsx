import 'katex/dist/katex.min.css';
import React from 'react';
import { renderContent } from '../../helpers/AstRender';
import { Subproblem, Subproblems } from '../../interfaces';

interface SubproblemsProps {
    subproblems: Subproblems;
}

export const SubproblemsComponent: React.FC<SubproblemsProps> = ({ subproblems }) => {
    return (
        <div className="flex flex-col">
            {subproblems.content.map((subproblem, index) => (
                <SubproblemComponent key={index} subproblem={subproblem} />
            ))}
        </div>
    );
};

interface SubproblemProps {
    subproblem: Subproblem
}

export const SubproblemComponent: React.FC<{ subproblem: Subproblem }> = ({ subproblem }: SubproblemProps) => {
    return (
        <div className="flex flex-col items-center text-xs md:text-lg z-10 p-1 m-1 border-2 border-transparent border-dashed hover:border-2 group-hover:border-2 group-hover:border-dashed">
            <div className="mb-2 font-bold">{subproblem.label}</div>
            {renderContent(subproblem.content)}
        </div>
    );
};


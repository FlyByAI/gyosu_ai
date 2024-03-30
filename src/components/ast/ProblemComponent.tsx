import 'katex/dist/katex.min.css';
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDragContext } from '../../contexts/DragContext';
import { renderContent } from '../../helpers/AstRender';
import { Chunk, INSTRUCTION_DRAG_TYPE, Instruction, PROBLEM_DRAG_TYPE, Problem } from '../../interfaces';

interface ProblemProps {
    parentChunk: Chunk;
    parentChunkIndex: number;
    updateChunk?: (updatedChunk: Chunk, chunkIndex: number) => void;

    problem: Problem;
    problemIndex: number;
    edit?: boolean;
    onInstructionHover: (hovered: boolean) => void; // Function to change the parent's hover state

    disableInstructionProblemDrag?: boolean; //used to disable drag and drop for instructions and problems when on the search
    chunkIndex: number;
}

export const ProblemComponent: React.FC<ProblemProps> = ({ parentChunk, parentChunkIndex, updateChunk, problem, problemIndex, disableInstructionProblemDrag }) => {
    const { setDragState } = useDragContext();

    const [, ref] = useDrag({
        type: PROBLEM_DRAG_TYPE,
        item: () => {
            setDragState({ isDragging: true, dragType: PROBLEM_DRAG_TYPE });
            return { ...problem, content: problem.content } as Problem;
        },
        end: () => {
            setDragState({ isDragging: false, dragType: null });
        },
    });

    const [, drop] = useDrop({
        accept: [INSTRUCTION_DRAG_TYPE, PROBLEM_DRAG_TYPE],
        hover: () => {
            console.log('hover instruction')
        },
        drop: (item: Instruction | Problem) => {
            const updatedContent = [...parentChunk.content];

            const targetIndex = problemIndex !== undefined ? problemIndex : updatedContent.length;
            updatedContent.splice(targetIndex, 0, item);

            const markedContent = updatedContent.map((contentItem, index) => ({
                ...contentItem,
                isDuplicate:
                    ('instructionId' in contentItem && 'instructionId' in item)
                        ? contentItem.instructionId === item.instructionId && index !== targetIndex
                        : ('problemId' in contentItem && 'problemId' in item)
                            ? contentItem.problemId === item.problemId && index !== targetIndex
                            : false
            }));

            const filteredContent = markedContent.filter(contentItem => !contentItem.isDuplicate);

            const updatedChunk = { ...parentChunk, content: filteredContent };
            updateChunk && updateChunk(updatedChunk, parentChunkIndex);
        }
    });

    return (
        <div
            ref={(node) => disableInstructionProblemDrag ? ref(drop(node)) : node}
            className="flex group flex-row flex-wrap cursor-pointer">
            {renderContent(problem.content)}
        </div>
    );
};
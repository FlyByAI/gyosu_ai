import { useState, useEffect, useRef } from 'react';
import ToolBadge from './ToolBadge';
import { Chunk, Instruction, Problem } from '../../interfaces';

interface ToolWrapperProps {
    children: React.ReactNode;
    chunk: Chunk;
    instruction?: Instruction;
    problem?: Problem;
    insertChunk?: (chunkIndex: number) => void;
    deleteChunk?: (chunkIndex: number) => void;
    updateChunk: (updatedChunk: Chunk, chunkIndex: number) => void;
    chunkIndex: number;
}

const ToolWrapper: React.FC<ToolWrapperProps> = ({ children, chunk, instruction, problem, insertChunk, deleteChunk, updateChunk, chunkIndex }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // () => console.log("should delete", { type: CHUNK_TYPE, content })
    // () => console.log("should delete", { type: INSTRUCTION_TYPE, content: item.content })
    // () => console.log("should delete", { type: PROBLEM_TYPE, content: item.content })

    const handleToggleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent this click from being detected by the document listener
        setIsClicked(!isClicked);
        setIsHovered(false); // Ensure hover is off when clicked

    };

    const handleClickOutside = (e: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
            setIsClicked(false);
            setIsHovered(false); // Ensure hover is off when clicking outside
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div
            ref={wrapperRef}
            onClick={handleToggleClick}
            onMouseEnter={() => !isClicked && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {(isClicked || isHovered) && (
                <div>
                    <ToolBadge
                        chunk={chunk}
                        instruction={instruction}
                        problem={problem}
                        updateChunk={updateChunk}
                        insertChunk={insertChunk || undefined}
                        deleteChunk={deleteChunk || undefined}
                        chunkIndex={chunkIndex}
                    />
                </div>
            )}
            {children}
        </div>
    );
};

export default ToolWrapper;

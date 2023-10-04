import { useState, useEffect, useRef } from 'react';
import ToolBadge from './ToolBadge';
import { Chunk, Instruction, Problem } from '../../interfaces';
import useGetDocument from '../../hooks/tools/math/useGetDocument';
import { useParams } from 'react-router-dom';
import { useModal } from '../../contexts/useModal';
import AppModal from '../AppModal';
import FeedbackForm from '../forms/FeedbackForm';

interface ToolWrapperProps {
    children: React.ReactNode;
    chunk: Chunk;
    instruction?: Instruction;
    problem?: Problem;
    insertChunk?: (chunkIndex: number) => void;
    updateChunk: (updatedChunk: Chunk, chunkIndex: number) => void;
    chunkIndex: number;
}

const ToolWrapper: React.FC<ToolWrapperProps> = ({ children }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

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
            <AppModal modalId={'feedbackModal'} />

            {children}
        </div>
    );
};

export default ToolWrapper;

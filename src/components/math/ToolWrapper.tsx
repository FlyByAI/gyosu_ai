import { useState, useEffect } from 'react';
import ToolBadge from './ToolBadge';

interface ToolWrapperProps {
    onDelete: () => void;
    children: React.ReactNode;
}

const ToolWrapper: React.FC<ToolWrapperProps> = ({ onDelete, children }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isHovered && (
                <div>
                    <ToolBadge onDelete={onDelete} />
                </div>
            )}
            {children}
        </div>
    );
};

export default ToolWrapper;

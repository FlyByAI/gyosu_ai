import { useState, useEffect } from 'react';
import ToolBadge from './ToolBadge';

interface ToolWrapperProps {
    onDelete: () => void;
    children: React.ReactNode;
}

const ToolWrapper: React.FC<ToolWrapperProps> = ({ onDelete, children }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isBadgeHovered, setIsBadgeHovered] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isHovered || isBadgeHovered) {
            timeout = setTimeout(() => {
                if (!isBadgeHovered && !isHovered) {
                    setIsHovered(false);
                }
            }, 2000);
        }

        return () => clearTimeout(timeout);
    }, [isHovered, isBadgeHovered]);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isHovered && (
                <div onMouseEnter={() => setIsBadgeHovered(true)} onMouseLeave={() => setIsBadgeHovered(false)}>
                    <ToolBadge onDelete={onDelete} />
                </div>
            )}
            {children}
        </div>
    );
};

export default ToolWrapper;

import { useState, useEffect, useRef } from 'react';
import ToolBadge from './ToolBadge';
import { Chunk, Document, Problem } from '../../interfaces';
import ChunkSidebar from './ChunkSidebar';
import { useSidebarContext } from '../../contexts/useSidebarContext';

interface ChunkSidebarWrapperProps {
    children: React.ReactNode;
    document: Document;
}

const ChunkSidebarWrapper: React.FC<ChunkSidebarWrapperProps> = ({ children, document }) => {
    const [isHovered, setIsHovered] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const { activeChunkIndices } = useSidebarContext();

    return (
        <div
            ref={wrapperRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >

            {(activeChunkIndices.length > 0) && (
                <div>
                    <ChunkSidebar
                        document={document}
                    />
                </div>
            )}
            {children}
        </div>
    );

};

export default ChunkSidebarWrapper;

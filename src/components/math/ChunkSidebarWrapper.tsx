import { useState, useEffect, useRef } from 'react';
import ToolBadge from './ToolBadge';
import { Chunk, Document, EmptyDocument, Problem } from '../../interfaces';
import ChunkSidebar from './ChunkSidebar';
import { useSidebarContext } from '../../contexts/useSidebarContext';

interface ChunkSidebarWrapperProps {
    children: React.ReactNode;
    document: Document | EmptyDocument;
}

const ChunkSidebarWrapper: React.FC<ChunkSidebarWrapperProps> = ({ children, document }) => {
    const [isHovered, setIsHovered] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const { activeChunkIndices } = useSidebarContext();


    return (<>
        <div
            ref={wrapperRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <ChunkSidebar
                document={document}
            />
            {children}
        </div>
    </>
    );

};

export default ChunkSidebarWrapper;

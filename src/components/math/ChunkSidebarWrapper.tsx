import { useState, useEffect, useRef } from 'react';
import ToolBadge from './ToolBadge';
import { Chunk, Document, EmptyDocument, Problem } from '../../interfaces';
import ChunkSidebar from './ChunkSidebar';
import { useSidebarContext } from '../../contexts/useSidebarContext';

interface ChunkSidebarWrapperProps {
    children: React.ReactNode;
    document: Document | EmptyDocument;
    deleteChunk?: (chunkIndex: number) => void;
}

const ChunkSidebarWrapper: React.FC<ChunkSidebarWrapperProps> = ({ children, document, deleteChunk }) => {
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
                        deleteChunk={deleteChunk}
                        document={document}
                    />
                </div>
            )}
            {children}
        </div>
    );

};

export default ChunkSidebarWrapper;

import { MathProblemDragItem } from "./DocumentShelf";
import { useDrop } from 'react-dnd';
import { CHUNK_DRAG_TYPE, CHUNK_TYPE, Chunk, Document, INSTRUCTION_DRAG_TYPE, Instruction, PROBLEM_DRAG_TYPE, Problem } from '../../interfaces';
import { useNavigate } from 'react-router-dom';

interface DocumentItemProps {
    document: Document;
    onDropChunk: (documentId: number, node: Chunk) => void;
    isExporting: boolean;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ document, onDropChunk, isExporting }) => {
    const navigate = useNavigate();

    const [, dropRef] = useDrop({
        accept: [CHUNK_DRAG_TYPE, PROBLEM_DRAG_TYPE, INSTRUCTION_DRAG_TYPE],
        drop: (item: Instruction | Problem | Chunk) => {
            if (document.id) {
                // If the item is a Chunk, pass it directly to onDropChunk
                if (item.type === CHUNK_TYPE) {
                    onDropChunk(document.id, item);
                } else {
                    // If the item is an Instruction or Problem, create a Chunk and add the item to its content
                    const newChunk: Chunk = {
                        type: "chunk",
                        content: [item],
                    };
                    onDropChunk(document.id, newChunk);
                }
            }
        },
    });

    const handleClick = () => {
        navigate(`/math-app/document/${document.id}/${isExporting ? "export" : ""}`);
    };

    return (
        <li ref={dropRef} key={document.id} className="bg-gray-700 text-white h-16 p-2 rounded-md overflow-hidden relative" onClick={handleClick}>
            {document && document.problemChunks && <div
                className="absolute text-sm"
                style={{ left: 0 }}
            >
                {document.title}
                {document.problemChunks?.length > 0 && " content count " + document.problemChunks.length}
            </div>}
        </li>
    );
};

export default DocumentItem;
import { MathProblemDragItem } from "./DocumentShelf";
import { useDrop } from 'react-dnd';
import { CHUNK_DRAG_TYPE, CHUNK_TYPE, Chunk, Document, INSTRUCTION_DRAG_TYPE, Instruction, PROBLEM_DRAG_TYPE, Problem } from '../../interfaces';
import { useNavigate, useParams } from 'react-router-dom';

interface DocumentItemProps {
    document: Document;
    onDropChunk: (documentId: number, node: Chunk) => void;
    isExporting: boolean;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ document, onDropChunk, isExporting }) => {
    const navigate = useNavigate();

    const { id } = useParams();

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
        <li ref={dropRef} key={document.id} className={(id == document.id ? "bg-gray-600" : "bg-gray-700") + "  text-white h-14 p-2 rounded-md overflow-clip relative"} onClick={handleClick}>
            {document && document.problemChunks && <div
                className="absolute text-sm flex flex-col"
            >
                <div className="w-100 truncate">
                    {document.title}
                </div>
                <div className="w-100">
                    {document.problemChunks?.length > 0 && " " + document.problemChunks.length + " items"}
                </div>
            </div>}
        </li>
    );
};

export default DocumentItem;
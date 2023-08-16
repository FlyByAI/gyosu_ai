import { MathProblemDragItem } from "./DocumentShelf";
import { useDrop } from 'react-dnd';
import { Chunk, Document } from '../../interfaces';
import { useNavigate } from 'react-router-dom';

interface DocumentItemProps {
    document: Document;
    onDropChunk: (documentId: number, chunk: Chunk) => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ document, onDropChunk }) => {
    const navigate = useNavigate();

    const [, dropRef] = useDrop({
        accept: 'MATH_PROBLEM',
        drop: (item: MathProblemDragItem) => {
            if (document.id) {
                onDropChunk(document.id, item.problem);
            }
        },
    });

    const handleClick = () => {
        navigate(`/math-app/document/${document.id}`);
    };
    console.log(document)

    return (
        <li ref={dropRef} key={document.id} className="bg-gray-700 text-white h-16 p-2 rounded-md overflow-hidden relative" onClick={handleClick}>
            <div
                className="absolute"
                style={{ left: 0 }}
            >
                {document.title}
                {document.content?.length > 0 && " content count " + document.content.length}
            </div>
        </li>
    );
};

export default DocumentItem;
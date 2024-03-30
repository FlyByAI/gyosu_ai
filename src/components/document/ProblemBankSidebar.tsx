import React from 'react';
import toast from 'react-hot-toast/headless';
import { Link, useLocation } from 'react-router-dom';
import { useScreenSize } from '../../contexts/ScreenSizeContext';
import useGetDocuments from '../../hooks/tools/math/useGetDocuments';
import useSubmitDocument from '../../hooks/tools/math/useSubmitDocument';
import useEnvironment from '../../hooks/useEnvironment';
import { CHUNK_TYPE, Chunk, Document, Instruction, Problem } from '../../interfaces';
import PlusIcon from '../../svg/PlusIcon';
import SearchIcon from '../../svg/SearchIcon';
import ProblemBankSidebarItem from './ProblemBankSidebarItem';



export interface MathProblemDragItem {
    type: string;
    problem: Chunk; // Or the specific type you're dragging
}

export interface ProblemBankShelfProps {
    isExporting: boolean;
}


const ProblemBankSidebar: React.FC<ProblemBankShelfProps> = ({ isExporting }) => {
    const { apiUrl } = useEnvironment();
    const location = useLocation();

    const endpoint = `${apiUrl}/math_app/school_document/list/`;
    const { documents } = useGetDocuments(endpoint);
    const endpoint2 = `${apiUrl}/math_app/school_document/`;
    const { submitDocument, updateDocument } = useSubmitDocument(endpoint2);

    const { isDesktop } = useScreenSize();

    const handleAddDocument = async () => {
        const newDocument: Document = {
            title: `Document ${(documents?.length || 0) + 1}`,
            upvotes: 0,
            tips: 0,
            lastModifiedBy: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            problemChunks: [] as Chunk[],
        };

        await submitDocument({ document: newDocument });
        toast('Created new problem bank...')

    };

    const handleDropNode = async (documentId: number, node: Chunk | Problem | Instruction) => {
        console.log("handleDropNode, node:", node)
        const documentToUpdate = documents?.find((doc) => doc.id === documentId);
        if (!documentToUpdate) {
            console.log("Document not found");
            return;
        }


        let contentItem;

        switch (node.type) {
            case "chunk":
                contentItem = node;
                break;
            case "instruction":
                contentItem = { type: CHUNK_TYPE, content: [node as Instruction] } as Chunk;
                break;
            case "problem":
                contentItem = { type: CHUNK_TYPE, content: [node as Problem] } as Chunk;
                break;
            default:
                return; // You might want to handle this case specifically
        }



        const updatedDocument: Document = {
            ...documentToUpdate,
            problemChunks: [...(documentToUpdate.problemChunks || []), contentItem as Chunk],
        };

        console.log(updatedDocument)
        toast(`Added to problem bank: ${documentToUpdate.title}`);

        await updateDocument({ document: updatedDocument });

    };


    const createButtonClass = documents && documents.length > 0
        ? "spacing-x-2 items-center justify-center w-full bg-blue-500 hover:bg-blue-700 h-10 p-2 rounded-md text-white font-extrabold flex-row flex"
        : "spacing-x-2 items-center justify-center w-full bg-green-500 hover:bg-green-700 h-10 p-4 rounded-md text-white font-extrabold text-lg flex-row flex";

    return (<>
        <div className="z-10 flex flex-col w-full bg-base-200 p-4 top-[80px] md:top-[144px] h-[calc(100vh_-_80px)] md:h-[calc(100vh_-_144px)]">
            <div className="flex flex-col items-center mb-4">
                {location.pathname !== '/math-app' && (
                    <Link to="/math-app" className="btn btn-primary w-full rounded-lg font-bold flex items-center justify-center gap-2 py-2 text-sm md:text-lg">
                        Search {isDesktop && <SearchIcon className="w-5 h-5" />}
                    </Link>
                )}
                <h3 className="text-xl mt-4 mb-4">Problem Banks</h3>
                <button onClick={handleAddDocument} className="btn btn-secondary w-full rounded-lg flex items-center justify-center gap-2 py-2 text-sm md:text-lg">
                    Create <PlusIcon className="w-5 h-5" />
                </button>
            </div>

            <ul className="space-y-2 overflow-y-auto">
                {documents && [...documents]
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .map((document) => (
                        <ProblemBankSidebarItem isExporting={isExporting} key={document.id} document={document} onDropChunk={handleDropNode} />
                    ))
                }
            </ul>
        </div>
    </>
    );
};

export default ProblemBankSidebar;

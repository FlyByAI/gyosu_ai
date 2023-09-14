import React, { useEffect, useState } from 'react';
import PlusIcon from '../../svg/PlusIcon';
import { Document, Chunk, Problem, Instruction, CHUNK_TYPE } from '../../interfaces';
import DocumentItem from './DocumentItem';
import useGetDocuments from '../../hooks/tools/math/useGetDocuments';
import useSubmitDocument from '../../hooks/tools/math/useSubmitDocument';
import useEnvironment from '../../hooks/useEnvironment';
import { Link } from 'react-router-dom';
import toast, { useToaster } from 'react-hot-toast/headless';
import InfoCircle from '../../svg/InfoCircle';
import SearchIcon from '../../svg/SearchIcon';



export interface MathProblemDragItem {
    type: string;
    problem: Chunk; // Or the specific type you're dragging
}

export interface ProblemBankShelfProps {
    isExporting: boolean;
}


const ProblemBankShelf: React.FC<ProblemBankShelfProps> = ({ isExporting }) => {
    const { apiUrl } = useEnvironment();

    const { toasts, handlers } = useToaster();

    const endpoint = `${apiUrl}/math_app/school_document/list/`;
    const { documents, isLoading, error } = useGetDocuments(endpoint);
    const endpoint2 = `${apiUrl}/math_app/school_document/`;
    const { submitDocument, updateDocument } = useSubmitDocument(endpoint2);

    const handleAddDocument = async () => {
        const newDocument: Document = {
            title: `Document ${(documents?.length || 0) + 1}`,
            upvotes: 0,
            tips: 0,
            last_modified_by: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
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

        <div style={{ marginLeft: '16.6667%' }} />
        <div className="flex z-10 flex-col w-1/6 bg-gray-800 p-2 fixed" style={{ top: '80px', height: `calc(100vh - 80px)` }}>
            <div className="flex flex-col justify-between items-center mb-2">
                <Link to="/math-app" className="items-center justify-center  hover:underline w-full text-blue-400 rounded-md text-xl font-extrabold flex-row flex">
                    Search <SearchIcon className='ps-2 h-8' />
                </Link>
                <hr className="mt-4 w-full" />

                <h3 className="text-white text-lg mt-4 mb-2 flex-row flex items-center">Problem Banks</h3>
                <button onClick={handleAddDocument} className={createButtonClass}>
                    Create<PlusIcon className="ps-2 h-8 w-8" />
                </button>
            </div>

            <ul className="space-y-2  overflow-y-auto">
                {documents && documents.map((document) => (
                    <DocumentItem isExporting={isExporting} key={document.id} document={document} onDropChunk={handleDropNode} />
                ))}
            </ul>
        </div >
    </>
    );
};

export default ProblemBankShelf;

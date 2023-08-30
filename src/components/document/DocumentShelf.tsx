import React, { useEffect, useState } from 'react';
import PlusIcon from '../../svg/PlusIcon';
import { Document, Chunk, Problem, Instruction, CHUNK_TYPE } from '../../interfaces';
import DocumentItem from './DocumentItem';
import useGetDocuments from '../../hooks/tools/math/useGetDocuments';
import { notSecretConstants } from '../../constants/notSecretConstants';
import useSubmitDocument from '../../hooks/tools/math/useSubmitDocument';
import { useParams } from 'react-router-dom';



export interface MathProblemDragItem {
    type: string;
    problem: Chunk; // Or the specific type you're dragging
}

export interface DocumentShelfProps {
    isExporting: boolean;
}


const DocumentShelf: React.FC<DocumentShelfProps> = ({ isExporting }) => {

    const endpoint = `${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/school_document/list/`;
    const { documents, isLoading, error } = useGetDocuments(endpoint);
    const endpoint2 = `${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/school_document/`;
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

        await updateDocument({ document: updatedDocument });

    };

    return (<>
        <div style={{ marginLeft: '16.6667%' }} />
        <div className="flex flex-col w-1/6 bg-gray-800 p-4 h-screen fixed overflow-y-scroll">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-white text-xl">Problem Banks</h3>
                <button onClick={handleAddDocument} className="bg-blue-400 p-2 rounded-md text-white font-extrabold">
                    <PlusIcon />
                </button>
            </div>
            <ul className="space-y-2">
                {documents && documents.map((document) => (
                    <DocumentItem isExporting={isExporting} key={document.id} document={document} onDropChunk={handleDropNode} />
                ))}
            </ul>
        </div>
    </>
    );
};

export default DocumentShelf;

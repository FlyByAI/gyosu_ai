import React, { useEffect, useState } from 'react';
import PlusIcon from '../../svg/PlusIcon';
import { Document, Chunk } from '../../interfaces';
import DocumentItem from './DocumentItem';
import useGetDocuments from '../../hooks/tools/math/useGetDocuments';
import { notSecretConstants } from '../../constants/notSecretConstants';
import useSubmitDocument from '../../hooks/tools/math/useSubmitDocument';



export interface MathProblemDragItem {
    type: string;
    problem: Chunk; // Or the specific type you're dragging
}

const DocumentShelf: React.FC = () => {

    const endpoint = `${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/school_document/list/`; // Replace with your endpoint
    const { getDocuments, isLoading, error, documents } = useGetDocuments(endpoint);
    const endpoint2 = `${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/school_document/`; // Replace with your endpoint
    const { submitDocument, updateDocument } = useSubmitDocument(endpoint2);

    useEffect(() => {
        getDocuments();
    }, [getDocuments]);

    const handleAddDocument = async () => {
        const newDocument: Document = {
            title: `Document ${(documents?.length || 0) + 1}`,
            contributors: [],
            upvotes: 0,
            tips: 0,
            last_modified_by: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            section: '',
            chapter: '',
            content: [] as Chunk[],
        };

        await submitDocument({ document: newDocument });

        getDocuments();
    };

    const handleDropChunk = async (documentId: number, chunk: Chunk) => {
        const documentToUpdate = documents?.find((doc) => doc.id === documentId);
        if (!documentToUpdate) return;

        console.log(documents)
        console.log(documentToUpdate)


        const updatedDocument: Document = {
            ...documentToUpdate,
            content: [...documentToUpdate.content, chunk],
        };

        await updateDocument({ document: updatedDocument });

        getDocuments();
    };



    return (<>
        <div style={{ marginLeft: '16.6667%' }} />
        <div className="flex flex-col w-1/6 bg-gray-800 p-4 h-screen fixed overflow-y-scroll">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-white text-xl">Doc Shelf</h3>
                <button onClick={handleAddDocument} className="bg-blue-400 p-2 rounded-md text-white font-extrabold">
                    <PlusIcon />
                </button>
            </div>
            <ul className="space-y-2">
                {documents && documents.map((document, index) => (
                    <DocumentItem key={document.id} document={document} onDropChunk={handleDropChunk} />
                ))}
            </ul>
        </div>
    </>
    );
};

export default DocumentShelf;

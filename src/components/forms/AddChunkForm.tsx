import React, { useState } from 'react';
import { Document, Chunk } from '../../interfaces';
import useGetDocuments from '../../hooks/tools/math/useGetDocuments';
import useSubmitDocument from '../../hooks/tools/math/useSubmitDocument';
import useEnvironment from '../../hooks/useEnvironment';
import { useClerk } from '@clerk/clerk-react';
import DocumentPreview from './DocumentPreview';
import { useModal } from '../../contexts/useModal';
import toast, { useToaster } from 'react-hot-toast/headless';

interface AddChunkFormProps {
    chunk: Chunk;
    preview?: boolean;
}

const AddChunkForm: React.FC<AddChunkFormProps> = ({ chunk, preview }) => {
    const { session, openSignIn } = useClerk();

    const [selectedBank, setSelectedBank] = useState<number | null>(null);

    const { closeModal } = useModal();

    React.useEffect(() => {
        if (!session) {
            openSignIn();
        }
    }, [session, openSignIn]);

    const { apiUrl } = useEnvironment();
    const endpoint = `${apiUrl}/math_app/school_document/list/`;
    const { documents, error } = useGetDocuments(endpoint);
    const endpoint2 = `${apiUrl}/math_app/school_document/`;
    const { updateDocument } = useSubmitDocument(endpoint2);

    const selectedDocument = documents?.find((doc) => doc.id === selectedBank);

    const handleDocumentClick = async () => {
        if (selectedBank !== null) {
            const doc = documents?.find(d => d.id === selectedBank);
            if (doc) {
                const updatedDocument: Document = {
                    ...doc,
                    problemChunks: [...(doc.problemChunks || []), chunk],
                };
                await updateDocument({ document: updatedDocument });
                toast(`Added to problem bank: ${updatedDocument.title}`);
                closeModal();
            }
        }
    };

    if (error) {
        return <div>Error loading documents: {(error as unknown as Error).message}</div>;
    }

    return (
        <div className="flex flex-col">
            <label className="text-white mb-2">Select Problem Bank:</label>
            <select
                className="mb-4 text-black p-2"
                value={selectedBank || ''}
                onChange={(e) => setSelectedBank(Number(e.target.value))}
            >
                <option value="" disabled>Select a bank</option>
                {documents?.map((doc) => (
                    <option key={doc.id} value={doc.id}>{doc.title}</option>
                ))}
            </select>
            {selectedDocument && preview && (
                <div className="mb-4">
                    <DocumentPreview disabledClick document={selectedDocument} />
                </div>
            )}
            <button
                className="bg-blue-500 text-white p-2 rounded w-1/2"
                disabled={!selectedBank}
                onClick={handleDocumentClick}
            >
                Add to Selected Bank
            </button>
        </div>
    );
};

export default AddChunkForm;

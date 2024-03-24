import React, { useState } from 'react';
import toast from 'react-hot-toast/headless';
import { useScreenSize } from '../../contexts/ScreenSizeContext';
import { useModal } from '../../contexts/useModal';
import useGetDocuments from '../../hooks/tools/math/useGetDocuments';
import useSubmitDocument from '../../hooks/tools/math/useSubmitDocument';
import useEnvironment from '../../hooks/useEnvironment';
import { useRequireSignIn } from '../../hooks/useRequireSignIn';
import { Chunk, Document } from '../../interfaces';
import DocumentPreview from './DocumentPreview';

interface AddChunkFormProps {
    chunk: Chunk;
    preview?: boolean;
}

const AddChunkForm: React.FC<AddChunkFormProps> = ({ chunk, preview }) => {
    const [selectedBank, setSelectedBank] = useState<number | null>(null);

    const { closeModal } = useModal();

    useRequireSignIn();

    const { apiUrl } = useEnvironment();
    const endpoint = `${apiUrl}/math_app/school_document/list/`;
    const { documents, error } = useGetDocuments(endpoint);
    const endpoint2 = `${apiUrl}/math_app/school_document/`;
    const { updateDocument, submitDocument } = useSubmitDocument(endpoint2);

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
                toast(`Added problem to problem bank: ${updatedDocument.title}`);
                closeModal();
            }
        }
    };

    if (error) {
        return <div>Error loading documents: {(error as unknown as Error).message}</div>;
    }

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
        toast('Created new problem bank...');

    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isDesktop } = useScreenSize();

    return (
        <div className="flex flex-col space-y-4">
            <button onClick={handleAddDocument}
                className="btn btn-accent w-1/2 mb-2">
                Create New Problem Bank
            </button>
            OR
            <label className="text-white">Add To Existing Problem Bank:</label>
            <select
                className="select select-bordered w-full max-w-xs"
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
            <div className='flex flex-row space-x-2'>
                <button
                    className={`btn w-1/2 ${selectedBank ? "btn-primary" : "btn-disabled"}`}
                    disabled={!selectedBank}
                    onClick={handleDocumentClick}
                >
                    Add
                </button>

            </div>
            {!selectedBank && isDesktop && (
                <div id='addChunkModelButtonDisabled' className='tooltip tooltip-bottom' data-tip="Select a problem bank to add this problem to.">
                    {/* Tooltip content could be more interactive with DaisyUI */}
                </div>
            )}
        </div>

    );
};

export default AddChunkForm;

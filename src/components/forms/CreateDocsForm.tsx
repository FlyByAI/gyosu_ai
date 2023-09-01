import React, { useState } from 'react';
import { useSidebarContext } from '../../contexts/useSidebarContext';
import { Chunk, Document, EmptyDocument } from '../../interfaces';
import { notSecretConstants } from '../../constants/notSecretConstants';
import useCreateDocx from '../../hooks/tools/math/useCreateDocs';

type DocxAction = "worksheet" | "quiz" | "exam" | "answer";


interface CreateDocsFormProps {
    document: Document | EmptyDocument;
}

const CreateDocxForm = ({ document }: CreateDocsFormProps) => {
    const [action, setAction] = useState<DocxAction>('worksheet');

    const { activeChunkIndices, setActiveChunkIndices } = useSidebarContext();

    const { createDocx, isLoading } = useCreateDocx(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/generate_docx/`);

    const handleCreate = async () => {
        const selectedChunks = activeChunkIndices.map(index => document.problemChunks?.[index]).filter(Boolean) as Chunk[];
        console.log("create document using", selectedChunks);
        createDocx({ action, chunks: selectedChunks });
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleCreate();
            }}
        >

            <button
                disabled={isLoading}
                type="submit"
                className="mt-2 w-full px-4 py-2 bg-blue-400 border-2 text-white"
            >
                Create Worksheet
            </button>
        </form>
    );
};

export default CreateDocxForm;

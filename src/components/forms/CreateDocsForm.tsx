import React, { useEffect, useState } from 'react';
import { useSidebarContext } from '../../contexts/useSidebarContext';
import { Chunk, Document, EmptyDocument } from '../../interfaces';
import { notSecretConstants } from '../../constants/notSecretConstants';
import useCreateDocx from '../../hooks/tools/math/useCreateDocs';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useParams } from 'react-router-dom';

type DocxAction = "worksheet" | "quiz" | "exam" | "answer";


interface CreateDocsFormProps {
    document: Document | EmptyDocument;
}

const CreateDocxForm = ({ document }: CreateDocsFormProps) => {
    const [action, setAction] = useState<DocxAction>('worksheet');

    const { id } = useParams();

    const { activeChunkIndices, setActiveChunkIndices } = useSidebarContext();

    const { createDocx, isLoading } = useCreateDocx(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/generate_docx/`);

    const handleCreate = async () => {
        const selectedChunks = activeChunkIndices.map(index => document.problemChunks?.[index]).filter(Boolean) as Chunk[];
        console.log("create document using", selectedChunks);
        createDocx({ action, chunks: selectedChunks });
    };

    // reset this on document change, and initial load
    useEffect(() => {
        setActiveChunkIndices([]);
    }, [id, setActiveChunkIndices])

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleCreate();
            }}
        >
            <button
                disabled={isLoading || activeChunkIndices.length === 0}
                type="submit"
                data-tooltip-id={"createWorksheetTip"}
                className={`mt-2 w-full px-4 py-2 bg-blue-400 border-2 text-white ${activeChunkIndices.length === 0 ? " opacity-50 cursor-not-allowed" : ""}`}
            >
                Create Worksheet
            </button>
            <ReactTooltip
                id='createWorksheetTip'
                place="bottom"
                content={activeChunkIndices.length === 0 ? `You must select a problem` : ""} />
        </form>
    );
};

export default CreateDocxForm;

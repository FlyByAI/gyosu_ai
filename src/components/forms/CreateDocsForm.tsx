import React, { useEffect, useState } from 'react';
import { useSidebarContext } from '../../contexts/useSidebarContext';
import { Chunk, Document, EmptyDocument } from '../../interfaces';
import { notSecretConstants } from '../../constants/notSecretConstants';
import useCreateDocx from '../../hooks/tools/math/useCreateDocs';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useParams } from 'react-router-dom';

interface CreateDocsFormProps {
    document: Document | EmptyDocument;
}

const CreateDocxForm: React.FC<CreateDocsFormProps> = ({ document }) => {
    const { activeChunkIndices, setActiveChunkIndices } = useSidebarContext();
    const { createDocx, isLoading } = useCreateDocx(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/generate_docx/`);
    const { id } = useParams();

    // Moved formState and related logic here
    const [formState, setFormState] = useState({
        title: 'My Worksheet',
        persona: "Math Teacher",
        theme: "",
        action: "worksheet"
    });

    // Your local storage logic
    useEffect(() => {
        const savedFormState = localStorage.getItem('formState');
        if (savedFormState) {
            setFormState(JSON.parse(savedFormState));
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('formState', JSON.stringify(formState));
    }, [formState]);

    const handleCreate = async () => {
        const selectedChunks = activeChunkIndices.map(index => document.problemChunks?.[index]).filter(Boolean) as Chunk[];
        createDocx({ chunks: selectedChunks, ...formState });
    };

    useEffect(() => {
        setActiveChunkIndices([]);
    }, [id, setActiveChunkIndices]);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleCreate();
            }}
        >
            <div className="text-xl font-bold mb-2">
                Worksheet Creator
            </div>

            {/* Moved form elements */}
            <div className="my-4">
                <label className="block">Title</label>
                <input
                    type="text"
                    className='bg-gray-600'
                    value={formState.title}
                    onChange={e => setFormState({ ...formState, title: e.target.value })}
                />
            </div>
            <div className="my-4">
                <label className="block">Persona</label>
                <input
                    type="text"
                    className='bg-gray-600'
                    value={formState.persona}
                    onChange={e => setFormState({ ...formState, persona: e.target.value })}
                />
            </div>
            <div className="my-4">
                <label className="block">Theme</label>
                <input
                    type="text"
                    placeholder="Pets, Space, etc."
                    className='bg-gray-600'
                    value={formState.theme}
                    onChange={e => setFormState({ ...formState, theme: e.target.value })}
                />
            </div>
            <hr className="mt-4 py-2 w-full" />

            <button
                disabled={isLoading || activeChunkIndices.length === 0}
                type="submit"
                data-tooltip-id={"createWorksheetTip"}
                className={`mt-2 w-full px-4 py-2 bg-blue-400 border-2 text-white ${activeChunkIndices.length === 0 || isLoading ? " opacity-50 cursor-not-allowed" : ""}`}
            >
                {isLoading ? "Creating..." : "Create Worksheet"}
            </button>
            <ReactTooltip
                id='createWorksheetTip'
                place="bottom"
                content={activeChunkIndices.length === 0 ? `You must select a problem` : ""}
            />
        </form>
    );
};

export default CreateDocxForm;

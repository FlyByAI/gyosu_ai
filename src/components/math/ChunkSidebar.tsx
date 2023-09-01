import { useEffect, useState } from "react";
import { Chunk, Document, EmptyDocument } from "../../interfaces";
import { useSidebarContext } from "../../contexts/useSidebarContext";
import useSubmitChunkSidebarForm, { SubmitChunkSidebarResponse } from "../forms/useSubmitChunkSidebarForm";
import { notSecretConstants } from "../../constants/notSecretConstants";
import { languageNames } from "../../helpers/language";
import useSubmitDocument from "../../hooks/tools/math/useSubmitDocument";
import { useLanguage } from "../../contexts/useLanguage";
import CreateDocxForm from "../forms/CreateDocsForm";

interface ChunkSidebarProps {
    document: Document | EmptyDocument;
}

const ChunkSidebar: React.FC<ChunkSidebarProps> = ({ document }) => {

    const endpoint2 = `${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/school_document/`;
    const { updateDocument } = useSubmitDocument(endpoint2);

    const { activeChunkIndices, setActiveChunkIndices } = useSidebarContext();

    const { submitForm } = useSubmitChunkSidebarForm(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/problem/playground/`);

    const { language } = useLanguage();

    const [formState, setFormState] = useState({
        tone: 'Math Teacher',
        topic: '',
        title: 'My Worksheet',
        gradeLevel: "6",
        language: languageNames[language],
        keepNumbersSame: false,
        keepInstructionsSame: false,
    });


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Populate selectedChunks array using activeChunkIndices
        const selectedChunks = activeChunkIndices.map(index => document.problemChunks?.[index]).filter(Boolean) as Chunk[];

        try {
            const response: SubmitChunkSidebarResponse = await submitForm({
                ...formState,
                chunks: selectedChunks,
            });

            console.log(response)

            console.log("if this is empty document, then we need to udpate the chunks in the mongodb only")
            console.log("if this is a real document, then we need to update the chunks in the mongodb and the document in the postgresql")

        } catch (error) {
            // Handle the error case
            console.error("Form submission failed", error);
        }
    };

    //save form state to local storage
    useEffect(() => {
        const savedFormState = localStorage.getItem('formState');
        if (savedFormState) {
            setFormState(JSON.parse(savedFormState));
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('formState', JSON.stringify(formState));
    }, [formState]);

    const handleDeleteSelected = async () => {
        if (!activeChunkIndices || activeChunkIndices.length === 0) {
            return;
        }

        const userConfirmed = window.confirm('Are you sure you want to delete the selected exercises?');

        if (userConfirmed) {
            deleteChunks(activeChunkIndices);
            setActiveChunkIndices([]);
        }
    };


    const deleteChunks = (indices: number[]) => {
        // Validation for document object
        if (!('id' in document)) {
            return;
        }

        const updatedChunks = [...(document.problemChunks || [])];

        // Sort indices in descending order and remove specified chunks
        indices.sort((a, b) => b - a).forEach(index => {
            updatedChunks.splice(index, 1);
        });

        const updatedDocument = { ...document, problemChunks: updatedChunks };

        // Submit the change, triggering the updateDocument mutation
        updateDocument({ document: updatedDocument });
    };


    return (
        <div className="p-2 fixed right-0 top-16 my-20 w-1/5 me-4 bg-gray-900 transform transition-transform duration-1000">
            <div className="h-5/6 bg-blue-900 p-4 text-white overflow-y-auto max-h-[90vh]">
                <div className="text-xl font-bold mb-2">
                    Worksheet Creator
                </div>
                <div className="my-4">
                    <label className="block">Title</label>
                    <input
                        type="text"
                        // placeholder="My worksheet"
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
                        value={formState.tone}
                        onChange={e => setFormState({ ...formState, tone: e.target.value })}
                    />
                </div>
                <div className="my-4">
                    <label className="block">Theme</label>
                    <input
                        type="text"
                        placeholder="Aviation, Space, etc."
                        className='bg-gray-600'
                        value={formState.topic}
                        onChange={e => setFormState({ ...formState, topic: e.target.value })}
                    />
                </div>

                <hr className="mt-4 py-2 w-full" />
                <CreateDocxForm document={document} />
            </div>
        </div >
    );
};

export default ChunkSidebar;

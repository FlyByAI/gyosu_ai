import { useEffect, useState } from "react";
import { Chunk, Document, EmptyDocument } from "../../interfaces";
import { useSidebarContext } from "../../contexts/useSidebarContext";
import useSubmitChunkSidebarForm, { SubmitChunkSidebarResponse } from "../forms/useSubmitChunkSidebarForm";
import { notSecretConstants } from "../../constants/notSecretConstants";
import { languageNames } from "../../helpers/language";
import useSubmitDocument from "../../hooks/tools/math/useSubmitDocument";
import { useLanguage } from "../../contexts/useLanguage";

interface ChunkSidebarProps {
    document: Document | EmptyDocument;
}

const ChunkSidebar: React.FC<ChunkSidebarProps> = ({ document }) => {

    const endpoint2 = `${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/school_document/`;
    const { updateDocument } = useSubmitDocument(endpoint2);

    const { activeChunkIndices, setActiveChunkIndices } = useSidebarContext();

    const { submitForm } = useSubmitChunkSidebarForm(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/problem/playground/`);

    const { language } = useLanguage();

    const options = { language: languageNames[language] };

    const [formState, setFormState] = useState({
        tone: 'professional',
        topic: '',
        gradeLevel: '',
        form_language: languageNames[language],
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
        // Validation for selected chunks, assuming you have activeChunkIndices array
        if (!activeChunkIndices || activeChunkIndices.length === 0) {
            return;
        }

        deleteChunks(activeChunkIndices);
        setActiveChunkIndices([]);
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
        <div className="p-2 fixed right-0 top-0 my-20 w-1/6 bg-gray-900 transform transition-transform duration-1000">
            <div className="p-2 bg-gray-800">
                <div className="h-5/6 bg-gray-700 p-4 text-white">
                    {/* Form */}
                    selected: {activeChunkIndices.map((index) => {
                        return index.toString()
                    }).sort().length}
                    <form onSubmit={handleSubmit}>
                        <div className="my-4">
                            <label className="block">Tone</label>
                            <input
                                type="text"
                                className='bg-gray-600'
                                value={formState.tone}
                                onChange={e => setFormState({ ...formState, tone: e.target.value })}
                            />
                        </div>
                        <div className="my-4">
                            <label className="block">Language</label>
                            <select
                                value={formState.form_language}
                                onChange={e => setFormState({ ...formState, form_language: e.target.value })}
                                className='bg-gray-600'
                            >
                                {Object.entries(languageNames).map(([code, name]) => (
                                    <option value={code} key={code}>{name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="my-4">
                            <label className="block">Topic</label>
                            <input
                                type="text"
                                className='bg-gray-600'
                                value={formState.topic}
                                onChange={e => setFormState({ ...formState, topic: e.target.value })}
                            />
                        </div>
                        <div className="my-4">
                            <label className="cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={formState.keepNumbersSame}
                                    onChange={e => setFormState({ ...formState, keepNumbersSame: e.target.checked })}
                                />
                                Keep Numbers Same
                            </label>
                        </div>

                        <div className="my-4">
                            <label className="cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={formState.keepInstructionsSame}
                                    onChange={e => setFormState({ ...formState, keepInstructionsSame: e.target.checked })}
                                />
                                Keep Instructions Same
                            </label>
                        </div>

                        <div className="my-4">
                            <label className="block">Grade Level</label>
                            <input
                                type="range"
                                min="1"
                                max="12"
                                className='bg-gray-600'
                                value={formState.gradeLevel}
                                onChange={e => setFormState({ ...formState, gradeLevel: e.target.value })}
                            />
                            <span className="ml-2">{formState.gradeLevel}</span>
                        </div>
                        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white">
                            Submit
                        </button>
                        <button onClick={() => setActiveChunkIndices([])} className="mt-4 px-4 py-2 ms-2 bg-red-400 text-white">
                            Cancel
                        </button>
                    </form>

                    <button onClick={handleDeleteSelected} className="mt-10 px-4 py-2 ms-2 bg-gray-600 border-red-500 border-2 text-white">
                        Delete Selected
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChunkSidebar;

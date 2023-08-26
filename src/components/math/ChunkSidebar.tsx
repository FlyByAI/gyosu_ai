import { useEffect, useState } from "react";
import { Chunk, Document } from "../../interfaces";
import { useSidebarContext } from "../../contexts/useSidebarContext";
import useSubmitChunkSidebarForm, { SubmitChunkSidebarResponse } from "../forms/useSubmitChunkSidebarForm";
import { notSecretConstants } from "../../constants/notSecretConstants";
import { languageNames } from "../../helpers/language";

interface ChunkSidebarProps {
    document: Document;
}

const ChunkSidebar: React.FC<ChunkSidebarProps> = ({ document }) => {


    const { activeChunkIndices } = useSidebarContext();

    const { submitForm } = useSubmitChunkSidebarForm(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/problem/playground/`);

    const [formState, setFormState] = useState({
        tone: 'professional',
        topic: '',
        gradeLevel: '',
        language: 'english',
        keepNumbersSame: false,
        keepInstructionsSame: false,
    });


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Form Submitted for multiple chunks", formState);

        // Populate selectedChunks array using activeChunkIndices
        const selectedChunks = activeChunkIndices.map(index => document.problemChunks?.[index]).filter(Boolean) as Chunk[];

        // try {
        //     const response: SubmitChunkSidebarResponse = await submitForm({
        //         ...formState,
        //         chunks: selectedChunks,
        //     });

        //     console.log(response)

        // } catch (error) {
        //     // Handle the error case
        //     console.error("Form submission failed", error);
        // }
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



    return (
        <div className="fixed right-0 top-0 h-screen w-1/4 bg-gray-900 transform transition-transform duration-1000">
            <div className="h-screen bg-gray-700 m-2 p-2 text-white">
                {/* Form */}
                selected: {activeChunkIndices.map((index) => {
                    return index.toString()
                }).sort().join(", ")}
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
                            value={formState.language}
                            onChange={e => setFormState({ ...formState, language: e.target.value })}
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
                    <button className="mt-4 px-4 py-2 ms-2 bg-red-400 text-white">
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChunkSidebar;

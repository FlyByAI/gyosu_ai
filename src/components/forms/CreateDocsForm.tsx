import React, { useEffect, useState } from 'react';
import { useSidebarContext } from '../../contexts/useSidebarContext';
import { Chunk, Document, EmptyDocument } from '../../interfaces';
import useCreateDocx, { DocxAction } from '../../hooks/tools/math/useCreateDocs';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useParams } from 'react-router-dom';
import useEnvironment from '../../hooks/useEnvironment';
import toast from 'react-hot-toast/headless';
import Feedback from '../Feedback';
import { useScreenSize } from '../../contexts/ScreenSizeContext';

interface CreateDocsFormProps {
    document: Document | EmptyDocument;
}

const CreateDocxForm: React.FC<CreateDocsFormProps> = ({ document }) => {
    const { activeChunkIndices, setActiveChunkIndices } = useSidebarContext();
    const { apiUrl } = useEnvironment();
    const { createDocx, isLoading, error } = useCreateDocx(`${apiUrl}/math_app/generate_docx/`);
    const { id } = useParams();

    const [downloadLinks, setDownloadLinks] = useState<{ docxUrl: string; pdfUrl: string; fileName: string, answerKeyUrl?: string; } | null>(null);

    // Moved formState and related logic here
    const [formState, setFormState] = useState({
        title: 'My Worksheet',
        persona: "Math Teacher",
        theme: "",
        action: "worksheet" as DocxAction,
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

    const handleCreate = (event: React.FormEvent) => {
        const nativeEvent = event.nativeEvent as MouseEvent;
        toast("Creating worksheet... This may take up to 1 minute to complete.");
        setDownloadLinks(null);  // Reset download links
        const selectedChunks = activeChunkIndices.map(index => document.problemChunks?.[index]).filter(Boolean) as Chunk[];
        createDocx({ chunks: selectedChunks, ...formState }, {
            onSuccess: (data) => {
                setDownloadLinks(data); // Store download links in state
            }
        });
    };

    const { isDesktop } = useScreenSize();

    return (
        <>
            <form className='overflow-y-auto' onSubmit={(e) => {
                e.preventDefault();
                handleCreate(e);
            }}
            >
                <div className='flex flex-row justify-between items-center mb-2'>
                    <div className="text-xl font-bold w-64">
                        Worksheet Creator
                    </div>
                    <Feedback feedbackLabel={'Create Worksheet Feedback'} data={undefined} responseQuestions={["Please tell us what we can do better. "]} />
                </div>
                <div className="text-md mb-2">
                    <p className="font-bold">Fill in the details below:</p>
                </div>

                {/* Moved form elements */}
                <div className="my-2">
                    <label className="block">Title</label>
                    <input
                        type="text"
                        className='bg-gray-800 p-1 ps-2 mt-1'
                        value={formState.title}
                        onChange={e => setFormState({ ...formState, title: e.target.value })}
                    />
                </div>
                <div className="my-2">
                    <label className="block">Persona (for Real-World Application section at the top)</label>
                    <input
                        type="text"
                        className='bg-gray-800 p-1 ps-2 mt-1'
                        value={formState.persona}
                        onChange={e => setFormState({ ...formState, persona: e.target.value })}
                    />
                </div>
                <div className="my-2">
                    <label className="block">Theme (for Real-World Application section at the top)</label>
                    <input
                        type="text"
                        placeholder="Pets, Space, etc."
                        className='bg-gray-800 p-1 ps-2 mt-1'
                        value={formState.theme}
                        onChange={e => setFormState({ ...formState, theme: e.target.value })}
                    />
                </div>
                <hr className="mt-4 py-2 w-full" />

                <button
                    disabled={isLoading || activeChunkIndices.length === 0}
                    type="submit"
                    data-tooltip-id={"createWorksheetTip"}
                    className={`mt-2 w-full px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded-md border-2 text-white ${activeChunkIndices.length === 0 || isLoading ? " opacity-50" : ""}`}
                >
                    {isLoading ? "Creating..." : "Create Worksheet"}
                </button>
                {!isLoading && error && (
                    <div className="mt-4 text-red-500">
                        {`Error: ${error.message}`}
                    </div>
                )}
                {isDesktop && <ReactTooltip
                    id='createWorksheetTip'
                    place="bottom"
                    content={activeChunkIndices.length === 0 ? `You must select a problem` : ""}
                />}
            </form>

            {/* Download buttons */}
            {!isLoading && downloadLinks && (
                <>
                    <p className='mt-4'>Note: Problems sometimes will not show in chrome on mobile.</p>
                    <p>We recommend opening in Word or Google Docs to view.</p>
                    <div className="inline-flex space-x-2 mt-4">
                        <button onClick={() => window.open(downloadLinks.docxUrl, '_blank')} className="p-2 bg-green-700 rounded-md w-1/2">
                            Download DOCX
                        </button>
                        <button onClick={() => window.open(downloadLinks.pdfUrl, '_blank')} className="p-2 bg-green-700 rounded-md w-1/2">
                            Download PDF
                        </button>
                        <button onClick={() => window.open(downloadLinks.answerKeyUrl, '_blank')} className="p-2 text-black bg-yellow-500 rounded-md w-1/2">
                            Download Answer Key
                        </button>
                    </div>
                </>

            )}
        </>
    );

};

export default CreateDocxForm;

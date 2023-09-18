import React, { useEffect, useState } from 'react';
import { useSidebarContext } from '../../contexts/useSidebarContext';
import { Chunk, Document, EmptyDocument } from '../../interfaces';
import useCreateDocx, { DocxAction } from '../../hooks/tools/math/useCreateDocs';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useParams } from 'react-router-dom';
import useEnvironment from '../../hooks/useEnvironment';
import toast from 'react-hot-toast/headless';

interface CreateDocsFormProps {
    document: Document | EmptyDocument;
}

const CreateDocxForm: React.FC<CreateDocsFormProps> = ({ document }) => {
    const { activeChunkIndices, setActiveChunkIndices } = useSidebarContext();
    const { apiUrl } = useEnvironment();
    const { createDocx, isLoading } = useCreateDocx(`${apiUrl}/math_app/generate_docx/`);
    const { id } = useParams();

    const [downloadLinks, setDownloadLinks] = useState<{ docxUrl: string; pdfUrl: string; fileName: string } | null>(null);

    // Moved formState and related logic here
    const [formState, setFormState] = useState({
        title: 'My Worksheet',
        persona: "Math Teacher",
        theme: "",
        action: "worksheet" as DocxAction
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

    const handleCreate = () => {
        toast("Creating worksheet... This may take up to 1 minute to complete.")
        setDownloadLinks(null);  // Reset download links
        const selectedChunks = activeChunkIndices.map(index => document.problemChunks?.[index]).filter(Boolean) as Chunk[];
        createDocx({ chunks: selectedChunks, ...formState }, {
            onSuccess: (data) => {
                setDownloadLinks(data); // Store download links in state
            }
        });
    };

    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleCreate();
            }}
            >
                <div className="text-xl font-bold mb-2">
                    Worksheet Creator
                </div>

                <div className="text-l mb-2">
                    <p>Select problems to include in your worksheet. After selecting, click "Create Worksheet" to generate a DOCX and PDF file.</p>
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
                    className={`mt-2 w-64 px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded-md border-2 text-white ${activeChunkIndices.length === 0 || isLoading ? " opacity-50" : ""}`}
                >
                    {isLoading ? "Creating..." : "Create Worksheet"}
                </button>
                <ReactTooltip
                    id='createWorksheetTip'
                    place="bottom"
                    content={activeChunkIndices.length === 0 ? `You must select a problem` : ""}
                />
            </form>

            {/* Download buttons */}
            {!isLoading && downloadLinks && (
                <>
                    <button onClick={() => window.open(downloadLinks.docxUrl, '_blank')} className="p-2 bg-green-700 mt-4 rounded-md w-1/3">
                        Download DOCX
                    </button>
                    <button onClick={() => window.open(downloadLinks.pdfUrl, '_blank')} className="ms-2 p-2 bg-green-700 mt-4 rounded-md w-1/3">
                        Download PDF
                    </button>
                </>
            )}
        </div>
    );

};

export default CreateDocxForm;

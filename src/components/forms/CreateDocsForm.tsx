import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast/headless';
import { Link, useParams } from 'react-router-dom';
import { useScreenSize } from '../../contexts/ScreenSizeContext';
import { useSidebarContext } from '../../contexts/useSidebarContext';
import useCreateDocx, { DocxAction } from '../../hooks/tools/math/useCreateDocs';
import useEnvironment from '../../hooks/useEnvironment';
import { Chunk, Document, EmptyDocument } from '../../interfaces';
import Feedback from '../Feedback';

interface CreateDocsFormProps {
    document: Document | EmptyDocument;
}

const CreateDocxForm: React.FC<CreateDocsFormProps> = ({ document }) => {
    const { activeChunkIndices } = useSidebarContext();
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
        <form className="overflow-y-auto" onSubmit={(e) => {
            e.preventDefault();
            handleCreate(e);
        }}>
            <div className="flex flex-row justify-between items-center mb-2">
                <div className="text-xl font-bold w-64">
                    Worksheet Creator
                </div>
                {/* Feedback component remains unchanged as it likely has custom implementation */}
                <Feedback feedbackLabel={'Create Worksheet Feedback'} data={undefined} responseQuestions={["Please tell us what we can do better. "]} />
            </div>
            <div className="text-md mb-2">
                <p className="font-bold">Fill in the details below:</p>
            </div>
      
            {/* Form inputs with DaisyUI classes */}
            <div className="form-control my-2">
                <label className="label">
                    <span className="label-text">Title</span>
                </label>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    value={formState.title}
                    onChange={e => setFormState({ ...formState, title: e.target.value })}
                />
            </div>
            <div className="form-control my-2">
                <label className="label">
                    <span className="label-text">Persona (for Real-World Application section at the top)</span>
                </label>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    value={formState.persona}
                    onChange={e => setFormState({ ...formState, persona: e.target.value })}
                />
            </div>
            <div className="form-control my-2">
                <label className="label">
                    <span className="label-text">Theme (for Real-World Application section at the top)</span>
                </label>
                <input
                    type="text"
                    placeholder="Pets, Space, etc."
                    className="input input-bordered w-full"
                    value={formState.theme}
                    onChange={e => setFormState({ ...formState, theme: e.target.value })}
                />
            </div>
            <hr className="my-4" />
      
            {/* Submit button with DaisyUI classes */}
            <button
                disabled={isLoading || activeChunkIndices.length === 0}
                type="submit"
                className={`btn btn-primary mt-2 w-full ${activeChunkIndices.length === 0 || isLoading ? "btn-disabled" : ""}`}
            >
                {isLoading ? "Creating..." : "Create Worksheet"}
            </button>
            {!isLoading && error && (
                <div className="alert alert-error mt-4">
                    {error.message === "An unexpected error occurred." ?
                        <p>This operation is taking a while. No worries, check back in a minute or two here: <Link className="link link-primary" to="/math-app/documents">My Documents</Link></p>
                        : `Error: ${error.message}`
                    }
                </div>
            )}
      
            {/* Download buttons section */}
            {!isLoading && downloadLinks && (
                <>
                    <p className="mt-2">Your document is ready!</p>
                    <div className="flex space-x-2 mt-2">
                        <button onClick={() => window.open(downloadLinks.docxUrl, '_blank')} className="btn btn-success flex-1">
                            Download Docx
                        </button>
                        <button onClick={() => window.open(downloadLinks.pdfUrl, '_blank')} className="btn btn-success flex-1">
                            Download PDF
                        </button>
                        <button onClick={() => window.open(downloadLinks.answerKeyUrl, '_blank')} className="btn btn-warning flex-1">
                            Answer Key
                        </button>
                    </div>
                    <p className="mt-2">Previously created documents: <Link className="link link-primary" to="/math-app/documents">My Documents</Link></p>
                    <p className="mt-2">Note: Problems sometimes will not show in chrome on mobile. We recommend opening in Word or Google Docs to view.</p>
                </>
            )}
        </form>
      </>
      
    );

};

export default CreateDocxForm;

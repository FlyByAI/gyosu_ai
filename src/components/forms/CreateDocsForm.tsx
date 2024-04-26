import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast/headless';
import { Link, useParams } from 'react-router-dom';
import { useScreenSize } from '../../contexts/ScreenSizeContext';
import useCreateDocx, { DocxAction } from '../../hooks/tools/math/useCreateDocs';
import useEnvironment from '../../hooks/useEnvironment';
import { Document, EmptyDocument } from '../../interfaces';
import Feedback from '../Feedback';

interface CreateDocsFormProps {
    document: Document | EmptyDocument;
}

const CreateDocxForm: React.FC<CreateDocsFormProps> = ({ document }) => {
    const { mathAppApiUrl } = useEnvironment();
    const { createDocx, isLoading, error } = useCreateDocx(`${mathAppApiUrl}/generate_docx/`);
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
        if (document.problemChunks === undefined) {
            toast("No problems to export.", { icon: "🤔" })
            return; // Do nothing if there are no problem chunks
        }
        createDocx({ chunks: document?.problemChunks, ...formState }, {
            onSuccess: (data) => {
                setDownloadLinks(data); // Store download links in state
            }
        });
    };

    const { isDesktop } = useScreenSize();

    return (
        <>

            <div className="flex flex-row justify-between items-center mb-2">
                <div className="text-xl font-bold w-64">
                    Export Problems
                </div>
                {/* Feedback component remains unchanged as it likely has custom implementation */}
                <Feedback feedbackLabel={'Create Worksheet Feedback'} data={undefined} responseQuestions={["Please tell us what we can do better. "]} />
            </div>
            <hr className="my-4" />

            {/* Submit button with DaisyUI classes */}
            <button
                onClick={handleCreate}
                className={`btn btn-primary mt-2 w-full ${isLoading ? "btn-disabled" : ""}`}
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
                        <button disabled={downloadLinks.answerKeyUrl == "None" || downloadLinks.answerKeyUrl == ""} onClick={() => window.open(downloadLinks.answerKeyUrl, '_blank')} className="btn btn-warning flex-1">
                            Answer Key
                        </button>
                    </div>
                    <p className="mt-2">Previously created documents: <Link className="link link-primary" to="/math-app/documents">My Documents</Link></p>
                    <p className="mt-2">Note: Problems sometimes will not show in chrome on mobile. We recommend opening in Word or Google Docs to view.</p>
                </>
            )}
        </>

    );

};

export default CreateDocxForm;

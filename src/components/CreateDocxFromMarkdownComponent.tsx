import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useEnvironment from '../hooks/useEnvironment';
import toast from 'react-hot-toast/headless';
import PdfSVG from '../svg/PdfSVG';
import DocxSVG from '../svg/DocxSVG';
import useCreateDocxFromMarkdown from '../hooks/tools/math/useCreateDocsFromMarkdown';

interface CreateDocsFromMarkdownComponentProps {
    markdown: string;
}

const CreateDocsFromMarkdownComponent = ({ markdown }: CreateDocsFromMarkdownComponentProps) => {
    const { apiUrl } = useEnvironment();
    const { createDocx, isLoading, error } = useCreateDocxFromMarkdown(`${apiUrl}/math_app/convert_markdown/`);

    const [downloadLinks, setDownloadLinks] = useState<{ docxUrl: string; pdfUrl: string; fileName: string, answerKeyUrl?: string; } | null>(null);

    const handleCreate = (event: React.FormEvent) => {
        event.preventDefault();
        toast("Creating document... This may take up to 1 minute to complete.");
        setDownloadLinks(null); // Reset download links

        createDocx({ markdown: markdown }, {
            onSuccess: (data) => {
                setDownloadLinks(data); // Store download links in state
            }
        });
    };

    return (
        <div className='flex justify-center my-4'>
            {/* Render error message if any */}
            {error && <p>Error: {error.message}</p>}

            {markdown && ( // If there's markdown content available
                <button onClick={handleCreate} className="p-2 bg-blue-500 text-white rounded-md">
                    Create Document
                </button>
            )}

            {!isLoading && downloadLinks && (
                <>
                    <p className='mt-2'>Your document is ready!</p>
                    <div className="inline-flex space-x-2 mt-2">
                        <button onClick={() => window.open(downloadLinks.docxUrl, '_blank')} className="p-2 bg-green-600 hover:bg-green-700 rounded-md w-1/3 flex flex-row">
                            <span className='flex flex-row me-4'>Download Docx</span><span className='py-1 bg-white rounded-md'><DocxSVG height="40px" width="40px" color="#0167b3" /></span>
                        </button>
                        <button onClick={() => window.open(downloadLinks.pdfUrl, '_blank')} className="p-2 bg-green-600 hover:bg-green-700 rounded-md w-1/3 flex flex-row">
                            <span className='flex flex-row me-4'>Download PDF</span><span className='py-1 bg-white rounded-md'><PdfSVG height="40px" width="40px" color="#ff1510" /></span>
                        </button>
                        {downloadLinks.answerKeyUrl ? (
                            <button onClick={() => window.open(downloadLinks.answerKeyUrl, '_blank')} className="p-2 text-black bg-yellow-400 hover:bg-yellow-500 rounded-md w-1/3 flex flex-row">
                                <span className='flex flex-row me-4'>Answer Key</span><span className='py-1 bg-white rounded-md'><PdfSVG height="40px" width="40px" color="#ebb305" /></span>
                            </button>
                        ) : "Answer Key Not Available"}
                    </div>
                    <p className='mt-2'>Previously created documents: <Link className="text-blue-400 font-bold" to="/math-app/documents">My Documents</Link></p>
                    <p className='mt-2'>Note: Problems sometimes will not show in chrome on mobile. We recommend opening in Word or Google Docs to view.</p>
                </>
            )}

            {/* Maybe include a loading indicator here */}
            {isLoading && <p>Loading...</p>}
        </div>
    );
};

export default CreateDocsFromMarkdownComponent;

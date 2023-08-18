import React, { useState } from 'react';
import PrintResult from './PrintResult';
import SaveMarkdownDocument from './SaveMarkdownDocument';
import { MathFormData } from '../../hooks/tools/math/useSubmitMathForm';
import MathMarkdown from '../MathMarkdown';
import PublishMarkdownDocument from './PublishMarkdownDocument';


interface DocumentExportProps {
    markdown: string;
    divPrintId: string;
    saved: boolean;
    setSaved: React.Dispatch<React.SetStateAction<boolean>>;
    formData: MathFormData;
    setDocumentId: React.Dispatch<React.SetStateAction<number | undefined>>;
    documentId?: number;
    setMarkdown: React.Dispatch<React.SetStateAction<string>>;
}


const DocumentExport: React.FC<DocumentExportProps> = ({ markdown, divPrintId, saved, setSaved, formData, documentId, setDocumentId, setMarkdown }) => {

    const handleBack = () => {
        if (!saved && window.confirm('You have unsaved changes! Do you really want to leave?')) {
            setMarkdown("");
        }
        if (saved) {
            setMarkdown("");
        }
    }

    return (<>

        {/* {markdown && <MathMarkdown markdown={markdown} />} */}
        <div className="flex flex-row mr-2 relative items-end dark:text-gray-300 justify-between mb-4">
            <button onClick={handleBack} className="ml-2 px-3 py-2 bg-blue-700 text-white rounded">Back</button>
            <div className="flex items-center">
                <label className="flex items-center">
                    <PublishMarkdownDocument markdown={markdown} saved={saved} setSaved={setSaved} formData={formData} documentId={documentId} setDocumentId={setDocumentId} shared={true} />
                </label>
                <div className="group relative">
                    <SaveMarkdownDocument markdown={markdown} saved={saved} setSaved={setSaved} formData={formData} documentId={documentId} setDocumentId={setDocumentId} />
                </div>
                {/* export to doc will go here */}
                <div className="group relative">
                    <PrintResult divPrintId={divPrintId} />
                </div>
            </div>
        </div>

    </>);
};

export default DocumentExport;

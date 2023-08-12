import React, { useState } from 'react';
import PrintResult from './PrintResult';
import SaveMarkdownDocument from './SaveMarkdownDocument';
import { MathFormData } from '../../hooks/tools/math/useSubmitMathForm';
import MathMarkdown from '../MathMarkdown';


interface DocumentExportProps {
    markdown: string;
    divPrintId: string;
    saved: boolean;
    setSaved: React.Dispatch<React.SetStateAction<boolean>>;
    formData: MathFormData;
    setDocumentId: React.Dispatch<React.SetStateAction<number | undefined>>;
    documentId?: number;
    setMarkdown: React.Dispatch<React.SetStateAction<string>>;
    setShared: React.Dispatch<React.SetStateAction<boolean>>;
    setDocumentName: React.Dispatch<React.SetStateAction<string>>;
}


const DocumentExport: React.FC<DocumentExportProps> = ({ setShared, setDocumentName, markdown, divPrintId, saved, setSaved, formData, documentId, setDocumentId, setMarkdown }) => {

    const handleBack = () => {
        setMarkdown("");
    }

    const handleChangeShared = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShared(event.target.checked);
    };

    const handleDocumentNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDocumentName(event.target.value);
    };

    return (<>

        {markdown && <MathMarkdown markdown={markdown} />}
        <div className="flex flex-row mr-2 relative items-end dark:text-gray-300 justify-between mb-4">
            <button onClick={handleBack} className="ml-2 px-3 py-2 bg-blue-700 text-white rounded">Back</button>
            <label className="flex items-center mr-2">
                <input
                    type="text"
                    value={formData.documentName}
                    onChange={handleDocumentNameChange} // Function to handle the change
                    className="w-96 h-10 text-lg form-input ml-2 bg-transparent border-none focus:ring-2 focus:ring-blue-600 focus:bg-gray-900"
                />
            </label>
            <div className="flex items-center">
                {/* <label className="flex items-center">
                    <input
                        type="checkbox"
                        onChange={handleChangeShared}
                        className="form-checkbox h-5 w-5 text-blue-600 mr-2"
                    />
                    <span className="text-gray-300 pr-2">Shared</span>
                </label> */}
                <div className="group mr-4 relative">
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

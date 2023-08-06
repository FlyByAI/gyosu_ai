import React, { useEffect } from 'react';
import { notSecretConstants } from '../../constants/notSecretConstants';
import SaveIcon from '../../svg/SaveIcon';
import { MathFormData } from '../../hooks/tools/math/useSubmitMathForm';
import useSubmitDocument from '../../hooks/tools/math/useSubmitDocument';

interface SaveMarkdownDocumentProps {
    markdown: string;
    setSaved: React.Dispatch<React.SetStateAction<boolean>>;
    saved: boolean;
    formData: MathFormData
    setDocumentId: React.Dispatch<React.SetStateAction<number | undefined>>;
    documentId?: number;
}

const SaveMarkdownDocument: React.FC<SaveMarkdownDocumentProps> = ({ markdown, saved, setSaved, formData, documentId, setDocumentId }) => {
    const { submitDocument, isLoading, error, data } = useSubmitDocument(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/document/save/`);

    useEffect(() => {
        setSaved(false);
    }, [markdown, setSaved]);

    const handleClick = async () => {
        if (documentId) {
            submitDocument({ markdown: markdown, formData: { ...formData, id: documentId } });
        } else {
            submitDocument({ markdown: markdown, formData: formData });
        }
    }

    useEffect(() => {
        if (data?.id) {
            setDocumentId(data.id);
        }
    }, [documentId, setDocumentId, data])

    useEffect(() => {
        setSaved(true)

        setTimeout(() => {
            setSaved(false);
        }, 5000);

    }, [setSaved, data])

    return (
        <div className='flex items-start relative'>
            {saved && (
                <p className="absolute left-5 me-2 bg-gray-900 text-green-300 animate-fade-out">Saved!</p>
            )}
            {error && (
                <p className="absolute left-0 me-2 bg-gray-900 text-red-500 animate-fade-out">Error: {error}</p>
            )}
            <div className='flex items-center'>

                <button
                    onClick={handleClick}
                    disabled={isLoading}
                    className="text-white bg-blue-700 rounded p-2 w-auto flex font-bold mr-4"
                >
                    {isLoading && <p className='me-2 w-12 hidden md:block'>Saving</p>}
                    {saved && !isLoading && <p className='me-2 w-12 hidden md:block'>Saved </p>}
                    {!saved && !isLoading && <p className='me-2 w-12 hidden md:block'>Save </p>}
                    <SaveIcon />
                </button>
            </div>
        </div>

    );
};

export default SaveMarkdownDocument;

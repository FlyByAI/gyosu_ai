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

    return (
        <div>
            <button
                onClick={handleClick}
                disabled={isLoading}
                className="text-white bg-blue-700 rounded-xl p-2 w-auto flex font-bold mr-4"
            >
                {isLoading && <p className='me-2 w-12'>Saving</p>}
                {saved && !isLoading && <p className='me-2 w-12'>Saved </p>}
                {!saved && !isLoading && <p className='me-2 w-12'>Save </p>}
                <SaveIcon />
            </button>
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default SaveMarkdownDocument;

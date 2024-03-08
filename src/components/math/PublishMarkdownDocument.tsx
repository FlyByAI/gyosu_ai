import React, { useEffect } from 'react';
import useSubmitDocument from '../../hooks/tools/math/useSubmitDocument';
import { MathFormData } from '../../hooks/tools/math/useSubmitMathForm';
import useEnvironment from '../../hooks/useEnvironment';
import ViewIcon from '../../svg/ViewIcon';

interface PublishMarkdownDocumentProps {
    markdown: string;
    setSaved: React.Dispatch<React.SetStateAction<boolean>>;
    saved: boolean;
    formData: MathFormData
    setDocumentId: React.Dispatch<React.SetStateAction<number | undefined>>;
    documentId?: number;
    shared?: boolean;
}

const PublishMarkdownDocument: React.FC<PublishMarkdownDocumentProps> = ({ markdown, saved, setSaved, formData, documentId, setDocumentId }) => {
    const { apiUrl } = useEnvironment();
    const { isLoading, error, data } = useSubmitDocument(`${apiUrl}/math_app/document/save/`);

    useEffect(() => {
        setSaved(false);
    }, [markdown, setSaved]);

    const handleClick = async () => {
        console.log(formData)
        // if (documentId) {
        //     submitDocument({  formData: { ...formData, id: documentId, shared: true } });
        // } else {
        //     submitDocument({  formData: { ...formData, shared: true } });
        // }
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
                <p className="absolute left-5 me-2 bg-gray-900 text-green-300 animate-fade-out">Published!</p>
            )}
            {error && (
                <p className="absolute left-0 me-2 bg-gray-900 text-red-500 animate-fade-out">Error: {error.message}</p>
            )}
            <div className='flex items-center'>

                <button
                    onClick={handleClick}
                    disabled={isLoading}
                    className="text-gray-300 bg-blue-700 rounded p-2 w-auto flex font-bold mr-4"
                >
                    {isLoading && <p className='me-2 w-20 hidden md:block'>Publishing</p>}
                    {saved && !isLoading && <p className='me-2 w-20 hidden md:block'>Published </p>}
                    {!saved && !isLoading && <p className='me-2 w-20 hidden md:block'>Publish </p>}
                    <ViewIcon />
                </button>
            </div>
        </div>

    );
};

export default PublishMarkdownDocument;

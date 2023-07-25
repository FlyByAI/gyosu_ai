import React, { useEffect } from 'react';
import useSubmitText from '../../hooks/tools/useSubmitText';
import { notSecretConstants } from '../../constants/notSecretConstants';
import SaveIcon from '../../svg/SaveIcon';

interface SaveMarkdownProps {
    markdown: string;
    setSaved: React.Dispatch<React.SetStateAction<boolean>>;
    saved: boolean;
}

const SaveMarkdown: React.FC<SaveMarkdownProps> = ({ markdown, saved, setSaved }) => {
    const { submitText, isLoading, error } = useSubmitText(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/problem/save/`);

    const handleClick = async () => {
        await submitText(markdown);
        setSaved(true);
    };

    useEffect(() => {
        setSaved(false);
    }, [markdown, setSaved]);

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

export default SaveMarkdown;

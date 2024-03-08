import React, { ReactNode } from "react";

type HighlightedTextProps = {
    children: ReactNode;
    highlightedText: string;
    setHighlightedText: React.Dispatch<React.SetStateAction<string>>;
};

const HighlightedText: React.FC<HighlightedTextProps> = ({ children, highlightedText, setHighlightedText }) => {
    const getSelectionText = () => {
        setTimeout(() => {
            let text = "";
            if (window.getSelection) {
                text = window.getSelection()?.toString() || "";
            }
            setHighlightedText(text);
        }, 0);
    };

    return (
        <div onMouseUp={getSelectionText} onKeyUp={getSelectionText} className="text-gray-300 dark:text-black">
            {children}
            {highlightedText && (
                <div className="text-gray-300">
                    <strong>Selected Text:</strong> {highlightedText}
                </div>
            )}
        </div>
    );
};

export default HighlightedText;

import 'flag-icon-css/css/flag-icons.min.css';
import { useState } from "react";
import { useLanguage } from "../contexts/useLanguage";
import { languageNames } from "../helpers/language";

interface LanguageDropdownProps {
    className?: string;
}

const LanguageDropdown = ({ className }: LanguageDropdownProps) => {
    const { language, setLanguage } = useLanguage();
    const [showOptions, setShowOptions] = useState(false);

    const handleLanguageChange = (lang: string) => {
        setLanguage(lang);
        setShowOptions(false); // Hide options after selection
    };

    return (
        <div className={className + " hidden sm:flex hover:bg-gray-800"}>
            <div className="cursor-pointer" onClick={() => setShowOptions(!showOptions)}>
                Change Language
            </div>
            {showOptions && (
                <div className="absolute bg-gray-900 hover:bg-gray-800 border rounded shadow z-50">
                    {Object.keys(languageNames).map((lang) => (
                        <div
                            key={lang}
                            className="cursor-pointer hover:bg-gray-700 p-2"
                            onClick={() => handleLanguageChange(lang)}
                        >
                            {languageNames[lang]}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageDropdown;

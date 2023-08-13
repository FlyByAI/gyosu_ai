import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';


interface LanguageContextProps {
    language: string;
    setLanguage: React.Dispatch<React.SetStateAction<string>>;
}

interface LanguageProviderProps {
    children: React.ReactNode;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
    // Get the initial language from local storage or fall back to a default language
    const initialLanguage = localStorage.getItem('language') || 'en';

    const [language, setLanguage] = useState<string>(initialLanguage);

    i18n.init({
        lng: language,
    })

    // Set the language in i18n and in local storage whenever it changes
    useEffect(() => {
        if (language !== undefined && i18n.isInitialized) {
            i18n && i18n.changeLanguage(language);
            localStorage.setItem('language', language);
            console.log('Language changed to: ', language)
        }
    }, [language]);


    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

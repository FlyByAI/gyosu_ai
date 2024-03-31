import React, { createContext, useContext, useEffect, useState } from 'react';


interface DarkModeContextValue {
    darkMode: boolean;
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
    SunIcon: () => JSX.Element;
    MoonIcon: () => JSX.Element;
}

interface DarkModeProviderProps {
    children: React.ReactNode;
}

const DarkModeContext = createContext<DarkModeContextValue | undefined>(undefined);

export const useDarkMode = () => {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error(`useDarkMode must be used within a DarkModeProvider`);
    }
    return context;
};

export const DarkModeProvider = ({ children }: DarkModeProviderProps) => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : true;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <DarkModeContext.Provider value={{ darkMode, setDarkMode, SunIcon, MoonIcon }}>
            {children}
        </DarkModeContext.Provider>
    );
};

// SunIcon, MoonIcon as before...

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-yellow-500">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
)

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.22A9 9 0 1111.98 2.981a7 7 0 009.02 9.24z" />
    </svg>
)

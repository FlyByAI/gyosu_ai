import React, { createContext, useContext, useEffect, useState } from 'react';

interface SidebarContextType {
    activeChunkIndices: number[];
    setActiveChunkIndices: React.Dispatch<React.SetStateAction<number[]>>;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export const useSidebarContext = () => {

    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebarContext must be used within SidebarProvider');
    }
    return context;
};


export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeChunkIndices, setActiveChunkIndices] = useState<number[]>([]);

    useEffect(() => {
        const handleEscapePress = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && activeChunkIndices.length > 0) {
                setActiveChunkIndices([]);
            }
        };

        document.addEventListener('keydown', handleEscapePress);

        return () => {
            document.removeEventListener('keydown', handleEscapePress);
        };
    }, [activeChunkIndices, setActiveChunkIndices]);


    return (
        <SidebarContext.Provider value={{ activeChunkIndices, setActiveChunkIndices }}>
            {children}
        </SidebarContext.Provider>
    );
};

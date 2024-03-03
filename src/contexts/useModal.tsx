import React, { createContext, useContext, useEffect, useState } from "react";

interface ModalContextProps {
    currentModal: string | null;
    modalContent: React.ReactNode;
    openModal: (id: string, content: React.ReactNode) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextProps | null>(null);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentModal, setCurrentModal] = useState<string | null>(null);
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);


    useEffect(() => {
        const handleDocumentKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };

        document.addEventListener('keydown', handleDocumentKeyDown);
    
        return () => {
            document.removeEventListener('keydown', handleDocumentKeyDown);
        };
    }, []);


    const openModal = (id: string, content: React.ReactNode) => {
        setCurrentModal(id);
        setModalContent(content);
    };

    const closeModal = () => {
        setCurrentModal(null);
        setModalContent(null);
    };

    return (
        <ModalContext.Provider value={{ currentModal, modalContent, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
};


export const useModal = (): ModalContextProps => {
    

    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};

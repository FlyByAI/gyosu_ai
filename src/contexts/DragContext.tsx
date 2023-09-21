import React, { createContext, useContext, useEffect, useState } from 'react';

type DragState = {
    isDragging: boolean;
    dragType: string | null;
};

type DragContextType = {
    dragState: DragState;
    setDragState: React.Dispatch<React.SetStateAction<DragState>>;
};

const DragContext = createContext<DragContextType | undefined>(undefined);

export const useDragContext = () => {
    const context = useContext(DragContext);
    if (!context) {
        throw new Error('useDragContext must be used within a DragProvider');
    }
    return context;
};

export const DragProvider = ({ children }: { children: React.ReactNode }) => {
    const [dragState, setDragState] = useState<DragState>({ isDragging: false, dragType: null });

    // useEffect(() => {
    //     console.log(dragState)
    // }, [dragState])

    return (
        <DragContext.Provider value={{ dragState, setDragState }}>
            {children}
        </DragContext.Provider>
    );
};

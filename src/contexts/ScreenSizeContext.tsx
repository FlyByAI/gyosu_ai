import React, { createContext, useContext, useEffect, useState } from 'react';

type ScreenSizeContextType = {
    isDesktop: boolean;
};

const ScreenSizeContext = createContext<ScreenSizeContextType | undefined>(undefined);

export const useScreenSize = () => {
    const context = useContext(ScreenSizeContext);
    if (!context) {
        throw new Error("useScreenSize must be used within a ScreenSizeProvider");
    }
    return context;
};

export const ScreenSizeProvider = ({ children }: { children: React.ReactNode }) => {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.matchMedia('(min-width: 768px)').matches) {
                setIsDesktop(true);
                console.log('desktop');
                console.log("16")
            } else {
                setIsDesktop(false);
                console.log('mobile');
                console.log("33")
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <ScreenSizeContext.Provider value={{ isDesktop }}>
            {children}
        </ScreenSizeContext.Provider>
    );
};

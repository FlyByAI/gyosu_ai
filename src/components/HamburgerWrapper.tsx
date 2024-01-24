import Hamburger from 'hamburger-react';
import React, { ReactNode, useEffect, useState } from 'react';

interface HamburgerWrapperProps {
    children: ReactNode;
}
const HamburgerWrapper: React.FC<HamburgerWrapperProps> = ({ children }) => {
    const [isOpen, setOpen] = useState(false);

    const closeOnScroll = () => {
        setOpen(false);
    };

    useEffect(() => {
        window.addEventListener('scroll', closeOnScroll);
        return () => {
            window.removeEventListener('scroll', closeOnScroll);
        };
    }, []);

    return (
        <div className="relative">
            {/* Hamburger Menu */}
            <Hamburger toggled={isOpen} toggle={setOpen} />

            {/* Children */}
            <div className={`flex fixed top-16 border right-0 z-100 w-auto h-auto transition-transform duration-300 transform ${isOpen ? 'translate-x-0 lg:translate-x-0' : '-translate-x-full'}`}>
                {isOpen &&
                    <div className='bg-gray-900 w-auto h-auto justify-end p-4 space-y-4'>
                        {children}
                    </div>
                }
            </div>
        </div>
    );
};


export default HamburgerWrapper;

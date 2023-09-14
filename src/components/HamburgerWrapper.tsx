import React, { useState, ReactNode, useEffect } from 'react';
import Hamburger from 'hamburger-react';

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
            <div className={`flex fixed top-20 right-0 z-100 w-auto h-auto transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                {isOpen &&
                    <div className='bg-gray-900 w-auto h-auto justify-end'>
                        {children}
                    </div>
                }
            </div>
        </div>
    );
};


export default HamburgerWrapper;

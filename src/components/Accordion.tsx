import React, { useState } from 'react';
import ChevronDown from '../svg/ChevronDown';
import ChevronUp from '../svg/ChevronUp';

interface AccordionProps {
    title: string;
    children: React.ReactNode;
    visible?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, visible }) => {
    const [isVisible, setIsVisible] = useState(visible);

    return (
        <div className="flex justify-center items-center">
            <div className="w-3/4 bg-gray-700 rounded-lg p-4 m-2 shadow-lg">
                <h1
                    className="text-2xl text-center text-white cursor-pointer"
                    onClick={() => setIsVisible(!isVisible)}
                >

                    <div className='flex flex-row justify-center items-center'>
                        {title}
                        <div className='ms-4'> {isVisible ? <ChevronUp /> : <ChevronDown />}</div>
                    </div>
                </h1>
                <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out transform ${isVisible ? 'scale-y-100 h-auto' : 'scale-y-0 h-0'}`}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Accordion;

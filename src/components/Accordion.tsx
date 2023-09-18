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
        <div className="flex justify-left items-start">
            <div className="w-full bg-gray-700 rounded-lg p-4 shadow-lg m-2">
                <h1
                    className="text-2xl text-start text-white cursor-pointer"
                    onClick={() => setIsVisible(!isVisible)}
                >

                    <div className='mx-4 flex flex-row justify-between items-between'>
                        <div>{title}</div>
                        <div className='ms-4'> {isVisible ? <ChevronUp /> : <ChevronDown />}</div>
                    </div>
                </h1>
                <div
                    className={`text-start mx-8 overflow-hidden transition-all duration-500 ease-in-out transform ${isVisible ? 'scale-y-100 h-auto' : 'scale-y-0 h-0'}`}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Accordion;

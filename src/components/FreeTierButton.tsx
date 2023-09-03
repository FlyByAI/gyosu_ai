import React, { useState } from 'react';

interface FreeTierButtonProps {
    className: string;
}

const FreeTierButton: React.FC<FreeTierButtonProps> = ({ className }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`${className} inline-flex justify-center rounded-md border border-blue-500 shadow-sm p-4 mx-16 bg-gradient-to-r from-blue-600 to-green-500`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isHovered ? '😞' : 'Free'}
        </div>
    );
};

export default FreeTierButton;

import React, { useState } from 'react';

interface FreeTierButtonProps {
    className: string;
}

const FreeTierButton: React.FC<FreeTierButtonProps> = ({ className }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`${className} inline-flex justify-center rounded-md shadow-sm p-4 mx-16`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
        </div>
    );
};

export default FreeTierButton;

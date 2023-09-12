
import React, { useState, useEffect, useRef } from 'react';

type OverflowMenuProps = {
    children: React.ReactNode;
    variant?: "top" | "bottom";
};

const OverflowMenu: React.FC<OverflowMenuProps> = ({ children, variant }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleDocumentClick = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setIsOpen(false);
        }
    };

    const handleDocumentKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleDocumentClick);
        document.addEventListener('keydown', handleDocumentKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
            document.removeEventListener('keydown', handleDocumentKeyDown);
        };
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            {isOpen && (
                <div
                    className={`p-2 text-black absolute ${variant === "top" ? "-top-12" : "top-0"} right-0 flex flex-row-reverse items-center bg-gray-200 rounded-lg`}
                >
                    {children}
                </div>
            )}
            {!isOpen && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(true);
                    }}
                    className=""
                >
                    ...
                </button>
            )}
        </div>
    );
};

export default OverflowMenu;    
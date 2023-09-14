import React, { useState, useEffect, useRef } from 'react';
import DotsVerticalIcon from '../svg/DotsVerticalIcon';

type OverflowMenuProps = {
    children: React.ReactNode;
    variant?: "top" | "bottom";
    type?: "iconRow" | "default";
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const OverflowMenu: React.FC<OverflowMenuProps> = ({ children, variant, type = "default", isOpen, setIsOpen }) => {
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

    const renderMenuContent = () => {
        switch (type) {
            case "iconRow":
                return (
                    <div className="flex flex-col">
                        {children}
                    </div>
                );
            case "default":
                return children;
            default:
                return null;
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            {isOpen && (
                <div
                    className={`p-2 text-black absolute ${variant === "top" ? "-top-12" : "top-0"} right-0 flex flex-row-reverse items-center bg-gray-200 rounded-lg`}
                >
                    {renderMenuContent()}
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
                    <DotsVerticalIcon />
                </button>
            )}
        </div>
    );
};

export default OverflowMenu;

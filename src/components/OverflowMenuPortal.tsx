import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import DotsVerticalIcon from '../svg/DotsVerticalIcon';

type OverflowMenuProps = {
    children: React.ReactNode;
    variant?: 'top' | 'bottom';
    type?: 'iconRow' | 'default';
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    portalRoot: React.RefObject<HTMLDivElement>;
};

const OverflowMenu: React.FC<OverflowMenuProps> = ({
    children,
    variant,
    type = 'default',
    isOpen,
    setIsOpen,
    portalRoot,
}) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const [menuStyles, setMenuStyles] = useState(
        {
            top: "0px",
            left: "0px",
        }
    )
    

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
            case 'iconRow':
                return <div className="flex flex-col">{children}</div>;
            case 'default':
                return children;
            default:
                return null;
        }
    };
    
    useEffect(() => {
        const styles = {
            top: "0px",
            left: "0px",
        };

        if (isOpen && buttonRef.current && portalRoot.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            styles.top = `${buttonRect.bottom}px`;
            styles.left = `${buttonRect.left}px`;
        }

        setMenuStyles(styles)
    }, [isOpen, portalRoot]);

    const flickerFix = menuStyles.top === "0px"

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen); // Toggle the menu's open state
                }}
                className="m-1"
            >
                <DotsVerticalIcon />
            </button>

            {isOpen && portalRoot.current && ReactDOM.createPortal(
                <div
                    style={{...menuStyles}}
                    ref={menuRef}
                    className={`p-2 text-black bg-gray-900 rounded-lg absolute z-50 ${flickerFix && "hidden"}`}
                >
                    {renderMenuContent()}
                </div>,
                portalRoot.current
            )}
        </div>
    );
};

export default OverflowMenu;

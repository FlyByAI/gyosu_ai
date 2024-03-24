import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import DotsVerticalIcon from '../svg/DotsVerticalIcon';

type OverflowMenuProps = {
    children: React.ReactNode;
    type?: 'iconRow' | 'default';
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    portalRoot: React.RefObject<HTMLDivElement>;
};

const OverflowMenu: React.FC<OverflowMenuProps> = ({
    children,
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
                // For an icon row, ensure proper spacing and alignment with daisyUI utilities
                return <div className="flex flex-col gap-2">{children}</div>;
            case 'default':
                // For default, you might want to wrap the content to ensure it aligns with daisyUI's design system
                return <div className="p-2">{children}</div>;
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
        <div className="relative chat-sidebar-session-ellipsis">
            <button
                ref={buttonRef}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen); // Toggle the menu's open state
                }}
                className="m-1 btn btn-ghost btn-circle"
            >
                <DotsVerticalIcon className="w-5 h-5" />
            </button>
    
            {isOpen && portalRoot.current && ReactDOM.createPortal(
                <div
                    style={{...menuStyles}}
                    ref={menuRef}
                    className={`p-2 text-base-content bg-base-100 rounded-box shadow-lg menu absolute z-50 ${flickerFix && "hidden"}`}
                    // Adjusted class names for daisyUI: bg-base-100 for background, rounded-box for rounded corners, shadow-lg for a shadow effect
                >
                    {renderMenuContent()}
                </div>,
                portalRoot.current
            )}
        </div>
    );
    
};

export default OverflowMenu;

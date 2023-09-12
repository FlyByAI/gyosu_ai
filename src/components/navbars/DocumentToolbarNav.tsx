import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react';
import { useDarkMode } from '../../hooks/useDarkMode';
import LanguageDropdown from '../LanguageDropdown';
import { getGyosuClerkTheme } from '../../theme/customClerkTheme';
import useGetDocument from '../../hooks/tools/math/useGetDocument';
import ChevronLeft from '../../svg/ChevronLeft';
import useSubmitDocument from '../../hooks/tools/math/useSubmitDocument';
import TrashIcon from '../../svg/TrashIcon';
import HamburgerWrapper from '../HamburgerWrapper';
import ManageSubscriptionButton from '../ManageSubscriptionButton';
import { Tooltip as ReactTooltip } from "react-tooltip";
import useEnvironment from '../../hooks/useEnvironment';

const DocumentToolbarNav: React.FC = () => {
    const { darkMode } = useDarkMode();
    const toolbarHeight = "70";

    const { id } = useParams();
    const { apiUrl } = useEnvironment();
    const { document } = useGetDocument(`${apiUrl}/math_app/school_document/`, Number(id));
    const { deleteDocument, isDeleting, shareDocument } = useSubmitDocument(`${apiUrl}/math_app/school_document/`);

    const handleDeleteClick = () => {
        if (document) {
            const confirmDelete = window.confirm('Are you sure you want to delete this document? This action cannot be undone.');
            if (confirmDelete) {
                deleteDocument(document);
            }
        }

    };

    const handleShare = () => {
        if (document && document.id) {
            shareDocument({ id: document.id, shared: !document.shared })
        }
        else {
            console.log('Error sharing document')
        }
    }

    return (
        <>
            <div className='mt-20'></div> {/* Placeholder */}
            <header className="z-50 fixed top-0 left-0 w-full px-6 py-4 bg-blue-900 text-white dark:bg-gray-900 dark:text-gray-200">
                <div className="flex justify-between items-center w-full">
                    <div className=" w-1/6">
                        <Link to="/math-app" className="text-3xl font-semibold text-white font-mono flex items-center"><ChevronLeft />Home</Link>
                    </div>
                    <div className="w-1/6 justify-between flex flex-row">
                        {/* {document && <button
                            className="ms-2 text-xl font-semibold text-white font-mono flex flex-row items-end"
                            onClick={handleShare}
                        >
                            <div>Shared </div>
                            <div className={!document.shared ? "text-green-300 ms-2 m-1" : "text-red-300 ms-2 m-1"}>{document.shared ? <XIcon /> : <CheckmarkIcon />}</div>
                        </button>} */}
                    </div>
                    <div className="w-1/6 justify-between flex flex-row">

                    </div>
                    <div className="w-1/2 flex justify-end items-center">

                        <SignedIn>
                            {darkMode ? <UserButton afterSignOutUrl="/" appearance={getGyosuClerkTheme()} /> : <UserButton afterSignOutUrl="http://localhost:5173/" />}
                            <HamburgerWrapper>
                                <LanguageDropdown />
                                <ManageSubscriptionButton />
                            </HamburgerWrapper>
                        </SignedIn>
                        <SignedOut>
                            <div
                                className="flex justify-center items-center bg-orange-500 hover:bg-orange-600 rounded-md p-2 cursor-pointer"
                                onClick={(e) => {
                                    // Programmatically click the inner button
                                    const button = e.currentTarget.querySelector('button');
                                    if (button) {
                                        button.click();
                                    }
                                }}
                            >
                                <SignInButton mode="modal" />
                            </div>
                        </SignedOut>
                    </div>
                </div>
            </header>
        </>
    );
};

export default DocumentToolbarNav;

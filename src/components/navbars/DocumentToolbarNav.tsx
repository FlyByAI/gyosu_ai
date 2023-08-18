import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react';
import { useDarkMode } from '../../hooks/useDarkMode';
import LanguageDropdown from '../LanguageDropdown';
import { getGyosuClerkTheme } from '../../theme/customClerkTheme';
import DocumentTitle from '../document/DocumentTitle';
import useGetDocument from '../../hooks/tools/math/useGetDocument';
import { notSecretConstants } from '../../constants/notSecretConstants';
import ChevronLeft from '../../svg/ChevronLeft';

const DocumentToolbarNav: React.FC = () => {
    const { darkMode } = useDarkMode();
    const toolbarHeight = "70";

    const { id } = useParams();
    const { isLoading, error, document } = useGetDocument(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/school_document`, Number(id));

    return (
        <>
            <div style={{ height: `${toolbarHeight}px` }}></div> {/* Placeholder */}
            <header className="fixed top-0 left-0 w-full z-10 px-6 py-4 bg-blue-900 text-white dark:bg-gray-900 dark:text-gray-200">
                <div className="flex justify-between items-center w-full">
                    <div className=" w-1/6">
                        <Link to="/math-app" className="text-3xl font-semibold text-white font-mono flex items-center"><ChevronLeft />Home</Link>
                    </div>

                    <div className="w-1/6 justify-between flex flex-row">
                        {/* <nav>
                            <Link to="/math-app" className="text-white mx-3 hover:underline dark:text-gray-200 font-mono">
                                Tool1
                            </Link>
                            <Link to="/math-app" className="text-white mx-3 hover:underline dark:text-gray-200 font-mono">
                                Tool2
                            </Link>
                        </nav> */}
                    </div>
                    <div className="w-1/6 justify-between flex flex-row">

                    </div>
                    <div className="w-1/2 flex justify-end items-center">
                        {document && <DocumentTitle document={document} />}
                        <LanguageDropdown className="ps-2 hidden sm:flex " />
                        <SignedIn>
                            {darkMode ? <UserButton afterSignOutUrl="/" appearance={getGyosuClerkTheme()} /> : <UserButton afterSignOutUrl="http://localhost:5173/" />}
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal" />
                        </SignedOut>
                    </div>
                </div>
            </header>
        </>
    );
};

export default DocumentToolbarNav;

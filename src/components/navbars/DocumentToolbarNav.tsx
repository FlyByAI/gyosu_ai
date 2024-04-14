import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../../contexts/useDarkMode';
import ChevronLeft from '../../svg/ChevronLeft';

const DocumentToolbarNav: React.FC = () => {
    const { darkMode } = useDarkMode();

    return (
        <>
            <div className='mt-20'></div> {/* Placeholder */}
            <header className="z-20 fixed top-0 left-0 w-full px-6 py-4 bg-blue-900 text-white dark:text-gray-200">
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
                            {darkMode ? <UserButton afterSignOutUrl={window.location.href} /> : <UserButton afterSignOutUrl="http://localhost:5173/" />}
                        </SignedIn>
                        <SignedOut>
                            <div className='btn btn-primary'
                                onClick={(e) => {
                                    // Programmatically click the inner button
                                    const button = e.currentTarget.querySelector('button');
                                    if (button) {
                                        button.click();
                                    }
                                }}>
                                <SignInButton mode="modal" afterSignInUrl={window.location.href} />
                            </div>
                        </SignedOut>
                    </div>
                </div>
            </header>
        </>
    );
};

export default DocumentToolbarNav;

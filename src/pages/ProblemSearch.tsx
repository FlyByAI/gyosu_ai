import { useClerk, useUser } from '@clerk/clerk-react';
import React, { useEffect, useRef, useState } from 'react';
import 'tailwindcss/tailwind.css';
import ProblemBankSidebar from '../components/document/ProblemBankSidebar';
import SubmitButton from '../components/forms/SubmitButton';
import CompetitionMathGenerateForm from '../components/math/CompetitonMathGenerateForm';
import MathProblems from '../components/math/MathProblems';
import TextbookGenerateForm from '../components/math/TextbookGenerateForm';
import useSubmitMathForm from '../hooks/tools/math/useSubmitMathForm';
import useEnvironment from '../hooks/useEnvironment';
import { useRequireSignIn } from '../hooks/useRequireSignIn';
import { Chunk, GenerateFormData } from '../interfaces';


export function getShowClass(mobileOrDesktop: string) {
    if (mobileOrDesktop === "desktop") {
        return "hidden md:block";
    }
    if (mobileOrDesktop === "mobile") {
        return "block md:hidden";
    }
    return "block";
}

const ProblemSearch: React.FC = () => {

    const [userInput, setUserInput] = useState('');

    const [chunkArray, setChunkArray] = useState<Chunk[]>([]);

    const [generateFormData, setGenerateFormData] = useState<GenerateFormData>();

    const [formType, setFormType] = useState<'Textbook' | 'Competition' | null>(null);

    const { mathAppApiUrl } = useEnvironment();
    const { isLoading, error, submitMathForm, data } = useSubmitMathForm(`${mathAppApiUrl}/generate/`)


    useRequireSignIn();

    const { session, openSignIn } = useClerk();
    const user = useUser();


    const myRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (chunkArray && Object.keys(chunkArray)?.length > 0 && myRef.current) {
            const rect = myRef.current.getBoundingClientRect();
            const offset = 150; // Adjust to your needs
            const y = rect.top + window.scrollY - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, [chunkArray]);

    useEffect(() => {
        if (userInput != '' && generateFormData?.data?.userInput != userInput) {
            setGenerateFormData({ data: { ...generateFormData?.data, userInput: userInput } })
        }
    }, [generateFormData?.data, userInput])

    const handleMathSubmit = async () => {
        if (session && generateFormData) {
            await submitMathForm({ data: generateFormData.data });
        }
        else if (session && !generateFormData && userInput == "") {
            await submitMathForm({ data: { userInput } });
        }
        else {
            openSignIn({
                afterSignInUrl: window.location.href
            });
        }
    };

    return (
        <>
            <div className="flex flex-col md:flex-row w-full min-h-screen flex-grow">
                {/* Always visible Problem Bank Shelf on the side for larger screens, toggle-able or hidden on smaller screens */}
                <div className='ms-4 w-1/4'>
                    <div className="fixed top-80px left-10px z-auto"> {/* This div contains the sidebar */}
                        <div className={`card bg-base-200 shadow-lg my-4 md:my-0 md:mr-4 p-4 ${getShowClass('desktop')}`}>
                            <ProblemBankSidebar isExporting={false} />
                        </div>
                    </div>
                </div>
                {/* Center column for search and results, full width on small screens and adjusted on larger screens */}
                <div className="w-1/2 mx-8 max-w-2xl">
                    {/* Search Section */}
                    <div className="card rounded-lg p-4 my-4 shadow-lg bg-base-200">
                        <div className="form-control w-full mx-auto mb-4">
                            <label className="label">
                                <span className="label-text">Search for math problems</span>
                            </label>
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                className="input input-bordered w-full"
                                placeholder="sin and cos, fractions, etc. "
                            />
                        </div>
                        <div className="text-center mb-4">
                            <span className="font-bold text-xl italic">Optional: Select Problem Source</span>
                        </div>
                        <div className="flex flex-col mb-8 w-full space-y-2 mx-auto justify-items-center">
                            <button
                                onClick={() => setFormType('Textbook')}
                                className={`btn ${formType === 'Textbook' ? 'btn-secondary' : 'btn-outline'} w-full`}
                            >
                                Textbooks
                            </button>
                            <button
                                onClick={() => setFormType('Competition')}
                                className={`btn ${formType === 'Competition' ? 'btn-secondary' : 'btn-outline'} w-full`}
                            >
                                Competition Math
                            </button>
                        </div>

                        {formType === 'Textbook' && <TextbookGenerateForm setGenerateFormData={setGenerateFormData} userInput={userInput} />}
                        {formType === 'Competition' && <CompetitionMathGenerateForm setGenerateFormData={setGenerateFormData} userInput={userInput} />}
                        <SubmitButton
                            buttonText={"Search"}
                            handleClick={handleMathSubmit}
                            className="btn mt-4 w-full md:w-1/2 mx-auto"
                        />
                    </div>

                    {error && <p className="text-error mt-4 text-center">Error: {error.message}</p>}
                    {error && !user?.user?.username && <p className="text-error mt-4 text-center">Note: Our tools require you to be signed in.</p>}
                    {isLoading && <p className="text-base-content">Loading...</p>}
                    {isLoading && (
                        <div className="flex justify-center mt-4">
                            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                        </div>
                    )}

                    {data && (
                        <div className="card rounded-lg p-4 my-4 bg-base-100 shadow-lg">
                            <div className="text-xl justify-center flex items-center mb-4 italic">Step 3: Add problems to a problem bank.</div>
                            <MathProblems
                                chunkArray={data.response}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>

    );
};

export default ProblemSearch;


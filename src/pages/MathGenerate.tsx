import React, { useEffect, useRef, useState } from 'react';
import 'tailwindcss/tailwind.css';
import ProblemBankShelf from '../components/document/ProblemBankShelf';
import ChunkManager from '../components/math/ChunkManager';
import CompetitionMathGenerateForm from '../components/math/CompetitonMathGenerateForm';
import TextbookGenerateForm from '../components/math/TextbookGenerateForm';
import { useScreenSize } from '../contexts/ScreenSizeContext';
import { useRequireSignIn } from '../hooks/useRequireSignIn';
import { Chunk, GenerateFormData } from '../interfaces';


const MathGenerate: React.FC = () => {

    const [chunkArray, setChunkArray] = useState<Chunk[]>([]);

    const [generateFormData, setGenerateFormData] = useState<GenerateFormData | undefined>(undefined);

    const [formType, setFormType] = useState<'Textbook' | 'Competition' | null>();

    const handleSubmit = (data: { response: Chunk[] | string; id?: number }) => {
        const chunkArray = data.response as Chunk[];
        setChunkArray(chunkArray);
    };

    useRequireSignIn();


    const { isDesktop } = useScreenSize();

    const myRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (chunkArray && Object.keys(chunkArray).length > 0 && myRef.current) {
            const rect = myRef.current.getBoundingClientRect();
            const offset = 150; // Adjust to your needs
            const y = rect.top + window.scrollY - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, [chunkArray]);

    function getShowClass(mobileOrDesktop: string) {
        if (mobileOrDesktop === "desktop") {
            return "hidden md:block";
        }
        if (mobileOrDesktop === "mobile") {
            return "block md:hidden";
        }
        return "block";
    }

    return (
        <>
            <div className="flex flex-col md:flex-row w-full">
                {/* Always visible Problem Bank Shelf on the side for larger screens, toggle-able or hidden on smaller screens */}
                <div className={`card bg-base-200 shadow-lg my-4 md:my-0 md:mr-4 p-4 ${getShowClass('desktop')} md:w-1/4 lg:w-1/5`}>
                    <ProblemBankShelf isExporting={false} />
                </div>

                {/* Center column for search and results, full width on small screens and adjusted on larger screens */}
                <div className="flex-1">
                    {/* Search Section */}
                    <div className="card rounded-lg p-4 my-4 shadow-lg bg-base-200">
                        <div className="text-left mb-4">
                            <span className="font-bold text-xl italic">Step 1: Select Problem Source</span>
                        </div>
                        <div className="flex space-x-4 space-y-0 mb-8 mx-4">
                            <button
                                onClick={() => setFormType('Textbook')}
                                className={`btn ${formType === 'Textbook' ? 'btn-primary' : 'btn-outline'} w-1/2`}
                            >
                                Textbooks
                            </button>
                            <button
                                onClick={() => setFormType('Competition')}
                                className={`btn ${formType === 'Competition' ? 'btn-primary' : 'btn-outline'} w-1/2`}
                            >
                                Competition Math
                            </button>
                        </div>
                        {formType && (
                            <div className="text-left mb-4">
                                <span className="font-bold text-xl italic">Step 2: Search for problems using dropdowns</span>
                            </div>
                        )}
                        <div>
                            {formType === 'Textbook' && <TextbookGenerateForm onSubmit={handleSubmit} setGenerateFormData={setGenerateFormData} />}
                            {formType === 'Competition' && <CompetitionMathGenerateForm onSubmit={handleSubmit} setGenerateFormData={setGenerateFormData} />}
                        </div>
                    </div>

                    {/* Results Display */}
                    {generateFormData && (
                        <div className="card rounded-lg p-4 my-4 bg-base-100 shadow-lg">
                            {chunkArray.length > 0 && (
                                <ChunkManager
                                    setChunkArray={setChunkArray}
                                    chunkArray={chunkArray}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>

    );
};

export default MathGenerate;


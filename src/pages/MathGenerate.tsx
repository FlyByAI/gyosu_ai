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

    return (
        <div className="flex flex-row">
            <ProblemBankShelf isExporting={false} />
            <div className="flex-grow mt-4 overflow-x-hidden">
                <div className="flex justify-start items-center flex-col">
                    {/* Step 1: Problem Source Selection */}
                    <div className="card w-full md:w-2/3 mx-4 md:mx-auto rounded-lg p-4 my-4 shadow-lg bg-base-100">
                        <div className="text-left mb-4">
                            <span className="font-bold text-xl ml-4 italic">Step 1: Select Problem Source</span>
                        </div>
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8 mx-auto">
                            <button
                                onClick={() => setFormType('Textbook')}
                                className={`btn ${formType === 'Textbook' ? 'btn-primary' : 'btn-outline'} w-full md:w-auto`}
                            >
                                Textbooks
                            </button>
                            <button
                                onClick={() => setFormType('Competition')}
                                className={`btn ${formType === 'Competition' ? 'btn-primary' : 'btn-outline'} w-full md:w-auto`}
                            >
                                Competition Math
                            </button>
                        </div>

                        {/* Step 2: Detailed Search */}
                        {formType && (
                            <div className="text-left mb-4">
                                <span className="font-bold text-xl ml-4 italic">Step 2: Search for problems using dropdowns</span>
                            </div>
                        )}

                        <div className='w-full mx-auto md:w-5/6'>
                            {formType === 'Textbook' && <TextbookGenerateForm onSubmit={handleSubmit} setGenerateFormData={setGenerateFormData} />}
                            {formType === 'Competition' && <CompetitionMathGenerateForm onSubmit={handleSubmit} setGenerateFormData={setGenerateFormData} />}
                        </div>
                    </div>

                    {/* Generated Problem Chunks Display */}
                    {generateFormData &&
                        <div ref={myRef} className="card w-full md:w-3/4 mx-4 md:mx-auto rounded-lg p-4 my-4 bg-base-100">
                            <div className='w-full'>
                                {chunkArray.length > 0 &&
                                    <ChunkManager
                                        setChunkArray={setChunkArray}
                                        chunkArray={chunkArray}
                                    />}
                            </div>
                        </div>}
                </div>
            </div>
        </div>


    );
};

export default MathGenerate;


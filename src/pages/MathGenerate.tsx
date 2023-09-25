import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import { useClerk, useUser } from '@clerk/clerk-react';
import { Chunk, GenerateFormData, ProblemData, TextbookProblemData } from '../interfaces';
import ProblemBankShelf from '../components/document/ProblemBankShelf';
import ChunkManager from '../components/math/ChunkManager';
import TextbookGenerateForm from '../components/math/TextbookGenerateForm';
import { useScreenSize } from '../contexts/ScreenSizeContext';
import CompetitonMathGenerateForm from '../components/math/CompetitonMathGenerateForm';


const MathGenerate: React.FC = () => {

    const { session, openSignIn } = useClerk();

    const [chunkArray, setChunkArray] = useState<Chunk[]>([]);

    const [problemData, setProblemData] = useState<GenerateFormData | undefined>(undefined);

    const [formType, setFormType] = useState<'Textbook' | 'Competition' | null>();

    const handleSubmit = (data: { response: Chunk[] | string; id?: number }) => {
        const chunkArray = data.response as Chunk[];
        setChunkArray(chunkArray);
    };

    useEffect(() => {
        if (!session) {
            openSignIn()
        }
    }, [session, openSignIn])

    const { isDesktop } = useScreenSize();

    return (
        <div className="flex">
            <ProblemBankShelf isExporting={false} />
            <div className="w-5/6 mt-4 overflow-x-hidden" style={{ marginRight: isDesktop ? '16.6667%' : "0" }}>
                <div className="flex justify-center items-center flex-col">
                    <div className="w-full md:w-3/4 mx-4 md:mx-0 bg-gray-700 rounded-lg p-4 my-4 shadow-lg items-center flex flex-col">
                        <h1 className="text-2xl font-bold text-center mb-4 text-white">Problem Search</h1>

                        <div className="text-center text-white mb-4">
                            <span className="font-bold">Step 1:</span> Select textbook problems or competition problems:
                        </div>
                        <div className="flex space-x-4 mb-8">
                            <button
                                onClick={() => setFormType('Textbook')}
                                className={`p-2 ${formType === 'Textbook' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                            >
                                Textbooks
                            </button>
                            <button
                                onClick={() => setFormType('Competition')}
                                className={`p-2 ${formType === 'Competition' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                            >
                                Competition Math Problems
                            </button>
                        </div>

                        <div className="text-center text-white mb-4">
                            {formType && <span className="font-bold">Step 2: Fill out the form options below</span>}
                        </div>

                        {formType ? (
                            <>
                                {formType === 'Textbook' && <TextbookGenerateForm onSubmit={handleSubmit} setProblemData={setProblemData} />}
                                {formType === 'Competition' && <CompetitonMathGenerateForm onSubmit={handleSubmit} setProblemData={setProblemData} />}
                            </>
                        ) : (
                            <p className="text-center text-white mt-4">Please complete Step 1 to proceed.</p>
                        )}

                    </div>

                    <div>
                        {problemData &&
                            chunkArray.length > 0 &&
                            <ChunkManager
                                setChunkArray={setChunkArray}
                                chunkArray={chunkArray}
                            />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MathGenerate;


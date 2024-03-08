import React, { useEffect, useRef, useState } from 'react';
import 'tailwindcss/tailwind.css';
import ProblemBankShelf from '../components/document/ProblemBankShelf';
import ChunkManager from '../components/math/ChunkManager';
import CompetitonMathGenerateForm from '../components/math/CompetitonMathGenerateForm';
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
        <div className="flex">
            <ProblemBankShelf isExporting={false} />
            <div className="w-5/6 mt-4 overflow-x-hidden" style={{ marginRight: isDesktop ? '16.6667%' : "0" }}>
                <div className="flex justify-start items-center flex-col">
                    <div className="w-full md:w-2/3 mx-4 md:mx-0 bg-gray-700 rounded-lg p-4 my-4 shadow-lg flex flex-col">

                        <div className="text-left text-gray-300 mb-4">
                            <span className="font-bold items-left ml-4 italic">Step 1: Select Problem Source</span>

                        </div>
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8 mx-auto">
                            <button
                                onClick={() => setFormType('Textbook')}
                                className={`p-4 text-lg rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 ${formType === 'Textbook' ? 'bg-blue-500 text-gray-300' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
                            >
                                Textbooks
                            </button>
                            <button
                                onClick={() => setFormType('Competition')}
                                className={`p-4 text-lg rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 ${formType === 'Competition' ? 'bg-blue-500 text-gray-300' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
                            >
                                Competition Math
                            </button>
                        </div>

                        <div className="text-left text-gray-300 mb-4">
                            {formType && <span className="font-bold items-left ml-4 italic">Step 2: Search for problems using drop downs</span>}
                        </div>

                        <div className='class="w-full mx-auto md:w-5/6"'>
                            {formType === 'Textbook' && <TextbookGenerateForm onSubmit={handleSubmit} setGenerateFormData={setGenerateFormData} />}
                            {formType === 'Competition' && <CompetitonMathGenerateForm onSubmit={handleSubmit} setGenerateFormData={setGenerateFormData} />}
                        </div>

                    </div>

                    {generateFormData && <div ref={myRef} className="w-full md:w-3/4 mx-4 md:mx-0 rounded-lg p-4 my-4 shadow-lg items-center flex flex-col">
                        <div className='w-full md:w-5/6'>
                            {
                                chunkArray.length > 0 &&
                                <ChunkManager
                                    setChunkArray={setChunkArray}
                                    chunkArray={chunkArray}
                                />}
                        </div>
                    </div>

                    }
                </div>
            </div>
        </div>
    );
};

export default MathGenerate;


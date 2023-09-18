import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import { useClerk, useUser } from '@clerk/clerk-react';
import { Chunk, ProblemData } from '../interfaces';
import ProblemBankShelf from '../components/document/ProblemBankShelf';
import ChunkManager from '../components/math/ChunkManager';
import MathGenerateForm from '../components/math/MathGenerateForm';
import { useScreenSize } from '../contexts/ScreenSizeContext';


const MathGenerate: React.FC = () => {

    const { session, openSignIn } = useClerk();

    const [chunkArray, setChunkArray] = useState<Chunk[]>([]);

    const [problemData, setProblemData] = useState<ProblemData | undefined>(undefined);

    const user = useUser();

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
            <div className="w-5/6 mt-4" style={{ marginRight: isDesktop ? '16.6667%' : "0" }}>
                <MathGenerateForm onSubmit={handleSubmit} setProblemData={setProblemData} />
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
    );
};

export default MathGenerate;


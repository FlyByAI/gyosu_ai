import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import { useClerk, useUser } from '@clerk/clerk-react';
import { Chunk, ProblemData } from '../../interfaces';
import DocumentShelf from '../../components/document/DocumentShelf';
import ChunkManager from '../../components/math/ChunkManager';
import MathGenerateForm from '../../components/math/MathGenerateForm';


const MathGenerate: React.FC = () => {

    const { session, openSignIn } = useClerk();

    const [chunkArray, setChunkArray] = useState<Chunk[]>([]);

    const [problemData, setProblemData] = useState<ProblemData | undefined>(undefined);

    const user = useUser();

    const handleSubmit = (data: { response: Chunk[] | string; id?: number }) => {
        const chunkArray = data.response as Chunk[];
        setChunkArray(chunkArray);
    };

    console.log("VITE API URL", import.meta.env.VITE_API_URL)

    useEffect(() => {
        if (!session) {
            openSignIn()
        }
    }, [session, openSignIn])

    return (
        <div className="flex">
            <DocumentShelf isExporting={false} />
            <div className="w-5/6" style={{ marginRight: '16.6667%' }}>

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


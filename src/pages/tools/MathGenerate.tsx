import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import { notSecretConstants } from '../../constants/notSecretConstants';
import GridContainer3x3 from '../../components/grids/GridContainer3x3';
import DocumentPreview from '../../components/forms/DocumentPreview';
import useFetchDocuments from '../../hooks/tools/math/useFetchDocuments';
import { useClerk, useUser } from '@clerk/clerk-react';
import Accordion from '../../components/Accordion';
import { Chunk, ProblemData } from '../../interfaces';
import DocumentShelf from '../../components/document/DocumentShelf';
import ChunkManager from '../../components/math/ChunkManager';
import MathGenerateForm from '../../components/math/MathGenerateForm';


const MathGenerate: React.FC = () => {

    const { session, openSignIn } = useClerk();

    const [chunkArr, setChunkArr] = useState<Chunk[]>([]);

    const [problemData, setProblemData] = useState<ProblemData | undefined>(undefined);

    const user = useUser();

    const handleSubmit = (data: { response: Chunk[] | string; id?: number }) => {
        const chunkArray = data.response as Chunk[];

        setChunkArr(chunkArray);
    };

    useEffect(() => {
        if (!session) {
            openSignIn()
        }
    }, [session, openSignIn])

    return (
        <div className="flex">
            <DocumentShelf isExporting={false} />
            <div className="w-full">
                <MathGenerateForm onSubmit={handleSubmit} setProblemData={setProblemData} />
                <div>
                    {problemData && chunkArr.length > 0 && <ChunkManager
                        chunkArray={chunkArr}
                        problemData={problemData}
                    />}
                </div>
            </div>
        </div>
    );
};

export default MathGenerate;


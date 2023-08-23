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

    const { documents } = useFetchDocuments(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/documents/recent/`);
    const { documents: myDocuments } = useFetchDocuments(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/myDocuments/recent/`);

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

                {myDocuments && <div className="flex justify-center items-center">
                    <Accordion title={"Documents created by you"}>
                        <GridContainer3x3>
                            {myDocuments.map((doc, index) => {
                                return (
                                    <DocumentPreview
                                        key={index}
                                        document={doc}
                                    />
                                );
                            })}
                        </GridContainer3x3>
                    </Accordion>
                </div>}
                {documents && <div className="flex justify-center items-center mb-2">
                    <Accordion title={"Browse recent community created documents"} visible={true}>
                        <GridContainer3x3>
                            {documents.map((doc, index) => {
                                return (
                                    <DocumentPreview
                                        key={index}
                                        document={doc}
                                    />
                                );
                            })}
                        </GridContainer3x3>
                    </Accordion>
                </div>}
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


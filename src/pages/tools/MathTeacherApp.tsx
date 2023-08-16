import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import { notSecretConstants } from '../../constants/notSecretConstants';
import GridContainer3x3 from '../../components/grids/GridContainer3x3';
import DocumentPreview from '../../components/forms/DocumentPreview';
import useFetchDocuments from '../../hooks/tools/math/useFetchDocuments';
import { useClerk, useUser } from '@clerk/clerk-react';
import Accordion from '../../components/Accordion';
import { MathDocument } from '../../hooks/tools/math/useSearchDocuments';
import { Chunk, ProblemData } from '../../interfaces';
import DocumentShelf from '../../components/math/DocumentShelf';
import ProblemManager from '../../components/math/ProblemManager';
import MathTeacherForm from '../../components/math/MathTeacherForm';


const MathTeacherApp: React.FC = () => {

    const { session, openSignIn } = useClerk();

    const [chunkArr, setChunkArr] = useState<Chunk[]>([]);

    const { documents } = useFetchDocuments(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/documents/recent/`);
    const { documents: myDocuments } = useFetchDocuments(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/myDocuments/recent/`);
    const [dataSearchDocs, setDataSearchDocs] = useState<MathDocument[] | null>(null)

    const [problemData, setProblemData] = useState<ProblemData | null>(null);

    const [chat, setChat] = useState<string>('');

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


    const handleSearch = (data: MathDocument[] | null) => {
        setDataSearchDocs(data);
    };

    return (
        <div className="flex">
            <DocumentShelf />
            <div className="w-5/6">
                {!(chunkArr.length > 0) ?
                    <>
                        <MathTeacherForm onSubmit={handleSubmit} onSearch={handleSearch} setProblemData={setProblemData} />
                        {dataSearchDocs && dataSearchDocs?.length > 0 ? <div className="flex justify-center items-center">
                            <Accordion title={"Search Results"} visible={true}>
                                <GridContainer3x3>
                                    {dataSearchDocs?.map((doc, index) => {
                                        return (
                                            <DocumentPreview
                                                key={index}
                                                index={index}
                                                creator={doc.creator || user.user?.username || "Anonymous"}
                                                upvotes={doc.upvotes || 0}
                                                tips={doc.tips || 0}
                                                modifiedBy={[]} //TODO: contributors
                                            />
                                        );
                                    })}
                                </GridContainer3x3>
                            </Accordion>
                        </div> : <>
                            {dataSearchDocs && <Accordion title={"Search Results"} visible={true}>
                                <div className='text-red-100'>
                                    No results found. Try searching for something else.
                                </div>
                            </Accordion>}
                        </>}
                        {myDocuments && <div className="flex justify-center items-center">
                            <Accordion title={"Documents created by you"}>
                                <GridContainer3x3>
                                    {myDocuments.map((doc, index) => {
                                        return (
                                            <DocumentPreview
                                                key={index}
                                                index={index}
                                                creator={doc.creator || user.user?.username || "Anonymous"}
                                                upvotes={doc.upvotes || 0}
                                                tips={doc.tips || 0}
                                                modifiedBy={[]} //TODO: contributors
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
                                                index={index}
                                                creator={doc.creator || user.user?.username || "Anonymous"}
                                                upvotes={doc.upvotes || 0}
                                                tips={doc.tips || 0}
                                                modifiedBy={[]} //TODO: contributors
                                            />
                                        );
                                    })}
                                </GridContainer3x3>
                            </Accordion>
                        </div>}
                    </>
                    :
                    <>
                        <div>
                            {problemData &&
                                <ProblemManager
                                    chunkArray={chunkArr}
                                    setChat={setChat}
                                    problemData={problemData}
                                />
                            }
                        </div>
                    </>
                }


            </div>
        </div>
    );
};

export default MathTeacherApp;


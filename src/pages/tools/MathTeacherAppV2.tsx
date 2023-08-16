import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import { notSecretConstants } from '../../constants/notSecretConstants';
import DocumentExport from '../../components/math/DocumentExport';
import GridContainer3x3 from '../../components/grids/GridContainer3x3';
import DocumentPreview from '../../components/forms/DocumentPreview';
import useFetchDocuments from '../../hooks/tools/math/useFetchDocuments';
import MathTeacherEdit from '../../components/math/MathTeacherEdit';
import { useClerk, useUser } from '@clerk/clerk-react';
import Accordion from '../../components/Accordion';
import { MathDocument } from '../../hooks/tools/math/useSearchDocuments';
import MathTeacherFormV2 from '../../components/math/MathTeacherFormV2';
import { Chunk, DocumentAST, ProblemData } from '../../interfaces';
import ProblemManagerV2 from '../../components/math/ProblemManagerV2';
import DocumentShelf from '../../components/math/DocumentShelf';


const MathTeacherApp: React.FC = () => {

    const { session, openSignIn } = useClerk();

    const [chunkArr, setChunkArr] = useState<Chunk[]>([]);

    const { documents } = useFetchDocuments(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/documents/recent/`);
    const { documents: myDocuments } = useFetchDocuments(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/myDocuments/recent/`);
    const [dataSearchDocs, setDataSearchDocs] = useState<MathDocument[] | null>(null)

    const [documentId, setDocumentId] = useState<number | undefined>(undefined);

    const [markdown, setMarkdown] = useState<string>('');
    const [problemData, setProblemData] = useState<ProblemData | null>(null);

    const [chat, setChat] = useState<string>('');

    const user = useUser();

    const [saved, setSaved] = useState<boolean>(false);

    const handleSubmit = (data: { response: Chunk[], id?: number }) => {
        console.log(data)
        setChunkArr(data.response);
        setDocumentId(data.id);
    };

    useEffect(() => {
        if (!session) {
            openSignIn()
        }
    }, [session, openSignIn])

    const handleMarkdownChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMarkdown(event.target.value);
    };

    const handleSearch = (data: MathDocument[] | null) => {
        setDataSearchDocs(data);
    };

    const handleDocumentClick = (markdown: string, index: number) => {
        setMarkdown(markdown);
        if (documents) {
            setDocumentId(documents[index].id);
        }
        window.scrollTo(0, 0)
    };


    return (
        <div className="flex">
            <DocumentShelf />
            <div className="w-5/6">
                {!(chunkArr.length > 0) ?
                    <>
                        <MathTeacherFormV2 onSubmit={handleSubmit} onSearch={handleSearch} setProblemData={setProblemData} />
                        {dataSearchDocs && dataSearchDocs?.length > 0 ? <div className="flex justify-center items-center">
                            <Accordion title={"Search Results"} visible={true}>
                                <GridContainer3x3>
                                    {dataSearchDocs?.map((doc, index) => {
                                        return (
                                            <DocumentPreview
                                                key={index}
                                                index={index}
                                                markdown={doc.markdown}
                                                creator={doc.creator || user.user?.username || "Anonymous"}
                                                upvotes={doc.upvotes || 0}
                                                tips={doc.tips || 0}
                                                modifiedBy={[]} //TODO: contributors
                                                onDocumentClick={handleDocumentClick}
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
                                                markdown={doc.markdown}
                                                creator={doc.creator || user.user?.username || "Anonymous"}
                                                upvotes={doc.upvotes || 0}
                                                tips={doc.tips || 0}
                                                modifiedBy={[]} //TODO: contributors
                                                onDocumentClick={handleDocumentClick} // passing the method here
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
                                                markdown={doc.markdown}
                                                creator={doc.creator || user.user?.username || "Anonymous"}
                                                upvotes={doc.upvotes || 0}
                                                tips={doc.tips || 0}
                                                modifiedBy={[]} //TODO: contributors
                                                onDocumentClick={handleDocumentClick} // passing the method here
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
                                <ProblemManagerV2
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


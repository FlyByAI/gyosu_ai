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
import MathTeacherForm from '../../components/math/MathTeacherForm';
import { ProblemData } from '../../interfaces';


const MathTeacherApp: React.FC = () => {

    const { session, openSignIn } = useClerk();

    const [markdown, setMarkdown] = useState<string>('');

    const { documents } = useFetchDocuments(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/documents/recent/`);
    const { documents: myDocuments } = useFetchDocuments(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/myDocuments/recent/`);
    const [dataSearchDocs, setDataSearchDocs] = useState<MathDocument[] | null>(null)

    const [documentId, setDocumentId] = useState<number | undefined>(undefined);

    const [problemData, setProblemData] = useState<ProblemData | null>(null);
    const [chat, setChat] = useState<string>('');

    const user = useUser();

    const [saved, setSaved] = useState<boolean>(false);


    const handleMarkdownChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMarkdown(event.target.value);
    };


    const handleSubmit = (data: any) => {
        setMarkdown(data.response);
        setDocumentId(data.id);
    };

    useEffect(() => {
        if (!session) {
            openSignIn()
        }
    }, [session, openSignIn])

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
        <>

            {!markdown ?
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

                    {problemData && <>
                        <DocumentExport
                            formData={{
                                sourceMaterial: problemData.sourceMaterial,
                                documentType: problemData.documentType,
                                section: problemData.section.split(".")[1],
                                chapter: problemData.section.split(".")[0],
                                problemType: problemData.problemType,
                                userInput: "",
                            }}
                            markdown={markdown}
                            divPrintId={'markdownToPrint'}
                            saved={saved}
                            setSaved={setSaved}
                            setDocumentId={setDocumentId}
                            documentId={documentId}
                            setMarkdown={setMarkdown}
                        />
                        <MathTeacherEdit
                            markdown={markdown}
                            handleMarkdownChange={handleMarkdownChange}
                            setChat={setChat}
                            data={problemData}
                        /></>
                    }
                    <div className="flex items-center justify-center">
                        {/* <AIChat markdown={markdown} onChatChange={handleChatChange} problemType={problemType} /> */}
                    </div>
                </>
            }


        </>
    );
};

export default MathTeacherApp;


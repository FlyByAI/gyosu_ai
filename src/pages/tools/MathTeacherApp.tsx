import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import preCalcData from '../../json/ap-pre-calculus.json';
import textbookSections from '../../json/pre-calc_json_table_of_contents.json';
import useSubmitMathForm from '../../hooks/tools/math/useSubmitMathForm';
import { notSecretConstants } from '../../constants/notSecretConstants';
import SectionDropdown, { CourseDescription } from '../../components/forms/SectionDropdown';
import TypeDropdown from '../../components/forms/TypeDropdown';
import SubmitButton from '../../components/forms/SubmitButton';
import AIChat from '../../components/AIChat';
import SourceMaterialDropdown from '../../components/forms/SourceMaterialDropdown';
import Dropdown from '../../components/forms/Dropdown';
import DocumentExport from '../../components/math/DocumentExport';
import GridContainer3x3 from '../../components/grids/GridContainer3x3';
import DocumentPreview from '../../components/forms/DocumentPreview';
import useFetchDocuments from '../../hooks/tools/math/useFetchDocuments';
import MathTeacherEdit from '../../components/math/MathTeacherEdit';
import { useUser } from '@clerk/clerk-react';
import Accordion from '../../components/Accordion';
import useSearchMathDocuments from '../../hooks/tools/math/useSearchDocuments';


const MathTeacherApp: React.FC = () => {
    const typeOptions = ["Guided Notes", "Worksheet", "Game", "Quiz", "Test"]
    const materialSelectOptions = ["precalc-2a-textbook", "ap-precalculus-college-board-guide"];
    const problemTypeOptions = ["Verbal", "Algebraic", "Graphical", "Numeric", "Technology", "Real-World Applications"];

    const preCalcDataObj = preCalcData as CourseDescription;

    const [documentType, setDocumentType] = useState<string>(typeOptions[0]);
    const [section, setSection] = useState<string>(Object.keys(textbookSections)[0]);
    const [sourceMaterial, setSourceMaterial] = useState<string>(materialSelectOptions[0]);
    const [markdown, setMarkdown] = useState<string>('');
    const [chat, setChat] = useState<string>('');
    const [highlightedText, setHighlightedText] = useState<string>("");
    const [chatHistory, setChatHistory] = useState(['']);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [problemType, setProblemType] = useState<string>(problemTypeOptions[0]);

    const { documents } = useFetchDocuments(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/documents/recent/`);
    const { documents: myDocuments } = useFetchDocuments(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/myDocuments/recent/`);

    const { isLoading, error, submitMathForm, data } = useSubmitMathForm(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/generate/`)
    const { isLoading: isLoadingSearch, error: errorSearch, searchMathDocuments, data: dataSearchDocs } = useSearchMathDocuments(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/search/`)


    const [documentId, setDocumentId] = useState<number | undefined>(undefined);

    const user = useUser();

    const creator = user.user?.username

    const [saved, setSaved] = useState<boolean>(false);

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDocumentType(event.target.value);
    };

    const handleSectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSection(event.target.value);
    };

    const handleSourceMaterialChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSourceMaterial(event.target.value);
    };

    const handleMarkdownChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMarkdown(event.target.value);
    };

    const handleChatChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setChat(event.target.value);
    };


    useEffect(() => {
        if (data) {
            setMarkdown(data.response)
        }
    }, [data])

    const handleSubmit = () => {
        const formData = { creator: creator, documentType, section, userInput: chat, problemType, sourceMaterial }
        submitMathForm(formData)
    };

    const handleSearch = () => {
        const formData = { creator: creator, documentType, section, userInput: chat, problemType, sourceMaterial }
        searchMathDocuments(formData)
    };

    const handleSubmitTextbook = () => {
        const formData = { creator: creator, documentType, section: section.split(".")[1], chapter: section.split(".")[0], userInput: chat, problemType, sourceMaterial }
        submitMathForm(formData)
    };

    const handleSearchTextbook = () => {
        const formData = { creator: creator, documentType, section: section.split(".")[1], chapter: section.split(".")[0], userInput: chat, problemType, sourceMaterial }
        searchMathDocuments(formData)
    };

    const handleChangeProblemType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setProblemType(event.target.value);
    };

    const handleDocumentClick = (markdown: string, index: number) => {
        setMarkdown(markdown);
        if (documents) {
            setDocumentId(documents[index].id);
            console.log(documents[index].id)
        }
        window.scrollTo(0, 0)
    };


    return (
        <>

            {!markdown ?
                <>
                    <div className="flex justify-center items-center">
                        <div className="w-1/2 bg-gray-700 rounded-lg p-8 m-4 shadow-lg">
                            <SourceMaterialDropdown value={sourceMaterial} handleChange={handleSourceMaterialChange} className="form-select block w-full" />
                            {sourceMaterial == materialSelectOptions[1] && <> <TypeDropdown options={typeOptions} value={documentType} handleChange={handleTypeChange} className="form-select block w-full mt-1" />
                                <SectionDropdown data={preCalcDataObj} value={section} handleChange={handleSectionChange} className="form-select block w-full mt-1" />
                                <Dropdown data={problemTypeOptions} value={problemType} handleChange={handleChangeProblemType} className="form-select block w-full mt-1" />
                                <SubmitButton
                                    buttonText={"Generate New"}
                                    handleClick={handleSubmit}
                                    className=" mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                /><SubmitButton
                                    buttonText={"Search"}
                                    handleClick={handleSearch}
                                    className=" ms-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                /></>}
                            {sourceMaterial == materialSelectOptions[0] && <> <TypeDropdown options={typeOptions} value={documentType} handleChange={handleTypeChange} className="form-select block w-full mt-1" />
                                <SectionDropdown data={textbookSections} value={section} handleChange={handleSectionChange} className="form-select block w-full" />
                                <Dropdown data={problemTypeOptions} value={problemType} handleChange={handleChangeProblemType} className="form-select block w-full mt-1" />
                                <SubmitButton
                                    buttonText={"Generate New"}
                                    handleClick={handleSubmitTextbook}
                                    className=" mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                /><SubmitButton
                                    buttonText={"Search"}
                                    handleClick={handleSearchTextbook}
                                    className="  ms-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                /></>}
                        </div>

                    </div>
                    {error && <p className="text-red-600 mt-4 text-center">Error: {error}</p>}
                    {error && !user?.user?.username && <p className="text-red-600 mt-4 text-center">Note: {"Our tools require you to be signed in."}</p>}
                    {isLoading && <p className="dark:text-white">Loading...</p>}
                    {isLoading && (
                        <div className="flex justify-center mt-4">
                            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                        </div>
                    )}
                    {errorSearch && <p className="text-red-600 mt-4 text-center">Error: {errorSearch}</p>}
                    {errorSearch && !user?.user?.username && <p className="text-red-600 mt-4 text-center">Note: {"Our tools require you to be signed in."}</p>}
                    {isLoadingSearch && <p className="dark:text-white">Loading...</p>}
                    {isLoadingSearch && (
                        <div className="flex justify-center mt-4">
                            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                        </div>
                    )}
                    {dataSearchDocs && dataSearchDocs?.length > 0 ? <div className="flex justify-center items-center">
                        <Accordion title={"Search Results"} visible={true}>
                            <GridContainer3x3>
                                {dataSearchDocs?.map((doc, index) => {
                                    return (
                                        <DocumentPreview
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

                    <DocumentExport
                        formData={{
                            creator: documents && documents?.filter((doc) => doc.id == documentId)[0]?.creator || creator || "Anonymous",
                            sourceMaterial: sourceMaterial,
                            documentType,
                            section: section.split(".")[1],
                            chapter: section.split(".")[0],
                            userInput: "",
                            problemType
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
                        typeOptions={typeOptions}
                        documentType={documentType} handleTypeChange={handleTypeChange}
                        section={section} handleSectionChange={handleSectionChange}
                        markdown={markdown} handleMarkdownChange={handleMarkdownChange}
                        chat={chat} handleChatChange={handleChatChange}
                        highlightedText={highlightedText} setHighlightedText={setHighlightedText}
                        chatHistory={chatHistory} setChatHistory={setChatHistory}
                        editMode={editMode} setEditMode={setEditMode}
                        setChat={setChat}
                    />
                    <div className="flex items-center justify-center">
                        {/* <AIChat markdown={markdown} onChatChange={handleChatChange} /> */}
                    </div>
                </>
            }


        </>
    );
};

export default MathTeacherApp;


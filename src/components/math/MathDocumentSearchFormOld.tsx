import React, { useEffect, useMemo, useState } from 'react';
import 'tailwindcss/tailwind.css';
import SubmitButton from '../forms/SubmitButton';
import Dropdown from '../forms/Dropdown';
import { useClerk, useUser } from '@clerk/clerk-react';
import formOptionsJSON from '../../json/dropdown_data_old.json';
import { ProblemData } from '../../interfaces';
import useSearchMathDocuments from '../../hooks/tools/math/useSearchDocuments';
import Accordion from '../Accordion';
import GridContainer3x3 from '../grids/GridContainer3x3';
import DocumentPreview from '../forms/DocumentPreview';
import useEnvironment from '../../hooks/useEnvironment';


const MathDocumentSearchForm: React.FC = () => {
    const formOptionsObj = Object(formOptionsJSON);
    const [sourceMaterial, setSourceMaterial] = useState<string>(Object.keys(formOptionsObj)[0]);
    const [section, setSection] = useState<string>(Object.keys(formOptionsObj[sourceMaterial]).filter(key => key !== 'option_text')[0]);
    const [problemType, setProblemType] = useState<string>(formOptionsObj[sourceMaterial][section]['problem_types'][0]);

    const user = useUser();


    const [problemData, setProblemData] = useState<ProblemData>({
        sourceMaterial,
        section,
        problemType,
        documentType: "Worksheet",
    });


    const { session, openSignIn } = useClerk();

    const { apiUrl } = useEnvironment();
    const { searchMathDocuments, documentSearchResults, error, isLoading } = useSearchMathDocuments(`${apiUrl}/math_app/school_document/community/search/`);


    const handleSearch = () => {
        searchMathDocuments(problemData)
    }

    useEffect(() => {
        const problemData: ProblemData = {
            sourceMaterial,
            section,
            problemType,
            documentType: "Worksheet",
        };

        setProblemData(problemData);
    }, [sourceMaterial, section, problemType, setProblemData]);

    const handleSectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSection = event.target.value;
        // update defaults so they aren't stale
        setSection(newSection);
        setProblemType(formOptionsObj[sourceMaterial][newSection]['problem_types'][0])
    };

    const handleSourceMaterialChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSourceMaterial = event.target.value;
        // update defaults so they aren't stale
        setSourceMaterial(newSourceMaterial);
        setSection(Object.keys(formOptionsObj[newSourceMaterial]).filter(key => key !== 'option_text')[0])
        setProblemType(formOptionsObj[newSourceMaterial][Object.keys(formOptionsObj[newSourceMaterial]).filter(key => key !== 'option_text')[0]]['problem_types'][0])
    };

    const handleChangeProblemType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setProblemType(event.target.value);
    };

    useEffect(() => {
        if (!session) {
            openSignIn()
        }
    }, [session, openSignIn])

    return (
        <>
            <div className="flex justify-center items-center">
                <div className="w-3/4 bg-gray-700 rounded-lg p-4 my-4 shadow-lg items-center flex flex-col">
                    <div className="flex flex-col lg:flex-row justify-center items-center w-full">
                        <Dropdown showSelected={false} label={"Source Material"} options={formOptionsObj} defaultValue={sourceMaterial} handleChange={handleSourceMaterialChange} className="form-select block me-2 w-full lg:w-1/3" />
                        <Dropdown showSelected={false} label={"Section"} options={formOptionsObj[sourceMaterial]} defaultValue={section} handleChange={handleSectionChange} className="form-select block  me-2  w-full lg:w-1/3" />
                        <Dropdown showSelected={false} label={"Problem Type"} options={formOptionsObj[sourceMaterial][section]['problem_types']} defaultValue={problemType} handleChange={handleChangeProblemType} className="form-select block w-full lg:w-1/3" />
                    </div>
                    <SubmitButton
                        buttonText={"Search"}
                        handleClick={handleSearch}
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded self-center w-full"
                    />
                </div>
            </div>
            {documentSearchResults && documentSearchResults.length > 0 ?
                <div className="flex justify-center items-center">
                    <Accordion title={"Search Results"} visible={true}>
                        <GridContainer3x3>
                            {documentSearchResults.map((doc, index) => (
                                <DocumentPreview
                                    key={index}
                                    document={doc}
                                />
                            ))}
                        </GridContainer3x3>
                    </Accordion>
                </div> :
                documentSearchResults &&
                <Accordion title={"Search Results"} visible={true}>
                    <div className='text-red-100'>
                        No results found. Try searching for something else.
                    </div>
                </Accordion>
            }
            {error as Error && <p className="text-red-600 mt-4 text-center">Error: {(error as Error).message}</p>}
            {error as Error && !user?.user?.username && <p className="text-red-600 mt-4 text-center">Note: {"Our tools require you to be signed in."}</p>}
            {isLoading && <p className="dark:text-white">Loading...</p>}
            {isLoading && (
                <div className="flex justify-center mt-4">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                </div>
            )}


        </>
    );
};

export default MathDocumentSearchForm;


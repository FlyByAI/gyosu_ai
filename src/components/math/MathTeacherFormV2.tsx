import React, { useEffect, useMemo, useState } from 'react';
import 'tailwindcss/tailwind.css';
import useSubmitMathForm from '../../hooks/tools/math/useSubmitMathForm';
import { notSecretConstants } from '../../constants/notSecretConstants';
import SubmitButton from '../forms/SubmitButton';
import Dropdown from '../forms/Dropdown';
import { useClerk, useUser } from '@clerk/clerk-react';
import useSearchMathDocuments, { MathDocument } from '../../hooks/tools/math/useSearchDocuments';
import formOptionsJSON from '../../json/dropdown_data.json';
import { DocumentAST, ProblemData } from '../../interfaces';
import useSubmitSearch from '../../hooks/tools/useSubmitSearch';

type MathTeacherFormProps = {
    onSubmit: (data: any) => void;
    onSearch: (data: MathDocument[] | null) => void;
    setProblemData: (problemData: ProblemData) => void; // Include the type of ProblemData
};

const MathTeacherForm: React.FC<MathTeacherFormProps> = ({ onSubmit, onSearch, setProblemData }) => {
    const formOptionsObj = Object(formOptionsJSON);
    const [sourceMaterial, setSourceMaterial] = useState<string>(Object.keys(formOptionsObj)[0]);
    const [section, setSection] = useState<string>(Object.keys(formOptionsObj[sourceMaterial]).filter(key => key !== 'option_text')[0]);
    const [problemType, setProblemType] = useState<string>(formOptionsObj[sourceMaterial][section]['problem_types'][0]);

    const typeOptions = useMemo(() => {
        return ["Worksheet"]
    }, []);

    const [documentType, setDocumentType] = useState<string>(typeOptions[0]);

    const { session, openSignIn } = useClerk();


    const [documentAST, setDocumentAST] = useState<DocumentAST | null>(null);
    const [documentName, setDocumentName] = useState<string>(`${typeOptions}-${sourceMaterial}-${section}-${problemType}`);

    const { isLoading, error, submitMathForm, data } = useSubmitMathForm(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/generate/`)
    const { isLoading: isLoadingSearch, error: errorSearch, searchMathDocuments, data: dataSearchDocs } = useSearchMathDocuments(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/search/`)

    useEffect(() => {
        setDocumentName(`${typeOptions}-${sourceMaterial}-${section}-${problemType}`)
    }, [problemType, section, sourceMaterial, typeOptions])

    useEffect(() => {
        const problemData: ProblemData = {
            sourceMaterial,
            section,
            problemType,
            documentType,
        };

        setProblemData(problemData);
    }, [sourceMaterial, section, problemType, documentType, setProblemData]);

    const user = useUser();


    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDocumentType(event.target.value);
    };

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
        if (data) {
            setDocumentAST(data.response)
        }
    }, [data])


    useEffect(() => {
        if (!session) {
            openSignIn()
        }
    }, [session, openSignIn])

    const handleMathSubmit = async () => {
        if (session) {
            const formData = { documentName, documentType, section, userInput: "", problemType, sourceMaterial }
            await submitMathForm(formData);
        }
        else {
            openSignIn()
        }
    };

    useEffect(() => {
        if (data) {
            onSubmit(data.response)
        }
    }, [data, onSubmit])

    const handleMathSearch = async () => {
        const formData = { documentType, section, userInput: "", problemType, sourceMaterial }
        await searchMathDocuments(formData);
    };

    useEffect(() => {
        if (data) {
            onSubmit(data)
        }
    }, [data, onSubmit])

    useEffect(() => {
        if (dataSearchDocs) {
            onSearch(dataSearchDocs)
        }
    }, [dataSearchDocs, onSearch])


    return (
        <>

            {!documentAST &&
                <>
                    <div className="flex justify-center items-center">
                        <div className="w-full md:w-full bg-gray-700 rounded-lg p-8 m-4 shadow-lg">
                            <Dropdown label={"Source Material"} options={formOptionsObj} defaultValue={sourceMaterial} handleChange={handleSourceMaterialChange} className="form-select block w-full mt-1" />
                            <Dropdown label={"Document Type"} options={typeOptions} defaultValue={typeOptions[0]} handleChange={handleTypeChange} className="form-select block w-full mt-1" />
                            <Dropdown label={"Section"} options={formOptionsObj[sourceMaterial]} defaultValue={section} handleChange={handleSectionChange} className="form-select block w-full mt-1" />
                            <Dropdown label={"Problem Type"} options={formOptionsObj[sourceMaterial][section]['problem_types']} defaultValue={problemType} handleChange={handleChangeProblemType} className="form-select block w-full mt-1" />
                            <SubmitButton
                                buttonText={"Generate New"}
                                handleClick={handleMathSubmit}
                                className=" mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            /><SubmitButton
                                buttonText={"Search"}
                                handleClick={handleMathSearch}
                                className=" ms-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            />

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

                </>
            }
        </>
    );
};

export default MathTeacherForm;


import React, { useEffect, useMemo, useState } from 'react';
import 'tailwindcss/tailwind.css';
import useSubmitMathForm from '../../hooks/tools/math/useSubmitMathForm';
import { notSecretConstants } from '../../constants/notSecretConstants';
import SubmitButton from '../forms/SubmitButton';
import Dropdown from '../forms/Dropdown';
import { useClerk, useUser } from '@clerk/clerk-react';
import formOptionsJSON from '../../json/dropdown_data.json';
import { ProblemData } from '../../interfaces';
import { useLanguage } from '../../contexts/useLanguage';

type MathGenerateFormProps = {
    onSubmit: (data: any) => void;
    setProblemData: (problemData: ProblemData) => void; // Include the type of ProblemData
};

const MathGenerateForm: React.FC<MathGenerateFormProps> = ({ onSubmit, setProblemData }) => {
    const formOptionsObj = Object(formOptionsJSON);
    const [sourceMaterial, setSourceMaterial] = useState<string>(Object.keys(formOptionsObj)[0]);
    const [section, setSection] = useState<string>(Object.keys(formOptionsObj[sourceMaterial]).filter(key => key !== 'option_text')[0]);
    const [problemType, setProblemType] = useState<string>(formOptionsObj[sourceMaterial][section]['problem_types'][0]);

    const typeOptions = useMemo(() => {
        return ["Worksheet"]
    }, []);

    const [documentType, setDocumentType] = useState<string>(typeOptions[0]);

    const { session, openSignIn } = useClerk();


    const [documentAST, setDocumentAST] = useState<Document | null>(null);



    const { isLoading, error, submitMathForm, data } = useSubmitMathForm(`${window.location.href.includes("https://test.gyosu.ai")
        ? notSecretConstants.testDjangoApi
        : import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/generate/`)

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
            const formData = { documentType, section, userInput: "", problemType, sourceMaterial }
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

    useEffect(() => {
        if (data) {
            onSubmit(data)
        }
    }, [data, onSubmit])

    return (
        <>
            <div className="flex justify-center items-center">
                <div className="w-full md:w-3/4 bg-gray-700 rounded-lg p-8 m-4 shadow-lg">
                    <div className='flex flex-col lg:flex-row justify-center items-center w-full'>
                        <Dropdown showSelected={false} label={"Source Material"} options={formOptionsObj} defaultValue={sourceMaterial} handleChange={handleSourceMaterialChange} className="form-select block me-2 w-full lg:w-1/3" />
                        <Dropdown showSelected={false} label={"Document Type"} options={typeOptions} defaultValue={typeOptions[0]} handleChange={handleTypeChange} className="w-full hidden" />
                        <Dropdown showSelected={false} label={"Section"} options={formOptionsObj[sourceMaterial]} defaultValue={section} handleChange={handleSectionChange} className="form-select block me-2 w-full lg:w-1/3" />
                        <Dropdown showSelected={false} label={"Problem Type"} options={formOptionsObj[sourceMaterial][section]['problem_types']} defaultValue={problemType} handleChange={handleChangeProblemType} className="form-select block w-full lg:w-1/3" />
                    </div>
                    <SubmitButton
                        buttonText={isLoading ? "Loading..." : "Browse Problems"}
                        handleClick={handleMathSubmit}
                        className={`mt-4 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded self-center w-full`}
                        disabled={isLoading}
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


        </>
    );
};

export default MathGenerateForm;


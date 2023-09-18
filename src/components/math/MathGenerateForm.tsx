import React, { useEffect, useMemo, useState } from 'react';
import 'tailwindcss/tailwind.css';
import SubmitButton from '../forms/SubmitButton';
import Dropdown from '../forms/Dropdown';
import { useClerk, useUser } from '@clerk/clerk-react';
import formOptionsJSON from '../../json/dropdown_data.json';
import { ProblemData } from '../../interfaces';
import useEnvironment from '../../hooks/useEnvironment';
import useSubmitMathForm from '../../hooks/tools/math/useSubmitMathForm';

type MathGenerateFormProps = {
    onSubmit: (data: any) => void;
    setProblemData: (problemData: ProblemData) => void; // Include the type of ProblemData
};

const MathGenerateForm: React.FC<MathGenerateFormProps> = ({ onSubmit, setProblemData }) => {

    const formOptionsObj = Object(formOptionsJSON);
    const [sourceMaterial, setSourceMaterial] = useState<string>(Object.keys(formOptionsObj)[0]);
    const firstChapter = Object.keys(formOptionsObj[sourceMaterial].chapters)[0];
    const firstSection = Object.keys(formOptionsObj[sourceMaterial].chapters[firstChapter].sections)[0];
    const [chapter, setChapter] = useState<string>(firstChapter);
    const [section, setSection] = useState<string>(firstSection);
    const [problemType, setProblemType] = useState<string>(
        formOptionsObj[sourceMaterial].chapters[firstChapter].sections[firstSection].problem_types[0].value
    );


    const sourceMaterialOptions = Object.keys(formOptionsObj).map(sm => ({ label: formOptionsObj[sm].label, value: sm }));

    //prob_type
    const problemTypeOptions = formOptionsObj[sourceMaterial]?.chapters[chapter]?.sections[section]?.problem_types;

    // section
    const sectionKeys = Object.keys(formOptionsObj[sourceMaterial].chapters[chapter].sections);
    const sectionOptions = sectionKeys.map(sec => ({ label: formOptionsObj[sourceMaterial].chapters[chapter].sections[sec].label, value: sec }));

    // For Chapter Dropdown
    const chapterOptions = Object.keys(formOptionsObj[sourceMaterial].chapters).map(chap => ({ label: formOptionsObj[sourceMaterial].chapters[chap].label, value: chap }));


    const user = useUser();

    const { session, openSignIn } = useClerk();

    const { apiUrl } = useEnvironment();
    const { isLoading, error, submitMathForm, data } = useSubmitMathForm(`${apiUrl}/math_app/generate/`)

    useEffect(() => {
        const problemData: ProblemData = {
            sourceMaterial,
            section,
            problemType,
            documentType: "Worksheet",
        };

        setProblemData(problemData);
    }, [sourceMaterial, section, problemType, setProblemData]);

    const handleChapterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newChapter = event.target.value;
        setChapter(newChapter);

        const firstSection = Object.keys(formOptionsObj[sourceMaterial].chapters[newChapter]?.sections || {})[0];
        if (firstSection) {
            setSection(firstSection);
            const newProblemTypes = formOptionsObj[sourceMaterial].chapters[newChapter].sections[firstSection]?.problem_types || [];
            if (newProblemTypes.length > 0) {
                setProblemType(newProblemTypes[0].value);
            }
        }
    };

    const handleSectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSection = event.target.value;
        setSection(newSection);

        const newProblemTypes = formOptionsObj[sourceMaterial].chapters[chapter]?.sections[newSection]?.problem_types || [];
        if (newProblemTypes.length > 0) {
            setProblemType(newProblemTypes[0].value);
        }
    };

    const handleSourceMaterialChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSourceMaterial = event.target.value;
        setSourceMaterial(newSourceMaterial);

        const newChapterKeys = Object.keys(formOptionsObj[newSourceMaterial]?.chapters || {});
        const newChapter = newChapterKeys[0];
        if (newChapter) {
            setChapter(newChapter);

            const newSectionKeys = Object.keys(formOptionsObj[newSourceMaterial]?.chapters[newChapter]?.sections || {});
            const firstSection = newSectionKeys[0];
            if (firstSection) {
                setSection(firstSection);

                const newProblemTypes = formOptionsObj[newSourceMaterial]?.chapters[newChapter]?.sections[firstSection]?.problem_types || [];
                if (newProblemTypes.length > 0) {
                    setProblemType(newProblemTypes[0].value);
                }
            }
        }
    };

    const handleChangeProblemType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setProblemType(event.target.value);
    };


    useEffect(() => {
        if (!session) {
            openSignIn()
        }
    }, [session, openSignIn])

    const handleMathSubmit = async () => {
        if (session) {
            const formData = { chapter, section, userInput: "", problemType, sourceMaterial }
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
                <div className="w-full md:w-3/4 mx-4 md:mx-0 bg-gray-700 rounded-lg p-4 my-4 shadow-lg items-center flex flex-col">
                    <div className="flex flex-col lg:flex-row justify-center items-center w-full">
                        <Dropdown
                            showSelected={false}
                            label={"Source Material"}
                            options={sourceMaterialOptions}
                            defaultValue={sourceMaterial}
                            handleChange={handleSourceMaterialChange}
                            className="form-select block me-2 w-full lg:w-1/3"
                        />
                        <Dropdown
                            showSelected={false}
                            label={"Chapter"}
                            options={chapterOptions}
                            defaultValue={chapter}
                            handleChange={handleChapterChange}
                            className="form-select block me-2 w-full lg:w-1/3"
                        />
                        <Dropdown
                            showSelected={false}
                            label={"Section"}
                            options={sectionOptions}
                            defaultValue={section}
                            handleChange={handleSectionChange}
                            className="form-select block me-2 w-full lg:w-1/3"
                        />
                        <Dropdown
                            showSelected={false}
                            label={"Problem Type"}
                            options={problemTypeOptions}
                            defaultValue={problemType}
                            handleChange={handleChangeProblemType}
                            className="form-select block me-2 w-full lg:w-1/3"
                        />
                    </div>
                    <SubmitButton
                        buttonText={"Search"}
                        handleClick={handleMathSubmit}
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded self-center w-1/2"
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


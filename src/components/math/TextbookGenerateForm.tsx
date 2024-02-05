import { useClerk, useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import useSubmitMathForm from '../../hooks/tools/math/useSubmitMathForm';
import useEnvironment from '../../hooks/useEnvironment';
import { GenerateFormData, TextbookProblemData } from '../../interfaces';
import formOptionsJSON from '../../json/dropdown_data.json';
import Dropdown from '../forms/Dropdown';
import SubmitButton from '../forms/SubmitButton';

type TextbookGenerateFormProps = {
    onSubmit: (data: any) => void;
    setGenerateFormData: (problemData: GenerateFormData) => void; // Include the type of ProblemData
};

const TextbookGenerateForm: React.FC<TextbookGenerateFormProps> = ({ onSubmit, setGenerateFormData }) => {

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
        const problemData: TextbookProblemData = {
            sourceMaterial,
            chapter,
            section,
            problemType,
            documentType: "Worksheet",
        };

        setGenerateFormData({ data: problemData });
    }, [sourceMaterial, chapter, section, problemType, setGenerateFormData]);

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
        console.log(session, "session")
        if (session === null) {
            console.log("session is null")
            openSignIn()
        }
    }, [session, openSignIn])

    const handleMathSubmit = async () => {
        if (session) {
            const formData = {
                chapter: chapter,
                section: section,
                problemType: problemType,
                sourceMaterial: sourceMaterial,
                documentType: "worksheet"
            } as TextbookProblemData;

            await submitMathForm({ data: formData });
        }
        else {
            openSignIn()
        }
    };

    useEffect(() => {
        if (data) {
            onSubmit(data)
        }
    }, [data, onSubmit])

    return (
        <>
            <div className="flex flex-col justify-center items-center w-full">
                <Dropdown
                    showSelected={false}
                    label={"Textbook"}
                    options={sourceMaterialOptions}
                    defaultValue={sourceMaterial}
                    handleChange={handleSourceMaterialChange}
                    className="form-select block w-full"
                />
                <Dropdown
                    showSelected={false}
                    label={"Chapter"}
                    options={chapterOptions}
                    defaultValue={chapter}
                    handleChange={handleChapterChange}
                    className="form-select block w-full"
                />
                <Dropdown
                    showSelected={false}
                    label={"Section"}
                    options={sectionOptions}
                    defaultValue={section}
                    handleChange={handleSectionChange}
                    className="form-select block w-full"
                />
                <Dropdown
                    showSelected={false}
                    label={"Problem Type"}
                    options={problemTypeOptions}
                    defaultValue={problemType}
                    handleChange={handleChangeProblemType}
                    className="form-select block w-full"
                />
                <SubmitButton
                    buttonText={"Search"}
                    handleClick={handleMathSubmit}
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full lg:w-1/2"
                />

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

export default TextbookGenerateForm;


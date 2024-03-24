import { useClerk, useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import useSubmitMathForm from '../../hooks/tools/math/useSubmitMathForm';
import useEnvironment from '../../hooks/useEnvironment';
import { useRequireSignIn } from '../../hooks/useRequireSignIn';
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


    useRequireSignIn();


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
            openSignIn({
                afterSignInUrl: window.location.href
            });
        }
    };

    useEffect(() => {
        if (data) {
            onSubmit(data)
        }
    }, [data, onSubmit])

    return (
        <>
            <div className="flex flex-col justify-center items-center w-full p-4">
                <Dropdown
                    showSelected={false}
                    label="Textbook"
                    options={sourceMaterialOptions}
                    defaultValue={sourceMaterial}
                    handleChange={handleSourceMaterialChange}
                    className="w-full max-w-xs"
                />
                <Dropdown
                    showSelected={false}
                    label="Chapter"
                    options={chapterOptions}
                    defaultValue={chapter}
                    handleChange={handleChapterChange}
                    className="w-full max-w-xs mt-2"
                />
                <Dropdown
                    showSelected={false}
                    label="Section"
                    options={sectionOptions}
                    defaultValue={section}
                    handleChange={handleSectionChange}
                    className="w-full max-w-xs mt-2"
                />
                <Dropdown
                    showSelected={false}
                    label="Problem Type"
                    options={problemTypeOptions}
                    defaultValue={problemType}
                    handleChange={handleChangeProblemType}
                    className="w-full max-w-xs mt-2"
                />
                <SubmitButton
                    handleClick={handleMathSubmit}
                    buttonText={"Search"}
                    className="btn mt-4 w-full lg:w-1/2"
                />
            </div>
            {error && <p className="text-error mt-4 text-center">Error: {error}</p>}
            {error && !user?.user?.username && <p className="text-error mt-4 text-center">Note: Our tools require you to be signed in.</p>}
            {isLoading && <p className="text-base-content">Loading...</p>}
            {isLoading && (
                <div className="flex justify-center mt-4">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                </div>
            )}
        </>
    );
};

export default TextbookGenerateForm;


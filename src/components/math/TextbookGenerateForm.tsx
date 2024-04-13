import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import { useRequireSignIn } from '../../hooks/useRequireSignIn';
import { GenerateFormData, TextbookProblemData } from '../../interfaces';
import formOptionsJSON from '../../json/dropdown_data.json';
import Dropdown from '../forms/Dropdown';

type TextbookGenerateFormProps = {
    setGenerateFormData: (problemData: GenerateFormData) => void; // Include the type of ProblemData
    userInput: string;
};

interface Option {
    label: string;
    value: string;
}

const TextbookGenerateForm: React.FC<TextbookGenerateFormProps> = ({ setGenerateFormData, userInput }) => {

    const formOptionsObj = Object(formOptionsJSON);
    const [chapter, setChapter] = useState<string>("");
    const [section, setSection] = useState<string>("");
    const [sourceMaterial, setSourceMaterial] = useState<string>("");
    const [problemType, setProblemType] = useState<string>("");

    const getSafeValue = (obj: any, path: string[], defaultValue: any = []) => {
        return path.reduce((acc, key) => acc?.[key] ?? defaultValue, obj);
    };

    // Initial values computation
    const initialSourceMaterialOptions = Object.keys(formOptionsObj).map(sm => ({
        label: formOptionsObj[sm]?.label ?? 'Default Label',
        value: sm
    }));

    const initialProblemTypeOptions = getSafeValue(formOptionsObj, [Object.keys(formOptionsObj)[0], 'chapters', chapter, 'sections', section, 'problem_types'], []);

    const sectionBasePath = [Object.keys(formOptionsObj)[0], 'chapters', chapter, 'sections'];
    const sectionObj = getSafeValue(formOptionsObj, sectionBasePath, {});
    const initialSectionOptions = Object.keys(sectionObj).map(sec => ({
        label: sectionObj[sec]?.label ?? 'Default Section Label',
        value: sec
    }));

    const chaptersObj = getSafeValue(formOptionsObj, [Object.keys(formOptionsObj)[0], 'chapters'], {});
    const initialChapterOptions = Object.keys(chaptersObj).map(chap => ({
        label: chaptersObj[chap]?.label ?? 'Default Chapter Label',
        value: chap
    }));

    // useState hooks
    const [sourceMaterialOptions, setSourceMaterialOptions] = useState(initialSourceMaterialOptions);
    const [problemTypeOptions, setProblemTypeOptions] = useState(initialProblemTypeOptions);
    const [chapterOptions, setChapterOptions] = useState<Option[]>([]);
    const [sectionOptions, setSectionOptions] = useState<Option[]>([]);

    useEffect(() => {
        const problemData: TextbookProblemData = {
            sourceMaterial,
            chapter,
            section,
            problemType,
            documentType: "Worksheet",
            userInput
        };

        setGenerateFormData({ data: problemData });
    }, [sourceMaterial, chapter, section, problemType, setGenerateFormData, userInput]);

    const handleSourceMaterialChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSourceMaterial = event.target.value;
        setSourceMaterial(newSourceMaterial);

        // Reset chapter, section, and problemType to initial states
        setChapter('');
        setSection('');
        setProblemType('');

        // Compute new chapter options based on the newly selected source material
        const newChapterKeys = Object.keys(formOptionsObj[newSourceMaterial]?.chapters || {});
        const newChapterOptions: Option[] = newChapterKeys.map(chapKey => ({
            label: formOptionsObj[newSourceMaterial]?.chapters[chapKey]?.label ?? 'Default Chapter Label',
            value: chapKey
        }));

        // Update state, and reset rest
        setChapterOptions(newChapterOptions);
        setSectionOptions([]);
        setProblemTypeOptions([]);

    };

    const handleChapterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newChapter = event.target.value;
        setChapter(newChapter);

        setSection('');
        setProblemType('');

        // Compute new section options based on the new chapter
        const newSectionBasePath = [Object.keys(formOptionsObj)[0], 'chapters', newChapter, 'sections'];
        const newSectionObj = getSafeValue(formOptionsObj, newSectionBasePath, {});
        const newSectionOptions = Object.keys(newSectionObj).map(sec => ({
            label: newSectionObj[sec]?.label ?? 'Default Section Label',
            value: sec
        }));

        // Update state, and reset rest
        setSectionOptions(newSectionOptions);
        setProblemTypeOptions([]);

    };

    const handleSectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSection = event.target.value;
        setSection(newSection);

        // Directly reset problemType to an empty string when a new section is selected
        setProblemType('');

        // Compute new problem types based on the newly selected section
        const newProblemTypes = formOptionsObj[sourceMaterial]?.chapters[chapter]?.sections[newSection]?.problem_types || [];

        // Optionally, update problem type options state if you have such a state variable
        // This is just an example of how you might update the options for a dropdown of problem types
        const newProblemTypeOptions = newProblemTypes.map((pt: Option) => ({
            label: pt.label ?? 'Default Problem Type Label',
            value: pt.value
        }));
        // Assuming you have a state for problemTypeOptions, you would update it like this:
        setProblemTypeOptions(newProblemTypeOptions);
    };

    const handleChangeProblemType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setProblemType(event.target.value);
    };


    useRequireSignIn();


    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <Dropdown
                    showSelected={true}
                    label="Textbook (optional)"
                    options={sourceMaterialOptions}
                    value={sourceMaterial}
                    handleChange={handleSourceMaterialChange}
                    className="w-full"
                />
                {sourceMaterial && <Dropdown
                    showSelected={true}
                    label="Chapter (optional)"
                    options={chapterOptions}
                    value={chapter}
                    handleChange={handleChapterChange}
                    className="w-full mt-2"
                />}
                {chapter && <Dropdown
                    showSelected={true}
                    label="Section (optional)"
                    options={sectionOptions}
                    value={section}
                    handleChange={handleSectionChange}
                    className="w-full mt-2"
                />}
                {section && <Dropdown
                    showSelected={true}
                    label="Problem Type (optional)"
                    options={problemTypeOptions}
                    value={problemType}
                    handleChange={handleChangeProblemType}
                    className="w-full mt-2"
                />}
                {/* <SubmitButton
                    handleClick={handleMathSubmit}
                    disabled={isLoading}
                    buttonText={"Search"}
                    className="btn mt-4 w-full lg:w-1/2"
                /> */}
            </div>
            
        </>
    );
};

export default TextbookGenerateForm;


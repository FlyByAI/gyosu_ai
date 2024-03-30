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
import MathProblems from './MathProblems';

type TextbookGenerateFormProps = {
    setGenerateFormData: (problemData: GenerateFormData) => void; // Include the type of ProblemData
};

interface Option {
    label: string;
    value: string;
}

const TextbookGenerateForm: React.FC<TextbookGenerateFormProps> = ({ setGenerateFormData }) => {

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


    const user = useUser();

    const { session, openSignIn } = useClerk();

    const [userInput, setUserInput] = useState('');
    const { apiUrl } = useEnvironment();
    const { isLoading, error, submitMathForm, data } = useSubmitMathForm(`${apiUrl}/math_app/generate/`)

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


    const handleMathSubmit = async () => {
        if (session) {
            const formData = {
                chapter: chapter,
                section: section,
                problemType: problemType,
                sourceMaterial: sourceMaterial,
                documentType: "worksheet",
                userInput: userInput,
            } as TextbookProblemData;

            await submitMathForm({ data: formData });
        }
        else {
            openSignIn({
                afterSignInUrl: window.location.href
            });
        }
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center w-full p-4">
                <div className="form-control w-full max-w-xs mb-4">
                    <label className="label">
                        <span className="label-text">Search for math problems</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="input input-bordered w-full"
                        placeholder="sin and cos, fractions, etc. "
                    />
                </div>
                <Dropdown
                    showSelected={true}
                    label="Textbook (optional)"
                    options={sourceMaterialOptions}
                    value={sourceMaterial}
                    handleChange={handleSourceMaterialChange}
                    className="w-full max-w-xs"
                />
                {sourceMaterial && <Dropdown
                    showSelected={true}
                    label="Chapter (optional)"
                    options={chapterOptions}
                    value={chapter}
                    handleChange={handleChapterChange}
                    className="w-full max-w-xs mt-2"
                />}
                {chapter && <Dropdown
                    showSelected={true}
                    label="Section (optional)"
                    options={sectionOptions}
                    value={section}
                    handleChange={handleSectionChange}
                    className="w-full max-w-xs mt-2"
                />}
                {section && <Dropdown
                    showSelected={true}
                    label="Problem Type (optional)"
                    options={problemTypeOptions}
                    value={problemType}
                    handleChange={handleChangeProblemType}
                    className="w-full max-w-xs mt-2"
                />}
                <SubmitButton
                    handleClick={handleMathSubmit}
                    disabled={isLoading || userInput === ''}
                    buttonText={"Search"}
                    className="btn mt-4 w-full lg:w-1/2"
                />
            </div>
            {error && <p className="text-error mt-4 text-center">Error: {error.message}</p>}
            {error && !user?.user?.username && <p className="text-error mt-4 text-center">Note: Our tools require you to be signed in.</p>}
            {isLoading && <p className="text-base-content">Loading...</p>}
            {isLoading && (
                <div className="flex justify-center mt-4">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                </div>
            )}

            {data && (
                <div className="card rounded-lg p-4 my-4 bg-base-100 shadow-lg">
                    <div className="text-xl justify-center flex items-center mb-4 italic">Step 3: Add problems to a problem bank.</div>
                    <MathProblems
                        chunkArray={data.response}
                    />
                </div>
            )}
        </>
    );
};

export default TextbookGenerateForm;


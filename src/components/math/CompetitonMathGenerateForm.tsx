import { useClerk, useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import useSubmitMathForm from '../../hooks/tools/math/useSubmitMathForm';
import useEnvironment from '../../hooks/useEnvironment';
import { CompetitionData, GenerateFormData } from '../../interfaces';
import formOptionsJSON from '../../json/competition_math_data.json';
import Dropdown from '../forms/Dropdown';
import SubmitButton from '../forms/SubmitButton';

type CompetitionMathGenerateFormProps = {
    onSubmit: (data: any) => void;
    setGenerateFormData: (problemData: GenerateFormData) => void;
};

const CompetitionMathGenerateForm: React.FC<CompetitionMathGenerateFormProps> = ({ onSubmit, setGenerateFormData }) => {
    const formOptionsObj = Object(formOptionsJSON)["competition_math"];
    const [userInput, setUserInput] = useState('');

    const [problemType, setProblemType] = useState<string>("");

    const [level, setLevel] = useState<string>(() => {
        return formOptionsObj?.problem_types?.[problemType]?.levels?.[0]?.value || '';
    });

    const problemTypeOptions = Object.keys(formOptionsObj.problem_types)
        .filter(key => key !== 'label')
        .map(type => ({ label: formOptionsObj.problem_types[type].label, value: type }));

    const [levelOptions, setLevelOptions] = useState([]);

    const { apiUrl } = useEnvironment();

    const { user } = useUser();

    const { session, openSignIn } = useClerk();

    const { isLoading, error, submitMathForm, data } = useSubmitMathForm(`${apiUrl}/math_app/generate/`);

    useEffect(() => {
        const problemData = {
            problemType,
            level,
        };
        setGenerateFormData({ data: problemData });
    }, [problemType, level, setGenerateFormData]);

    const handleProblemTypeChange = (newValue: string) => {
        setLevelOptions(formOptionsObj?.problem_types?.[newValue]?.levels || [])
        setProblemType(newValue);
        setLevel("");
    };

    const handleLevelChange = (newValue: string) => {
        setLevel(newValue);
    };

    const handleMathSubmit = async () => {
        if (session) {
            const formData = {
                sourceMaterial: "competition_math",
                problemType,
                level,
                userInput: userInput,

            } as CompetitionData;
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
            onSubmit(data);
        }
    }, [data, onSubmit]);

    return (
        <>
            <div className="flex flex-col justify-center items-center w-full p-4">
                <div className="form-control w-full max-w-xs mb-4">
                    <label className="label">
                        <span className="label-text">Search for math problems</span>
                    </label>
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="input input-bordered w-full"
                        placeholder="sin and cos, fractions, etc. "
                    />
                </div>
                <Dropdown
                    showSelected={false}
                    label={"Problem Type"}
                    options={problemTypeOptions}
                    value={problemType}
                    handleChange={(e) => handleProblemTypeChange(e.target.value)}
                    className="w-full max-w-xs"
                />
                {problemType && <Dropdown
                    showSelected={false}
                    label={"Level"}
                    options={levelOptions}
                    value={level}
                    handleChange={(e) => handleLevelChange(e.target.value)}
                    className="w-full max-w-xs mt-2"

                />}
                <SubmitButton
                    buttonText={"Search"}
                    handleClick={handleMathSubmit}
                    className="btn mt-4 w-full lg:w-1/2"
                />
            </div>

            {error && <p className="text-red-600 mt-4 text-center">Error: {error}</p>}
            {error && !user?.username && <p className="text-red-600 mt-4 text-center">Note: {"Our tools require you to be signed in."}</p>}
            {isLoading && <p className="dark:text-white">Loading...</p>}
            {isLoading && (
                <div className="flex justify-center mt-4">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                </div>
            )}
        </>
    );
};

export default CompetitionMathGenerateForm;

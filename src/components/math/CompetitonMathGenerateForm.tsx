import { useClerk, useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import useSubmitMathForm from '../../hooks/tools/math/useSubmitMathForm';
import useEnvironment from '../../hooks/useEnvironment';
import { Chunk, CompetitionData, GenerateFormData } from '../../interfaces';
import formOptionsJSON from '../../json/competition_math_data.json'; // Adjust this import
import Dropdown from '../forms/Dropdown';
import SubmitButton from '../forms/SubmitButton';

type CompetitionMathGenerateFormProps = {
    onSubmit: (data: any) => void;
    setGenerateFormData: (problemData: GenerateFormData) => void;
};

const CompetitionMathGenerateForm: React.FC<CompetitionMathGenerateFormProps> = ({ onSubmit, setGenerateFormData }) => {
    const formOptionsObj = Object(formOptionsJSON)["competition_math"];

    const [problemType, setProblemType] = useState<string>(() => {
        const problemTypeKeys = Object.keys(formOptionsObj.problem_types).filter(key => key !== 'label');
        return problemTypeKeys[0] || '';
    });

    const [level, setLevel] = useState<string>(() => {
        return formOptionsObj?.problem_types?.[problemType]?.levels?.[0]?.value || '';
    });

    const problemTypeOptions = Object.keys(formOptionsObj.problem_types)
        .filter(key => key !== 'label')
        .map(type => ({ label: formOptionsObj.problem_types[type].label, value: type }));


    const levelOptions = formOptionsObj?.problem_types?.[problemType]?.levels || [];

    const { apiUrl } = useEnvironment();

    const user = useUser();

    const { session, openSignIn } = useClerk();

    const { isLoading, error, submitMathForm, data } = useSubmitMathForm(`${apiUrl}/math_app/generate/`)

    const [chunkArray, setChunkArray] = useState<Chunk[]>([]);

    useEffect(() => {
        const problemData = {
            problemType,
            level,
        };
        setGenerateFormData({ data: problemData });
    }, [problemType, level, setGenerateFormData]);

    const handleProblemTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newProblemType = event.target.value;
        setProblemType(newProblemType);

        const firstLevel = formOptionsObj.problem_types[newProblemType]?.levels[0]?.value;
        if (firstLevel) {
            setLevel(firstLevel);
        }
    };

    const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLevel(event.target.value);
    };

    const handleMathSubmit = async () => {
        if (session) {
            const formData = { sourceMaterial: "competition_math", problemType, level } as CompetitionData;
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
            <div className="flex flex-col justify-center items-center w-full mx-auto">
                <Dropdown
                    showSelected={false}
                    label={"Problem Type"}
                    options={problemTypeOptions}
                    defaultValue={problemType}
                    handleChange={handleProblemTypeChange}
                    className="form-select block w-full"
                />
                <Dropdown
                    showSelected={false}
                    label={"Level"}
                    options={levelOptions}
                    defaultValue={level}
                    handleChange={handleLevelChange}
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

export default CompetitionMathGenerateForm;

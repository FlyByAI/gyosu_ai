import React, { useEffect, useState } from 'react';
import { GenerateFormData } from '../../interfaces';
import formOptionsJSON from '../../json/competition_math_data.json';
import Dropdown from '../forms/Dropdown';

type CompetitionMathGenerateFormProps = {
    setGenerateFormData: (problemData: GenerateFormData) => void;
    userInput: string;
};

const CompetitionMathGenerateForm: React.FC<CompetitionMathGenerateFormProps> = ({ setGenerateFormData, userInput }) => {
    const formOptionsObj = Object(formOptionsJSON)["competition_math"];

    const [problemType, setProblemType] = useState<string>("");

    const [level, setLevel] = useState<string>(() => {
        return formOptionsObj?.problem_types?.[problemType]?.levels?.[0]?.value || '';
    });

    const problemTypeOptions = Object.keys(formOptionsObj.problem_types)
        .filter(key => key !== 'label')
        .map(type => ({ label: formOptionsObj.problem_types[type].label, value: type }));

    const [levelOptions, setLevelOptions] = useState([]);


    useEffect(() => {
        const problemData = {
            problemType,
            level,
            sourceMaterial: "competition_math",
            userInput,
        };
        setGenerateFormData({ data: problemData });
    }, [problemType, level, setGenerateFormData, userInput]);

    const handleProblemTypeChange = (newValue: string) => {
        setLevelOptions(formOptionsObj?.problem_types?.[newValue]?.levels || [])
        setProblemType(newValue);
        setLevel("");
    };

    const handleLevelChange = (newValue: string) => {
        setLevel(newValue);
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <Dropdown
                    showSelected={false}
                    label={"Problem Type (optional)"}
                    options={problemTypeOptions}
                    value={problemType}
                    handleChange={(e) => handleProblemTypeChange(e.target.value)}
                    className="w-full"
                />
                {problemType && <Dropdown
                    showSelected={false}
                    label={"Level"}
                    options={levelOptions}
                    value={level}
                    handleChange={(e) => handleLevelChange(e.target.value)}
                    className="w-full mt-2"

                />}
                {/* <SubmitButton
                    buttonText={"Search"}
                    handleClick={handleMathSubmit}
                    className="btn mt-4 w-full lg:w-1/2"
                /> */}
            </div>

            
        </>
    );
};

export default CompetitionMathGenerateForm;

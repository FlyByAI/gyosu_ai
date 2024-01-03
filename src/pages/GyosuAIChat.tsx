import React, { useState } from 'react';
import formOptionsJSON from '../json/dropdown_data.json';
import Dropdown from '../components/forms/Dropdown';
import StreamedResponseMultikeyComponent from '../components/StreamResponseMultiKeyComponent';
import useEnvironment from '../hooks/useEnvironment';

const GyosuAIChat = () => {
    const formOptionsObj = Object(formOptionsJSON);
    const [sourceMaterial, setSourceMaterial] = useState<string>(Object.keys(formOptionsObj)[0]);
    const [userInput, setUserInput] = useState('');
    const sourceMaterialOptions = Object.keys(formOptionsObj).map(sm => ({ label: formOptionsObj[sm].label, value: sm }));

    const handleSourceMaterialChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSourceMaterial = event.target.value;
        setSourceMaterial(newSourceMaterial);
    };

    const { apiUrl } = useEnvironment();

    const agentEndpoint = `${apiUrl}/math_app/agent/`;

    const [formError, setFormError] = useState<string | null>(null);

    const handleSubmit = (startStreaming: (bodyContent: any) => void) => {
        console.log('Data submitted:', { sourceMaterial, userInput });

        setFormError(null); // Clear any previous error

        if (userInput.trim() === '') {
            setFormError('Please enter text for search before submitting.');
            return;
        }

        setFormError(null); // Clear any previous error
        startStreaming({ data: { sourceMaterial, userInput } });

    };

    return (
        <>
            <div className="w-full max-w-xl flex-col justify-center mx-auto">
                <div className="w-full">
                    <label className="block tracking-wide text-white text-md font-bold mb-2" htmlFor="textbook-dropdown">
                        Textbook
                    </label>
                    <div className="relative">
                        <Dropdown
                            showSelected={false}
                            label={""}
                            options={sourceMaterialOptions}
                            defaultValue={sourceMaterial}
                            handleChange={handleSourceMaterialChange}
                            className="form-select block w-full"
                        />
                    </div>
                </div>
                <div className="w-full">
                    <label className="block tracking-wide text-white text-md font-bold mb-2" htmlFor="user-input">
                        Search for problems
                    </label>
                    <textarea
                        id="user-input"
                        className="form-select block w-full mb-4 p-2"
                        placeholder="Ask a question..."
                        rows={4}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                    />
                    {formError && <p className="text-red-500 text-xs italic mt-2 my-2">{formError}</p>}
                </div>
                <StreamedResponseMultikeyComponent endpoint={agentEndpoint} onSubmit={handleSubmit} />
            </div>

        </>
    );
};

export default GyosuAIChat;

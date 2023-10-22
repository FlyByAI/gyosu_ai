import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import useEnvironment from '../hooks/useEnvironment';
import useGetDocuments from '../hooks/tools/math/useGetDocuments';
// import { useSubmitContentPlaygroundForm } from 'path_to_your_hook';
// import { useYourProblemBankHook } from 'path_to_your_problem_bank_hook';
import formOptionsJSON from '../json/dropdown_data.json';

const ContentPlayground = () => {
    const [formData, setFormData] = useState({
        textbook: '',
        useExistingBank: true,
        problemBank: null,
        teachingTarget: '',
        contentType: '',
        contentLength: '',
        additionalDetails: ''
    });

    const { apiUrl } = useEnvironment();
    const endpoint = `${apiUrl}/math_app/school_document/list/`;
    const { documents, error } = useGetDocuments(endpoint);

    // Uncomment and import when your hooks are ready.
    // const { submitTextWithChunk, isLoading, error, data } = useSubmitContentPlaygroundForm();
    // const { problemBanks } = useYourProblemBankHook();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: name === 'useExistingBank' ? value === 'true' : value,
        }));
    };


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // submitTextWithChunk(formData); // Uncomment when your hook is ready.
    };

    const handleChangeTextbook = (e: ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            textbook: value,
        }));
    };

    const formOptionsObj = Object(formOptionsJSON);
    const sourceMaterialOptions = Object.keys(formOptionsObj).map(sm => ({ label: formOptionsObj[sm].label, value: sm }));


    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex space-x-20">

                {/* Left Form Card */}
                <div className="w-2/5 bg-white p-6 rounded-md shadow-md">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="textbook">
                                Textbook:
                            </label>
                            <select
                                id="textbook"
                                name="textbook"
                                value={formData.textbook}
                                onChange={handleChangeTextbook}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                {sourceMaterialOptions.map((option) => (
                                    <option value={option.value} key={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Problem Selection:
                            </label>
                            <select
                                name="useExistingBank"
                                value={formData.useExistingBank.toString()}
                                onChange={handleChange} // Using the same handler for all form fields
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="true">Use Existing Problem Bank</option>
                                <option value="false">Select Problems Automatically</option>
                            </select>
                        </div>

                        {formData.useExistingBank ? (
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="problemBank">
                                    Select a Problem Bank:
                                </label>
                                <select
                                    id="problemBank"
                                    name="problemBank"
                                    value={formData.problemBank || ''}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="" disabled>Select a bank</option>
                                    {documents?.map((doc) => (
                                        <option value={doc.id} key={doc.id}>{doc.title}</option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="teachingTarget">
                                    Teaching Target:
                                </label>
                                <input
                                    type="text"
                                    id="teachingTarget"
                                    name="teachingTarget"
                                    value={formData.teachingTarget}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="What are you trying to teach?"
                                />
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contentType">
                                Content Type:
                            </label>
                            <input
                                type="text"
                                id="contentType"
                                name="contentType"
                                value={formData.contentType}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter the content type"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contentLength">
                                Content Length:
                            </label>
                            <input
                                type="text"
                                id="contentLength"
                                name="contentLength"
                                value={formData.contentLength}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter the content length"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="additionalDetails">
                                Additional Details:
                            </label>
                            <textarea
                                id="additionalDetails"
                                name="additionalDetails"
                                value={formData.additionalDetails}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Any additional details for the AI"
                            />
                        </div>

                        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Submit
                        </button>
                    </form>
                </div>

                {/* Right Output Card */}
                <div className="w-2/5 bg-white p-6 rounded-md shadow-md">
                    {/* Uncomment below when your hook is ready */}
                    {/* {isLoading && <p>Loading...</p>} */}
                    {/* {error && <p className="text-red-500">{error.message}</p>} */}
                    {/* {data && <p>{data}</p>} */}
                    <p>Output will be displayed here.</p>
                </div>

            </div>
        </div>
    );
};

export default ContentPlayground;

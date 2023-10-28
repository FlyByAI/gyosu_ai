import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import useEnvironment from '../hooks/useEnvironment';
import useGetDocuments from '../hooks/tools/math/useGetDocuments';
import formOptionsJSON from '../json/dropdown_data.json';
import { useClerk } from '@clerk/clerk-react';
import { PlaygroundFormData } from '../hooks/tools/math/useSubmitPlayground';
import StreamedResponseComponent from './StreamResponseComponent';

const ContentPlayGroundStreamed = () => {

    const { session, openSignIn } = useClerk();
    useEffect(() => {
        if (!session) {
            openSignIn()
        }
    }, [session, openSignIn])


    const [formData, setFormData] = useState({
        textbook: '',
        useExistingBank: true,
        problemBank: null,
        teachingTarget: '',
        contentType: '',
        contentLength: '',
        additionalDetails: ''
    } as PlaygroundFormData);

    const { apiUrl } = useEnvironment();

    const endpoint = `${apiUrl}/math_app/school_document/list/`;
    const { documents, error } = useGetDocuments(endpoint);

    const playgroundEndpoint = `${apiUrl}/math_app/playground/stream_example/`;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: name === 'useExistingBank' ? value === 'true' : value,
        }));
    };


    const handleSubmit = (startStreaming: (bodyContent: any) => void) => {
        console.log("hand submit")
        const bodyContent = { ...formData }
        startStreaming(bodyContent);
        console.log("submit playground")
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
        <div className="flex justify-center mt-8" style={{ height: 'calc(100vh - 140px)' }}>
            <div className="w-full flex space-x-10 mx-auto justify-center">

                {/* Left Form Card */}
                <div className="relative w-2/5 bg-white p-6 rounded-md shadow-md overflow-y-scroll" style={{ maxHeight: 'calc(100vh - 60px)' }}>



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
                        <>
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
                                    placeholder="What topic are you trying to teach?"
                                />
                            </div>
                        </>
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
                            placeholder="Worksheet, Class Activity, Quiz..."
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
                            placeholder="1 page, 1 paragraph, etc."
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

                    <button
                        onClick={() => handleSubmit}
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Submit
                    </button>


                </div>

                {/* Right Output Card */}
                <div className="w-2/5 bg-white p-6 rounded-md shadow-md">
                    <StreamedResponseComponent endpoint={playgroundEndpoint} onSubmit={handleSubmit} />
                </div>

            </div>
        </div>
    );
};

export default ContentPlayGroundStreamed;

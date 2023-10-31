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
        problemBankId: null,
        teachingTarget: '',
        contentType: '',
        contentLength: '',
        additionalDetails: ''
    } as PlaygroundFormData);

    const { apiUrl } = useEnvironment();

    const endpoint = `${apiUrl}/math_app/school_document/list/`;
    const { documents, error } = useGetDocuments(endpoint);

    const playgroundEndpoint = `${apiUrl}/math_app/playground/stream/`;

    const [formError, setFormError] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: name === 'useExistingBank' ? value === 'true' : value,
        }));
    };


    const handleSubmit = (startStreaming: (bodyContent: any) => void) => {
        if (formData.problemBankId === null || formData.problemBankId === undefined) {
            setFormError('Please select a Problem Bank before submitting.');
            return; // Prevent form from being submitted
        }

        setFormError(null); // Clear any previous error
        startStreaming(formData);
    };


    // const handleChangeTextbook = (e: ChangeEvent<HTMLSelectElement>) => {
    //     const { value } = e.target;
    //     setFormData(prevState => ({
    //         ...prevState,
    //         textbook: value,
    //     }));
    // };

    // const formOptionsObj = Object(formOptionsJSON);
    // const sourceMaterialOptions = Object.keys(formOptionsObj).map(sm => ({ label: formOptionsObj[sm].label, value: sm }));


    return (
        <div className="flex justify-center mt-12 md:mt-0" style={{ height: 'calc(100vh - 140px)' }}>
            <div className="w-full flex md:space-x-10 mx-auto justify-center flex-col md:flex-row h-fit">

                {/* Left Form Card */}
                <div className="relative w-full md:w-2/5 mb-4 md:mb-0 bg-white p-6 rounded-md shadow-md overflow-y-scroll h-fit" style={{ maxHeight: 'calc(100vh - 60px)' }}>



                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="problemBankId">
                            Select a Problem Bank:
                        </label>
                        <select
                            id="problemBankId"
                            name="problemBankId"
                            value={formData.problemBankId || ''}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="" disabled>Select a bank</option>
                            {documents?.map((doc) => (
                                <option value={doc.id} key={doc.id}>{doc.title}</option>
                            ))}
                        </select>

                    </div>
                    {formError && <p className="bg-white text-red-500 text-xs italic mt-2 my-2">{formError}</p>}

                </div>




                {/* Right Output Card */}
                <div className="w-full md:w-2/5 bg-white p-6 rounded-md shadow-md h-fit">

                    <StreamedResponseComponent endpoint={playgroundEndpoint} onSubmit={handleSubmit} />
                </div>

            </div>
        </div>
    );
};

export default ContentPlayGroundStreamed;


import React, { useEffect, useState } from 'react';
import useGetDocuments from '../hooks/tools/math/useGetDocuments';
import useSubmitDocument from '../hooks/tools/math/useSubmitDocument';
import useEnvironment from '../hooks/useEnvironment';
import { useRequireSignIn } from '../hooks/useRequireSignIn';
import PlusIcon from '../svg/PlusIcon';

import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import EditTitle from '../components/document/EditTitle';
import ProblemBankPreview from '../components/forms/ProblemBankPreview';
import { Chunk, Document } from '../interfaces';
import TrashIcon from '../svg/TrashIcon';
const MyProblemBanks: React.FC = () => {
    const navigate = useNavigate();
    useRequireSignIn();

    const { apiUrl } = useEnvironment();
    const endpoint = `${apiUrl}/math_app/school_document/list/`;

    const endpoint2 = `${apiUrl}/math_app/school_document/`;

    const { documents, error } = useGetDocuments(endpoint);

    // track for navigate so we can go to a bank when it is first created.
    const [createdNewDocument, setCreatedNewDocument] = useState(false);

    const { data, submitDocument, deleteDocument, updateDocument } = useSubmitDocument(endpoint2);


    useEffect(() => {
        if (data?.id && createdNewDocument) {
            console.log(data.id)
            navigate(`/math-app/bank/${data.id}`);
            console.log('navigated to new bank')
        }
    }, [createdNewDocument, data, navigate])

    if (error) {
        return <div>Error loading documents: {(error as unknown as Error).message}</div>;
    }

    const handleDeleteClick = (document: Document) => {
        if (document) {
            const confirmDelete = window.confirm('Are you sure you want to delete this document? This action cannot be undone.');
            if (confirmDelete) {
                deleteDocument(document);
            }
        }
    };


    const handleAddDocument = async () => {
        const newDocument: Document = {
            title: 'New Problem Bank',
            upvotes: 0,
            tips: 0,
            lastModifiedBy: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            problemChunks: [{ type: "chunk", content: [] }] as Chunk[],
        };

        await submitDocument({ document: newDocument });
        toast('Created new problem bank...')
        setCreatedNewDocument(true);
    };


    return (
        <div className="py-4">
            {/* {showBankElement()} */}
            <div className="text-3xl font-semibold text-center my-4">
                Manage your Problem Banks
                <p className="text-2xl text-gray-600 mt-4">Select a bank to view or create a new one. Here, you can organize and access all your problem sets easily.</p>
            </div>
            <button onClick={handleAddDocument} className="btn btn-secondary w-1/3 mx-auto rounded-lg flex items-center justify-center gap-2 py-2 my-8 text-lg md:text-xl">
                Create new problem bank<PlusIcon className="w-7 h-7" />
            </button>
            <div className="w-full" >
                <div className="flex flex-row justify-center mt-4 mx-4">
                    {/* DaisyUI Accordion */}
                    <div className="w-full md:w-3/4" tabIndex={0}>
                        <div className="flex items-center justify-center w-full text-xl">
                            Problem Banks
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {/* Content of the Accordion */}
                        <div className='accordion space-y-4'>
                            {documents?.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                                .map((doc, index) => (
                                    <>
                                        <div className="flex flex-row justify-between">
                                            <EditTitle title={doc?.title} onUpdateTitle={(title) => updateDocument({ document: { ...doc, title: title } })} />
                                            <div className='flex flex-row ms-4'>
                                                <button className="btn btn-primary tooltip" data-tip="View this problem bank." onClick={() => navigate(`/math-app/bank/${doc.id}`)}>View</button>
                                                <button
                                                    className="btn btn-error tooltip tooltip-left ms-4"
                                                    data-tip="Delete this problem bank."
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteClick(doc);
                                                    }}
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="collapse collapse-arrow join-item border border-base-300"
                                            key={index}>
                                            <input type="radio" name="my-accordion-4" id={`accordion-${index}`} defaultChecked={index === 0} />
                                            <label htmlFor={`accordion-${index}`} className="collapse-title text-xl font-medium flex flex-row justify-between">
                                                {/* <h3 className="text-lg font-medium truncate">{doc.title}</h3> */}

                                                {doc?.problemChunks?.length || 0} problems
                                            </label>
                                            <div className="collapse-content relative group">
                                                <div
                                                    className="tooltip w-full text-left hover:border-2 hover:border-secondary"
                                                    data-tip="Click to view"
                                                >
                                                    <ProblemBankPreview document={doc} />
                                                </div>
                                            </div>

                                        </div>
                                    </>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProblemBanks;
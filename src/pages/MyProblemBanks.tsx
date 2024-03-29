
import React from 'react';
import ProblemBankShelf from '../components/document/ProblemBankShelf';
import DocumentPreview from '../components/forms/DocumentPreview';
import GridContainer1x1 from '../components/grids/GridContainer1x1';
import useGetDocuments from '../hooks/tools/math/useGetDocuments';
import useSubmitDocument from '../hooks/tools/math/useSubmitDocument';
import useEnvironment from '../hooks/useEnvironment';
import { useRequireSignIn } from '../hooks/useRequireSignIn';
import PlusIcon from '../svg/PlusIcon';
import { getShowClass } from './MathGenerate';

import toast from 'react-hot-toast';
import { Chunk, Document } from '../interfaces';
const MyProblemBanks: React.FC = () => {

    useRequireSignIn();

    const { apiUrl } = useEnvironment();
    const endpoint = `${apiUrl}/math_app/school_document/list/`;

    const endpoint2 = `${apiUrl}/math_app/school_document/`;

    const { documents, error } = useGetDocuments(endpoint);

    const { submitDocument, deleteDocument } = useSubmitDocument(endpoint2);

    if (error) {
        return <div>Error loading documents: {(error as unknown as Error).message}</div>;
    }
    const showBankElement = () => {
        return (
            <div className='w-1/4'>
                <div style={{ position: 'fixed', top: '80px', left: '10px', zIndex: 999 }}> {/* This div contains the sidebar */}
                    <div className={`card bg-base-200 shadow-lg my-4 md:my-0 md:mr-4 p-4 ${getShowClass('desktop')}`}>
                        <ProblemBankShelf isExporting={false} />
                    </div>
                </div >
            </div>
        )
    }

    // const handleEditClick = (e: React.MouseEvent) => {
    //     e.stopPropagation();
    //     setTitle(document?.title || '');
    //     setIsEditing(true);
    //     setIsOverflowOpen(false);
    // };

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
            problemChunks: [] as Chunk[],
        };

        await submitDocument({ document: newDocument });
        toast('Created new problem bank...')

    };

    return (
        <div>
            {/* {showBankElement()} */}

            <button onClick={handleAddDocument} className="btn btn-secondary w-full rounded-lg flex items-center justify-center gap-2 py-2 text-sm md:text-lg ">
                Create<PlusIcon className="w-5 h-5" />
            </button>
            <div className="w-full" >
                <div className="flex flex-row justify-center mt-4 mx-4">
                    {/* DaisyUI Accordion */}
                    <div className="accordion w-3/4" tabIndex={0}>
                        <div className="accordion-item">
                            <div className="accordion-title">
                                <div className="flex items-center justify-center w-full">
                                    My Problem Banks
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="accordion-content">
                                {/* Content of the Accordion */}
                                <GridContainer1x1>
                                    {documents?.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                                        .map((doc, index) => (
                                            <DocumentPreview key={index} document={doc} handleDelete={handleDeleteClick} />
                                    ))}
                                </GridContainer1x1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProblemBanks;
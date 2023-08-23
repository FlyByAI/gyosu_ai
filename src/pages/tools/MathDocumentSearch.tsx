import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import { notSecretConstants } from '../../constants/notSecretConstants';
import useFetchDocuments from '../../hooks/tools/math/useFetchDocuments';
import Accordion from '../../components/Accordion';
import GridContainer3x3 from '../../components/grids/GridContainer3x3';
import DocumentPreview from '../../components/forms/DocumentPreview';
import MathDocumentSearchForm from '../../components/math/MathDocumentSearchForm';
import { ProblemData } from '../../interfaces';
import DocumentShelf from '../../components/document/DocumentShelf';
import useSearchMathDocuments from '../../hooks/tools/math/useSearchDocuments';

const MathDocumentSearch: React.FC = () => {

    const { documents, error } = useFetchDocuments(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/documents/recent/`);

    return (
        <div className="flex">
            <DocumentShelf isExporting={false} />
            <div className="w-5/6">
                <MathDocumentSearchForm />

                {documents && <div className="flex justify-center items-center mb-2">
                    <Accordion title={"Browse recent community created documents"} visible={true}>
                        <GridContainer3x3>
                            {documents.map((doc, index) => (
                                <DocumentPreview
                                    key={index}
                                    document={doc}
                                />
                            ))}
                        </GridContainer3x3>
                    </Accordion>
                </div>}
            </div>
        </div>
    );
};

export default MathDocumentSearch;

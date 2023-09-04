import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import { notSecretConstants } from '../../constants/notSecretConstants';
import Accordion from '../../components/Accordion';
import GridContainer3x3 from '../../components/grids/GridContainer3x3';
import DocumentPreview from '../../components/forms/DocumentPreview';
import MathDocumentSearchForm from '../../components/math/MathDocumentSearchForm';
import DocumentShelf from '../../components/document/DocumentShelf';
import useGetDocuments from '../../hooks/tools/math/useGetDocuments';

const MathDocumentSearch: React.FC = () => {

    const { documents } = useGetDocuments(`${window.location.href.includes("https://test.gyosu.ai")
        ? notSecretConstants.testDjangoApi
        : import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/school_document/community/recent/`);

    console.log(documents)
    return (
        <div className="flex">
            <DocumentShelf isExporting={false} />
            <div className="w-5/6">
                {/* search */}
                <MathDocumentSearchForm />

                {/* community documents */}
                <div className="flex flex-row justify-center mb-2">
                    <Accordion title={"Recent community problem banks"} visible={true}>
                        <GridContainer3x3>
                            {documents?.map((doc, index) => (
                                <DocumentPreview
                                    key={index}
                                    document={doc}
                                />
                            ))}
                        </GridContainer3x3>
                    </Accordion>
                </div>
            </div>
        </div>
    );
};

export default MathDocumentSearch;

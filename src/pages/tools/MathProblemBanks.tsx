
import React, { useEffect } from 'react';
import { notSecretConstants } from '../../constants/notSecretConstants';
import DocumentShelf from '../../components/document/DocumentShelf';
import Accordion from '../../components/Accordion';
import GridContainer3x3 from '../../components/grids/GridContainer3x3';
import DocumentPreview from '../../components/forms/DocumentPreview';
import useGetDocuments from '../../hooks/tools/math/useGetDocuments';
import { useClerk } from '@clerk/clerk-react';

const MyProblemBanks: React.FC = () => {

    const { session, openSignIn } = useClerk();

    useEffect(() => {
        if (!session) {
            openSignIn()
        }
    }, [session, openSignIn])

    const { documents, error } = useGetDocuments(
        `${window.location.href.includes("https://test.gyosu.ai")
            ? notSecretConstants.testDjangoApi
            : import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/school_document/list/`
    );

    if (error) {
        return <div>Error loading documents: {(error as unknown as Error).message}</div>;
    }

    return (
        <div className="flex">
            <DocumentShelf isExporting={false} />
            <div className="w-5/6 h-screen">
                <div className="flex flex-row justify-center mt-4">
                    <Accordion title={"My Problem Banks"} visible={true}>
                        <GridContainer3x3>
                            {documents?.map((doc, index) => (
                                <DocumentPreview key={index} document={doc} />
                            ))}
                        </GridContainer3x3>
                    </Accordion>
                </div>
            </div>
        </div>
    );
};

export default MyProblemBanks;
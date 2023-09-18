
import React, { useEffect } from 'react';
import ProblemBankShelf from '../components/document/ProblemBankShelf';
import Accordion from '../components/Accordion';
import GridContainer3x3 from '../components/grids/GridContainer3x3';
import DocumentPreview from '../components/forms/DocumentPreview';
import useGetDocuments from '../hooks/tools/math/useGetDocuments';
import { useClerk } from '@clerk/clerk-react';
import useEnvironment from '../hooks/useEnvironment';

const MyProblemBanks: React.FC = () => {

    const { session, openSignIn } = useClerk();

    useEffect(() => {
        if (!session) {
            openSignIn()
        }
    }, [session, openSignIn])

    const { apiUrl } = useEnvironment();
    const endpoint = `${apiUrl}/math_app/school_document/list/`;

    const { documents, error } = useGetDocuments(endpoint);

    if (error) {
        return <div>Error loading documents: {(error as unknown as Error).message}</div>;
    }

    return (
        <div className="flex">
            <ProblemBankShelf isExporting={false} />
            <div className="w-5/6 h-screen">
                <div className="flex flex-row justify-center mt-4 mx-4">
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
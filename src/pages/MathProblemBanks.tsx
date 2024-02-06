
import React from 'react';
import Accordion from '../components/Accordion';
import ProblemBankShelf from '../components/document/ProblemBankShelf';
import DocumentPreview from '../components/forms/DocumentPreview';
import GridContainer3x3 from '../components/grids/GridContainer3x3';
import useGetDocuments from '../hooks/tools/math/useGetDocuments';
import useEnvironment from '../hooks/useEnvironment';
import { useRequireSignIn } from '../hooks/useRequireSignIn';

const MyProblemBanks: React.FC = () => {

    useRequireSignIn();

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
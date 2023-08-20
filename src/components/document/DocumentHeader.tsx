import React from 'react';
import { Document } from '../../interfaces';
import Accordion from '../Accordion';

interface DocumentHeaderProps {
    document: Document;
}

const DocumentHeader: React.FC<DocumentHeaderProps> = ({ document }) => {
    const [visible, setVisible] = React.useState<boolean>(false);
    return (
        <Accordion title="Document Details" visible={visible}>
            <div className="bg-gray-800 text-white p-2 rounded-lg m-2 shadow-md">
                {Object.entries(document).map(([key, value]) => {
                    if (typeof value === "object") {
                        return (
                            <div key={key} className="mb-1 text-sm">
                                <span className="font-medium">{key}:</span> {value && Object.keys(value).length} entries
                            </div>
                        );
                    } else {
                        return (
                            <div key={key} className="mb-1 text-sm">
                                <span className="font-medium">{key}:</span> {value}
                            </div>
                        );
                    }
                })}
            </div>
        </Accordion>
    );
};

export default DocumentHeader;

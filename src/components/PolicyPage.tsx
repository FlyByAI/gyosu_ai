import React from 'react';



interface PolicySection {
    title: string;
    text: string;
}

interface PolicyPageProps {
    title: string;
    content: PolicySection[];
}

const PolicyPage: React.FC<PolicyPageProps> = ({ title, content }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4 text-center">{title}</h1>
            <div className="max-w-2xl mx-auto">
                {content.map((section, index) => (
                    <div key={index}>
                        <h2 className="text-xl font-bold mt-8 mb-2">{section.title}</h2>
                        <p className="mb-4">{section.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PolicyPage;

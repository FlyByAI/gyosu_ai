import React, { ReactNode } from 'react';

type ContentWrapperProps = {
    children: ReactNode;
    className?: string;
};

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children }) => (
    <div className="max-w-4xl flex-grow mx-auto text-center">
        {children}
    </div>
);

export default ContentWrapper;
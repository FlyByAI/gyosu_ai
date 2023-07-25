import React, { ReactNode } from 'react';

type ContentWrapperProps = {
    children: ReactNode;
};

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children }) => (
    <div className="max-w-screen-xl mx-auto p-4 lg:p-8 text-center">
        {children}
    </div>
);

export default ContentWrapper;
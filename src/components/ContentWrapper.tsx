import React, { ReactNode } from 'react';

type ContentWrapperProps = {
    children: ReactNode;
};

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children }) => (
    <div className="max-w-screen-xl mx-auto text-center ">
        {children}
    </div>
);

export default ContentWrapper;
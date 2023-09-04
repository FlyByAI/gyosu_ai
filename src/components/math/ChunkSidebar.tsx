import { useEffect, useState } from "react";
import { Chunk, Document, EmptyDocument } from "../../interfaces";
import { useSidebarContext } from "../../contexts/useSidebarContext";
import useSubmitChunkSidebarForm, { SubmitChunkSidebarResponse } from "../forms/useSubmitChunkSidebarForm";
import { notSecretConstants } from "../../constants/notSecretConstants";
import { languageNames } from "../../helpers/language";
import useSubmitDocument from "../../hooks/tools/math/useSubmitDocument";
import { useLanguage } from "../../contexts/useLanguage";
import CreateDocxForm from "../forms/CreateDocsForm";

interface ChunkSidebarProps {
    document: Document | EmptyDocument;
}

const ChunkSidebar: React.FC<ChunkSidebarProps> = ({ document }) => {

    const endpoint2 = `${window.location.href.includes("https://test.gyosu.ai")
        ? notSecretConstants.testDjangoApi
        : import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/school_document/`;
    const { updateDocument } = useSubmitDocument(endpoint2);

    const { activeChunkIndices, setActiveChunkIndices } = useSidebarContext();

    const { submitForm } = useSubmitChunkSidebarForm(`${window.location.href.includes("https://test.gyosu.ai")
        ? notSecretConstants.testDjangoApi
        : import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/problem/playground/`);

    const { language } = useLanguage();


    return (
        <div className="p-2 fixed z-0 right-0 top-16 my-20 w-1/5 me-4 bg-gray-900 transform transition-transform duration-1000">
            <div className="h-5/6 bg-blue-900 p-4 text-white overflow-y-auto max-h-[90vh]">

                <CreateDocxForm document={document} />
            </div>
        </div >
    );
};

export default ChunkSidebar;

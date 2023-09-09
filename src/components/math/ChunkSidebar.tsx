import { Document, EmptyDocument } from "../../interfaces";
import { useSidebarContext } from "../../contexts/useSidebarContext";
import useSubmitChunkSidebarForm from "../forms/useSubmitChunkSidebarForm";
import useSubmitDocument from "../../hooks/tools/math/useSubmitDocument";
import { useLanguage } from "../../contexts/useLanguage";
import CreateDocxForm from "../forms/CreateDocsForm";
import useEnvironment from "../../hooks/useEnvironment";

interface ChunkSidebarProps {
    document: Document | EmptyDocument;
}

const ChunkSidebar: React.FC<ChunkSidebarProps> = ({ document }) => {

    return (
        <div className="p-2 fixed z-0 right-0 top-16 my-20 w-1/5 me-4 bg-gray-900 transform transition-transform duration-1000">
            <div className="h-5/6 bg-blue-900 p-4 text-white overflow-y-auto max-h-[90vh]">

                <CreateDocxForm document={document} />
            </div>
        </div >
    );
};

export default ChunkSidebar;

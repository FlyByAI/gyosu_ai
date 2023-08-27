import { useParams } from "react-router-dom";
import { notSecretConstants } from "../../constants/notSecretConstants";
import useGetDocument from "../../hooks/tools/math/useGetDocument";
import useSubmitDocument from "../../hooks/tools/math/useSubmitDocument";
import useSubmitReroll from "../../hooks/tools/math/useSubmitReroll";
import { Chunk, Instruction, Problem, Document } from "../../interfaces";
import PlusIcon from "../../svg/PlusIcon";
import RefreshIcon from "../../svg/RefreshIcon";
import TrashIcon from "../../svg/TrashIcon";
import ResponseFeedback from "../ResponseFeedback";

interface ToolBadgeProps {
    chunk: Chunk;
    instruction?: Instruction;
    problem?: Problem;
    insertChunk?: (chunkIndex: number) => void;
    updateChunk: (updatedChunk: Chunk, chunkIndex: number) => void;
    chunkIndex: number;
}

const ToolBadge: React.FC<ToolBadgeProps> = ({ chunk, instruction, problem, insertChunk, updateChunk, chunkIndex }) => {

    const { submitReroll } = useSubmitReroll(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/reroll/`);

    const payload = {
        chunkId: chunk.id || null,
        chunk: chunk,
        ...(instruction ? { instruction } : {}),
        ...(problem ? { problem } : {})
    };


    const handleReroll = async () => {
        console.log("reroll", payload);

        try {
            const updatedChunk = await submitReroll({ chunk, action: 'reroll', instruction, problem });
            updateChunk(updatedChunk.chunk, chunkIndex);
        } catch (error) {
            console.error("An error occurred during reroll:", error);
        }
    };

    const handleAdd = () => {
        console.log("add", payload);
        insertChunk && insertChunk(chunkIndex)
    }


    return (
        <div className="bg-gray-100 rounded-full p-3 flex space-x-2 absolute transform translate-x-full -translate-y-full flex-row">
            <ResponseFeedback data={payload} responseText={""} toolName={'math_app'} className='mt-4' size={6} />

            <button onClick={handleReroll} className="pe-1 text-black">
                <RefreshIcon />
            </button>
            {insertChunk && <button onClick={handleAdd} className="pe-1 text-green-500">
                <PlusIcon />
            </button>}
            {/* <button onClick={handleEdit} className="pe-1 text-green-500">
                <PlusIcon />
            </button> */}
        </div>
    );
};



export default ToolBadge;
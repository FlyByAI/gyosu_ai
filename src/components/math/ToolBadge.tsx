import { Chunk, Instruction, Problem } from "../../interfaces";
import PlusIcon from "../../svg/PlusIcon";
import RefreshIcon from "../../svg/RefreshIcon";
import TrashIcon from "../../svg/TrashIcon";
import ResponseFeedback from "../ResponseFeedback";

interface ToolBadgeProps {
    chunk: Chunk;
    instruction?: Instruction;
    problem?: Problem;
}

const ToolBadge: React.FC<ToolBadgeProps> = ({ chunk, instruction, problem }) => {

    const payload = {
        chunkId: chunk.id || null,
        chunk: chunk,
        ...(instruction ? { instruction } : {}),
        ...(problem ? { problem } : {})
    };

    const handleDelete = () => {
        console.log("delete", payload);
        // call delete
    }

    const handleReroll = () => {
        console.log("reroll", payload);
        // call reroll
    }

    const handleAdd = () => {
        console.log("add", payload);
        // add to playlist?
    }

    return (
        <div className="bg-gray-100 rounded-full p-3 flex space-x-2 absolute transform translate-x-full -translate-y-full flex-row">
            <ResponseFeedback data={payload} responseText={""} toolName={'math_app'} className='mt-4' size={6} />
            <button onClick={() => console.log("delete")} className="pe-1 text-red-600">
                <TrashIcon />
            </button>
            <button onClick={handleReroll} className="pe-1 text-black">
                <RefreshIcon />
            </button>
            <button onClick={handleAdd} className="pe-1 text-green-500">
                <PlusIcon />
            </button>
        </div>
    );
};



export default ToolBadge;
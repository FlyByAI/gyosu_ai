import PlusIcon from "../../svg/PlusIcon";
import RefreshIcon from "../../svg/RefreshIcon";
import TrashIcon from "../../svg/TrashIcon";

interface ToolBadgeProps {
    onDelete: () => void;
    // Add other actions as needed
}

const ToolBadge: React.FC<ToolBadgeProps> = ({ onDelete }) => {
    return (
        <div className="bg-gray-100 rounded-full p-3 flex space-x-2 absolute transform translate-x-full -translate-y-full flex-row">
            <button onClick={onDelete} className="pe-1 text-red-600">
                <TrashIcon />
            </button>
            <button onClick={onDelete} className="pe-1 text-black">
                <RefreshIcon />
            </button>
            <button onClick={onDelete} className="pe-1 text-green-500">
                <PlusIcon />
            </button>
        </div>
    );
};



export default ToolBadge;
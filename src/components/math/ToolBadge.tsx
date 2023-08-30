import { useParams } from "react-router-dom";
import { notSecretConstants } from "../../constants/notSecretConstants";
import useSubmitReroll from "../../hooks/tools/math/useSubmitReroll";
import { Chunk, Instruction, Problem, Document, Rating, ChunkInstructionProblem } from "../../interfaces";
import PlusIcon from "../../svg/PlusIcon";
import { ThumbsDownSvg, ThumbsUpSvg } from "../../svg/customSVGs";
import { useModal } from "../../contexts/useModal";
import FeedbackForm from "../forms/FeedbackForm";
import useSubmitFeedback from "../../hooks/useSubmitFeedback";
import { useState } from "react";


interface ToolBadgeProps {
    chunk: Chunk;
    instruction?: Instruction;
    problem?: Problem;
    insertChunk?: (chunkIndex: number) => void;
    updateChunk: (updatedChunk: Chunk, chunkIndex: number) => void;
    chunkIndex: number;
    hidden?: boolean;
}

const ToolBadge: React.FC<ToolBadgeProps> = ({ chunk, instruction, problem, insertChunk, updateChunk, chunkIndex, hidden }) => {

    const { submitReroll } = useSubmitReroll(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/reroll/`);

    const { submitFeedback } = useSubmitFeedback(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/feedback/problem/`)

    const payload: ChunkInstructionProblem = {
        chunkId: chunk.id,
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

    const { openModal, closeModal, currentModal } = useModal();

    const handleCloseModal = () => {
        closeModal();
    };

    const [rating, setRating] = useState<Rating>("");

    const handleThumbUpClick = () => {
        openModal("feedbackModal",
            <FeedbackForm
                feedbackLabel={"Chunk Feedback"}
                rating={"thumbsUp"}
                onSubmitFeedback={submitFeedback}
                onClose={handleCloseModal}
                data={payload} />
        );
        setRating("thumbsUp");
    };

    const handleThumbDownClick = () => {
        openModal("feedbackModal",
            <FeedbackForm
                feedbackLabel={"Chunk Feedback"}
                rating={"thumbsDown"}
                onSubmitFeedback={submitFeedback}
                onClose={handleCloseModal}
                data={payload} />
        );
        setRating("thumbsDown");
    };


    return (
        <div className={`bg-gray-100 rounded-full p-3 flex space-x-2 absolute transform translate-x-full -translate-y-full flex-row + ${hidden ? "hidden" : ""}`}>
            <button onClick={handleThumbUpClick} className="">
                <div className={`pe-1 dark:text-gray-700`}>
                    <ThumbsUpSvg rating={rating} />
                </div>
            </button>
            <button onClick={handleThumbDownClick} className="">
                <div className={`pe-1 dark:text-gray-700`}>
                    <ThumbsDownSvg rating={rating} />
                </div>
            </button>
            {/* <button onClick={handleReroll} className="pe-1 text-black">
                <RefreshIcon />
            </button> */}
            {insertChunk && <button onClick={handleAdd} className="pe-1 text-green-500">
                <PlusIcon />
            </button>}
        </div>
    );
};



export default ToolBadge;
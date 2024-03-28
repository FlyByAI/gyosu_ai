import { useState } from "react";
import { useModal } from "../../contexts/useModal";
import useEnvironment from "../../hooks/useEnvironment";
import useSubmitFeedback from "../../hooks/useSubmitFeedback";
import { Chunk, ChunkInstructionProblem, Instruction, Problem, Rating } from "../../interfaces";
import TrashIcon from "../../svg/TrashIcon";
import { ThumbsDownSvg, ThumbsUpSvg } from "../../svg/customSVGs";
import FeedbackForm from "../forms/FeedbackForm";


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

    const { apiUrl } = useEnvironment();

    const { submitFeedback } = useSubmitFeedback(`${apiUrl}/math_app/feedback/problem/`)

    const payload: ChunkInstructionProblem = {
        chunkId: chunk.id,
        chunk: chunk,
        ...(instruction ? { instruction } : {}),
        ...(problem ? { problem } : {})
    };


    const handleDeleteInstructionProblem = async () => {
        console.log("delete", payload.problem, "or", payload.instruction);

        try {
            const newContent = payload.chunk.content.filter((item) => {
                if (payload.problem && item.type === "problem") {
                    return item !== payload.problem; // Compare how you deem appropriate
                }
                if (payload.instruction && item.type === "instruction") {
                    return item !== payload.instruction; // Compare how you deem appropriate
                }
                return true;
            });

            const updatedChunk = {
                ...payload.chunk,
                content: newContent
            };

            updateChunk(updatedChunk, chunkIndex);
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
                feedbackLabel={`${payload.instruction ? "Instruction" : "Problem"} Feedback`}
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
                feedbackLabel={`${payload.instruction ? "Instruction" : "Problem"} Feedback`}
                rating={"thumbsDown"}
                onSubmitFeedback={submitFeedback}
                onClose={handleCloseModal}
                data={payload} />
        );
        setRating("thumbsDown");
    };


    return (
        <div className={`z-30 bg-gray-100 rounded-full p-3 flex space-x-2 absolute transform translate-x-full -translate-y-full flex-row + ${hidden ? "hidden" : ""}`}>
            <button onClick={handleThumbUpClick} className=""
            >
                <div className="pe-1 dark:text-gray-700 tooltip" data-tip="Like">
                    <ThumbsUpSvg rating={rating} />
                </div>
            </button>
            <button onClick={handleThumbDownClick} className="tooltip" data-tip="Dislike">
                <div className={`pe-1 dark:text-gray-700`}
                >
                    <ThumbsDownSvg rating={rating} />
                </div>
            </button>
            <button
                onClick={handleDeleteInstructionProblem}
                className="pe-1 text-black tooltip"
                data-tip="Delete"
            >
                <TrashIcon />
            </button>
        </div>
    );
};



export default ToolBadge;
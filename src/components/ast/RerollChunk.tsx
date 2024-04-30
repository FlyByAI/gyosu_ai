import React, { useEffect } from 'react';
import useSubmitReroll, { SubmitRerollResponse } from '../../hooks/tools/math/useSubmitReroll';
import { Chunk } from '../../interfaces';
import useEnvironment from '../../hooks/useEnvironment';

// Define the types for the props
interface RerollChunkProps {
    chunk: Chunk;
    chunkIndex: number;
    problemBankId: string;
    onSuccess: (data: SubmitRerollResponse, isLoading: boolean) => void;
}

const RerollChunk: React.FC<RerollChunkProps> = ({ chunk, chunkIndex, problemBankId, onSuccess }) => {
    const { mathAppApiUrl } = useEnvironment();
    const { submitReroll, data: rerollData, isLoading: isLoadingReroll, reset } = useSubmitReroll(`${mathAppApiUrl}/reroll/`);

    const handleReroll = () => {
        console.log("rerolling");
        submitReroll({ chunk, action: "reroll", chunkIndex, problemBankId: problemBankId });
    };

    useEffect(() => {
        if (rerollData) {
            onSuccess(rerollData, isLoadingReroll);
            reset();
        }
    }, [rerollData, isLoadingReroll, onSuccess, reset]);

    return (
        <button onClick={handleReroll} disabled={isLoadingReroll}>
            Reroll
        </button>
    );
};

export default RerollChunk;

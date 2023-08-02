import React, { useEffect, useState } from 'react';
import RefreshIcon from '../../svg/RefreshIcon';
import useSubmitReroll from '../../hooks/tools/math/useSubmitReroll';
import { notSecretConstants } from '../../constants/notSecretConstants';
import ChangeProblemModal from './ChangeProblemModal';

interface RefreshResultProps {
    problem: string;
    setChat: (value: string) => void;
    problemIndex: number;
    updateProblem: (index: number, newProblem: string) => void
    problemType: string;
}

const RefreshResult: React.FC<RefreshResultProps> = ({ problem, setChat, problemIndex, updateProblem, problemType }) => {
    const { data, submitReroll, error } = useSubmitReroll(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/reroll/`);
    const [newProblem, setNewProblem] = useState<string>('');
    const [isModalOpen, setModalOpen] = useState(false);

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleClick = () => {
        setModalOpen(true);
        submitReroll(problem, problemType);
    }

    useEffect(() => {
        if (data) {
            setNewProblem(data?.problem)
            setChat(data?.problem)
        }
    }, [data, setChat, setNewProblem])



    return (<>
        <button onClick={handleClick}><RefreshIcon /> </button>

        {<ChangeProblemModal error={error} problemIndex={problemIndex} updateProblem={updateProblem} onClose={handleCloseModal} isOpen={isModalOpen} setNewProblem={setNewProblem} markdown={problem} newProblem={newProblem} />}
    </>)
}

export default RefreshResult;

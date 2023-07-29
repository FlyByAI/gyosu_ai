import React, { useEffect, useState } from 'react';
import RefreshIcon from '../../svg/RefreshIcon';
import useSubmitReroll from '../../hooks/tools/math/useSubmitReroll';
import { notSecretConstants } from '../../constants/notSecretConstants';
import RerollProblemModal from './RerollProblemModal';

interface RefreshResultProps {
    problem: string;
    setChat: (value: string) => void;
    problemIndex: number;
    updateProblem: (index: number, newProblem: string) => void
}

const RefreshResult: React.FC<RefreshResultProps> = ({ problem, setChat, problemIndex, updateProblem }) => {
    const { data, submitReroll, error } = useSubmitReroll(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/reroll/`);
    const [newProblem, setNewProblem] = useState<string>('');
    const [isModalOpen, setModalOpen] = useState(false);

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleClick = () => {
        setModalOpen(true);
        submitReroll(problem);
    }

    useEffect(() => {
        if (data) {
            setNewProblem(data?.instructions + "\n\n" + data?.problem)
            setChat(`${data?.instructions ? data?.instructions + "\n\n" : ""}` + data?.problem)
        }
    }, [data, setChat, setNewProblem])



    return (<>
        <button onClick={handleClick}><RefreshIcon /> </button>

        {<RerollProblemModal error={error} problemIndex={problemIndex} updateProblem={updateProblem} onClose={handleCloseModal} isOpen={isModalOpen} setNewProblem={setNewProblem} markdown={problem} newProblem={newProblem} />}
    </>)
}

export default RefreshResult;

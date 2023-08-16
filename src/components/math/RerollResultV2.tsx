import React, { useEffect, useState } from 'react';
import RefreshIcon from '../../svg/RefreshIcon';
import useSubmitReroll from '../../hooks/tools/math/useSubmitReroll';
import { notSecretConstants } from '../../constants/notSecretConstants';
import ChangeProblemModalV2 from './ChangeProblemModalV2';
import { useLanguage } from '../../contexts/useLanguage';
import { Chunk, ProblemData } from '../../interfaces';

interface RerollResultProps {
    problem: string;
    setChat: (value: string) => void;
    problemIndex: number;
    updateProblem: (index: number, newProblem: Chunk) => void
    problemData: ProblemData;
}

const RerollResult: React.FC<RerollResultProps> = ({ problem, setChat, problemIndex, updateProblem, problemData }) => {
    const { data, submitReroll, error } = useSubmitReroll(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/reroll/`);
    const [newProblem, setNewProblem] = useState<string>('');
    const [isModalOpen, setModalOpen] = useState(false);

    const { language } = useLanguage();

    const options = { language: language, topic: "none" };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleClick = () => {
        setModalOpen(true);
        submitReroll(problem, problemData, options);
    }

    useEffect(() => {
        if (data) {
            setNewProblem(data?.problem)
            setChat(data?.problem)
        }
    }, [data, setChat, setNewProblem])



    return (<>
        <button onClick={handleClick}><RefreshIcon /> </button>

        {<ChangeProblemModalV2 error={error} problemIndex={problemIndex} updateProblem={updateProblem} onClose={handleCloseModal} isOpen={isModalOpen} setNewProblem={setNewProblem} markdown={problem} newProblem={newProblem} />}
    </>)
}

export default RerollResult;

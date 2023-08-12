import React, { useEffect, useState } from 'react';
import RefreshIcon from '../../svg/RefreshIcon';
import useSubmitReroll from '../../hooks/tools/math/useSubmitReroll';
import { notSecretConstants } from '../../constants/notSecretConstants';
import ChangeProblemModal from './ChangeProblemModal';

interface RerollResultProps {
    problem: string;
    setChat: (value: string) => void;
    problemIndex: number;
    updateProblem: (index: number, newProblem: string) => void
    problemType: string;
    section: string;
    documentType: string;
    sourceMaterial: string;
}

const RerollResult: React.FC<RerollResultProps> = ({ problem, setChat, problemIndex, updateProblem, problemType, documentType, section, sourceMaterial }) => {
    const { data, submitReroll, error } = useSubmitReroll(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/reroll/`);
    const [newProblem, setNewProblem] = useState<string>('');
    const [isModalOpen, setModalOpen] = useState(false);

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleClick = () => {
        setModalOpen(true);
        submitReroll(problem, problemType, documentType, sourceMaterial, section);
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

export default RerollResult;

import React, { useEffect, useState } from 'react';
import RefreshIcon from '../../svg/RefreshIcon';
import useSubmitReroll from '../../hooks/tools/math/useSubmitReroll';
import { notSecretConstants } from '../../constants/notSecretConstants';
import ChangeProblemModal from './ChangeProblemModal';
import LatexIcon from '../../svg/LatexIcon';

interface FixLatexProps {
    problem: string;
    setChat: (value: string) => void;
    problemIndex: number;
    updateProblem: (index: number, newProblem: string) => void
    problemType: string;
}

const FixLatex: React.FC<FixLatexProps> = ({ problem, setChat, problemIndex, updateProblem, problemType }) => {
    const { data, submitReroll, error } = useSubmitReroll(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/add_latex/`);
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
        <button onClick={handleClick}><LatexIcon /> </button>

        {<ChangeProblemModal error={error} problemIndex={problemIndex} updateProblem={updateProblem} onClose={handleCloseModal} isOpen={isModalOpen} setNewProblem={setNewProblem} markdown={problem} newProblem={newProblem} />}
    </>)
}

export default FixLatex;

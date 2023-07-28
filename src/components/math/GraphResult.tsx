import React, { useEffect, useState } from 'react';
import useSubmitAddGraph from '../../hooks/tools/math/useSubmitAddGraph'; // Import the correct hook
import { notSecretConstants } from '../../constants/notSecretConstants';
import AddGraphModal from './AddGraphModal';
import GraphIcon from '../../svg/GraphIcon';

interface GraphResultProps {
    problem: string;
    problemIndex: number;
    updateProblem: (index: number, newProblem: string) => void
}

const GraphResult: React.FC<GraphResultProps> = ({ problem, problemIndex, updateProblem }) => {
    const { data, submitAddGraph } = useSubmitAddGraph(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/add_graph/`); // Change the endpoint if necessary
    const [newProblem, setNewProblem] = useState<string>('');
    const [isModalOpen, setModalOpen] = useState(false);

    //This should be created when the AddGraphModal is accepted. 
    const graphUrl = "https://gyosu.ai"

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleClick = () => {
        setModalOpen(true);
        submitAddGraph(problem, 'additional user info here'); // Replace 'additional user info here' with the correct info
    }

    useEffect(() => {
        if (data) {
            setNewProblem(problem + `![Graph for problem ${problemIndex}](${graphUrl})`)
        }
    }, [data, problem, problemIndex])



    return (<>
        <button onClick={handleClick}><GraphIcon /> </button>

        {<AddGraphModal problemIndex={problemIndex} updateProblem={updateProblem} onClose={handleCloseModal} isOpen={isModalOpen} markdown={problem} graphData={data?.graphData} graphLayout={data?.graphLayout} />}
    </>)
}

export default GraphResult;

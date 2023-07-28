import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import useSubmitAddGraph from '../../hooks/tools/math/useSubmitAddGraph';
import { notSecretConstants } from '../../constants/notSecretConstants';
import AddGraphModal from './AddGraphModal';

interface MyPlotlyProps {
    problem: string;
    updateProblem: (index: number, newProblem: string) => void;
    problemIndex: number;
}
const MyPlotly = ({ problem, updateProblem, problemIndex }: MyPlotlyProps) => {
    const { isLoading, submitAddGraph, data } = useSubmitAddGraph(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/add_graph/`);
    const [graphData, setGraphData] = useState<any | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);


    useEffect(() => {
        try {
            setGraphData(data)
        } catch (error) {
            setGraphData(null)
            window.alert("error ocurred, try again")
        }
        console.log(data)
    }, [data])

    const handleButtonClick = async () => {
        setModalOpen(true)
        submitAddGraph(problem, '')
    }


    const handleClose = (image_url = "") => {
        if (image_url !== "") {
            updateProblem(problemIndex, problem + `![Graph for problem ${problemIndex}](${image_url})`)
        }
        setModalOpen(false);
    };

    return (
        <>
            <button type="submit"
                className="mt-2 p-2 bg-blue-500 text-white rounded"
                onClick={handleButtonClick}>
                Add Graph To Problem
            </button>
            {/* {!isLoading && useGraph && graphData ? <Plot
                data={eval(graphData?.graph)}
                className='w-full max-w-full'
                layout={{
                    "title": graphData?.title
                }}
            /> : useGraph ? <div className="text-white">"Loading..."</div> : null} */}

            {graphData &&
                <AddGraphModal
                    markdown={problem}
                    isOpen={isModalOpen}
                    onClose={handleClose}
                    updateProblem={() => console.log("update")}
                    problemIndex={0}
                    graphData={eval(graphData?.graph)}
                    graphLayout={{
                        "title": graphData?.title
                    }} />
            }

        </>
    );
}

export default MyPlotly;

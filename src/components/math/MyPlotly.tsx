import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { PlotRelayoutEvent, update } from 'plotly.js';

import useSubmitAddGraph from '../../hooks/tools/math/useSubmitAddGraph';
import { notSecretConstants } from '../../constants/notSecretConstants';

interface MyPlotlyProps {
    problem: string;
    updateProblem: (index: number, problem: string, graphData: any) => void;
    problemIndex: number;
    graphData: any[];
    handleAddNewGraph: (index: number, data: { graphTitle: string; graphData: any; }) => void
    preview?: boolean
}

interface ZoomState {
    xaxis: [number, number];
    yaxis: [number, number];
}

const MyPlotly: React.FC<MyPlotlyProps> = ({ problem, updateProblem, problemIndex, graphData, handleAddNewGraph, preview }) => {
    const { isLoading, submitAddGraph, data, setData } = useSubmitAddGraph(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/math_app/add_graph/`);
    const [zoomState, setZoomState] = useState<ZoomState>({
        xaxis: [0, 0],
        yaxis: [0, 0],
    });

    const handleRelayout = (eventData: PlotRelayoutEvent) => {
        const xaxisRange = (eventData['xaxis.range[0]'] !== undefined && eventData['xaxis.range[1]'] !== undefined)
            ? [eventData['xaxis.range[0]'], eventData['xaxis.range[1]']] as [number, number]
            : zoomState.xaxis;
        const yaxisRange = (eventData['yaxis.range[0]'] !== undefined && eventData['yaxis.range[1]'] !== undefined)
            ? [eventData['yaxis.range[0]'], eventData['yaxis.range[1]']] as [number, number]
            : zoomState.yaxis;

        setZoomState({
            xaxis: xaxisRange,
            yaxis: yaxisRange,
        });
    };

    useEffect(() => {
        if (data) {
            handleAddNewGraph(problemIndex, { graphTitle: data.title, graphData: data.graph });
            setData(null);
        }
    }, [data, setData, handleAddNewGraph, problemIndex])


    const handleButtonClick = () => {
        submitAddGraph(problem, '');
    };


    return (
        <>
            {!preview ? (
                <>
                    <button type="submit"
                        disabled={isLoading}
                        className="mt-2 p-2 bg-blue-500 text-white rounded"
                        onClick={handleButtonClick}>
                        {isLoading ? 'Loading...' : 'Add Graph To Problem'}
                    </button>

                    {graphData && graphData.length > 0 && !isLoading &&
                        <div>
                            <div className="mb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">
                                    Graph
                                </h3>
                                <div className="overflow-auto max-h-[400px]">
                                    {graphData.map((graph) => (
                                        <div>
                                            <Plot
                                                data={graph?.data}
                                                layout={{ "title": graph?.title, "xaxis": { range: zoomState.xaxis }, "yaxis": { range: zoomState.yaxis } }}
                                                className="w-full h-full"
                                                onRelayout={handleRelayout}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    }
                </>
            ) : (
                <div>
                    <div className="mb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-200">
                            Graph
                        </h3>
                        <div className="overflow-auto max-h-[400px]">
                            {graphData.map((graph) => (
                                <Plot
                                    data={graph?.data}
                                    layout={{
                                        "title": graph?.title,
                                        "xaxis": { range: zoomState.xaxis },
                                        "yaxis": { range: zoomState.yaxis },
                                        "width": 800,
                                        "height": 400,
                                        "legend": {
                                            "x": 0, // Adjust position
                                            "y": 1, // Adjust position
                                            "font": {
                                                "size": 12 // Adjust font size
                                            }
                                        }
                                    }}
                                    className="w-full h-full"
                                    onRelayout={handleRelayout}
                                    config={{ displayModeBar: false }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyPlotly;


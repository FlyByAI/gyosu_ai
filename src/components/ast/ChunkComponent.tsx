import 'katex/dist/katex.min.css';
import React, { useEffect, useState } from 'react';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { useParams } from 'react-router-dom';
import { GridLoader } from 'react-spinners';
import { useDragContext } from '../../contexts/DragContext';
import { useScreenSize } from '../../contexts/ScreenSizeContext';
import { renderItem } from '../../helpers/AstRender';
import useGetDocument from '../../hooks/tools/math/useGetDocument';
import useSubmitChunk from '../../hooks/tools/math/useSubmitChunk';
import useSubmitDocument from '../../hooks/tools/math/useSubmitDocument';
import useSubmitMathForm from '../../hooks/tools/math/useSubmitMathForm';
import useSubmitReroll from '../../hooks/tools/math/useSubmitReroll';
import useSubmitTextWithChunk from '../../hooks/tools/math/useSubmitTextWithChunk';
import useSubmitTextWithChunkLatex from '../../hooks/tools/math/useSubmitTextWithChunkLatex';
import useSubmitTextWithChunkSimilar from '../../hooks/tools/math/useSubmitTextWithChunkSimilar';
import useEnvironment from '../../hooks/useEnvironment';
import { CHUNK_DRAG_TYPE, Chunk, INSTRUCTION_DRAG_TYPE, INSTRUCTION_TYPE, Instruction, PROBLEM_DRAG_TYPE, PROBLEM_TYPE, Problem, isText } from '../../interfaces';
import AddChunkModal from '../AddChunkModal';
import { InstructionComponent } from './InstructionComponent';
import { ProblemComponent } from './ProblemComponent';

interface ChunkProps {
    chunk: Chunk;
    edit?: boolean;
    insertChunk?: (chunkIndex: number) => void;
    updateChunk?: (updatedChunk: Chunk, chunkIndex: number) => void;
    chunkIndex: number;
    disableInstructionProblemDrag?: boolean;
}

export const ChunkComponent: React.FC<ChunkProps> = ({ chunk, updateChunk, chunkIndex, disableInstructionProblemDrag }) => {
    const { setDragState } = useDragContext();

    const [currentRerollIndex, setCurrentRerollIndex] = useState(0);
    const [currentSearchResponseIndex, setCurrentSearchResponseIndex] = useState(0);

    const { env, apiUrl } = useEnvironment();

    const endpoint2 = `${apiUrl}/math_app/school_document/`;
    const wolframEndpoint = `${apiUrl}/math_app/wolfram/`;

    const { isLoading, updateDocument } = useSubmitDocument(endpoint2);

    const [isHovered, setIsHovered] = useState(false);

    const [userInput, setUserInput] = useState("")

    const [, ref] = useDrag({
        type: CHUNK_DRAG_TYPE,
        item: () => {
            setDragState({ isDragging: true, dragType: CHUNK_DRAG_TYPE });
            return { ...chunk, content: chunk.content } as Chunk;
        },
        end: () => {
            setDragState({ isDragging: false, dragType: null });
        },
    });

    //do this in instruction and problem too so they can be dragged on
    const [, drop] = useDrop({
        accept: [INSTRUCTION_DRAG_TYPE, PROBLEM_DRAG_TYPE],
        hover: () => {
            setIsHovered(true);
        },
        drop: (item: Instruction | Problem, monitor: DropTargetMonitor) => {

            const didDrop = monitor.didDrop();
            if (didDrop) {
                return;
            }
            else {
                console.log("dropped on chunk")
            }

            if (item.type === INSTRUCTION_TYPE || item.type === PROBLEM_TYPE) {
                const updatedContent = [...chunk.content, item];
                // Update the content state if you still want to use it elsewhere
                // setContent(updatedContent);

                // Create a new chunk object with the updated content
                const updatedChunk = { ...chunk, content: updatedContent };

                // Use the method from props to update the chunk
                updateChunk && updateChunk(updatedChunk, chunkIndex);
            }
        },
    });

    const { id } = useParams();

    const { document } = useGetDocument(`${apiUrl}/math_app/school_document/`, Number(id));

    const deleteChunk = (index: number) => {
        // Validation for document object
        if (!document || !('id' in document)) {
            return;
        }

        const updatedChunks = [...(document.problemChunks || [])];

        updatedChunks.splice(index, 1);

        const updatedDocument = { ...document, problemChunks: updatedChunks };

        // Submit the change, triggering the updateDocument mutation
        updateDocument({ document: updatedDocument });

    };

    const { isDesktop } = useScreenSize();

    const { submitReroll, data: rerollData, reset: resetReroll } = useSubmitReroll(`${apiUrl}/math_app/reroll/`)

    const handleReroll = () => {
        if (!rerollData) {
            submitReroll({ chunk: chunk, action: "reroll", chunkIndex: chunkIndex, problemBankId: id })
        }
        else {
            // loop 
            setCurrentRerollIndex((prev) => {
                if (prev === rerollData.chunks.length - 1) {
                    return 0
                }
                else {
                    return prev + 1
                }
            })
        }
    }

    const { submitMathForm, data: searchData, reset: resetSearchData, isLoading: isLoadingSearch, error: errorSearch } = useSubmitMathForm(`${apiUrl}/math_app/generate/`)
    const { submitTextWithChunk, data: submitTextData, reset: resetTextChange, isLoading: isLoadingSubmitText, error: errorText } = useSubmitTextWithChunk(`${apiUrl}/math_app/chat/problem/`)
    const { submitTextWithChunkLatex, data: submitTextLatexData, reset: resetTextLatex, isLoading: isLoadingSubmitTextLatex, error: errorTextLatex } = useSubmitTextWithChunkLatex(`${apiUrl}/math_app/chat/problem/`)
    const { submitTextWithChunkSimilar, data: submitTextSimilarData, reset: resetTextSimilar, isLoading: isLoadingSubmitTextSimilar, error: errorTextSimilar } = useSubmitTextWithChunkSimilar(`${apiUrl}/math_app/chat/problem/`)
    const { submitChunk: submitTextStepByStep, data: submitTextStepByStepData, reset: resetTextStepByStep, isLoading: isLoadingSubmitTextStepByStep, error: errorTextStepByStep } = useSubmitChunk(wolframEndpoint, "step_by_step/")

    const handleSubmitText = () => {
        submitTextWithChunk({ chunk: chunk, userInput: userInput, chunkIndex: chunkIndex, problemBankId: id })
    }

    const handleTextToLatex = () => {
        console.log("text to latex", userInput)
        submitTextWithChunkLatex({ userInput: userInput, chunkIndex: chunkIndex, problemBankId: id })

    }

    const handleSimilarSearchText = () => {
        console.log("find similar problems from text", userInput)
        submitTextWithChunkSimilar({ userInput: userInput, chunkIndex: chunkIndex, problemBankId: id })
    }

    const handleStepByStep = () => {
        console.log("find similar problems from text", userInput)
        submitTextStepByStep({ userInput: userInput, chunk: chunk })
    }

    const handleSearch = () => {
        console.log("search for problem", userInput)
        if (!searchData) {
            console.log("searching")
            submitMathForm({ data: { sourceMaterial: "competition_math", userInput: userInput } })
        }
        else {
            console.log("looping", currentSearchResponseIndex, searchData.response.length)
            console.log(searchData?.response[currentSearchResponseIndex])
            setCurrentSearchResponseIndex((prev) => {
                if (prev === searchData.response.length - 1) {
                    return 0
                }
                else {
                    return prev + 1
                }
            })
        }
    }

    const handleAcceptChunkChange = () => {
        if (rerollData) {
            const updatedChunk = rerollData.chunks[currentRerollIndex]
            updateChunk && updateChunk(updatedChunk, chunkIndex)
            resetReroll()
        }
        if (submitTextData) {
            const updatedChunk = submitTextData.chunk
            updateChunk && updateChunk(updatedChunk, chunkIndex)
            resetTextChange()
        }
        if (searchData) {
            const updatedChunk = searchData.response[currentSearchResponseIndex]
            updateChunk && updateChunk(updatedChunk, chunkIndex)
            resetSearchData()
        }
    }

    useEffect(() => {
        if (submitTextData) {
            console.log("new text changed chunk", submitTextData)
            console.log("old chunk", chunk)
        }
        if (rerollData) {
            console.log("new rerolled chunks", rerollData)
        }
        if (submitTextSimilarData) {
            console.log("new similar chunk", submitTextSimilarData)

            if (submitTextSimilarData.chunk instanceof Array) {
                const newChunk = { content: [...submitTextSimilarData.chunk] } as Chunk
                updateChunk && updateChunk(newChunk, chunkIndex)
                console.log("condition 2")
            }
            else {
                console.log("chunk content is not expected type, chunk:", submitTextSimilarData.chunk, typeof (submitTextSimilarData.chunk.content))
            }
            resetTextSimilar()
        }
        if (submitTextLatexData) {
            console.log("new problem from text_to_latex", submitTextLatexData)
            const problem = {
                type: "problem",
                content: [{ type: "math", value: submitTextLatexData.latex }]
            } as Problem
            const chunk: Chunk = { content: [problem], type: "chunk", tags: {}, ...submitTextLatexData.chunk }
            console.log("new chunk!", chunk)
            updateChunk && updateChunk(chunk, chunkIndex)
            resetTextLatex()
        }
        if (searchData) {
            console.log(searchData)
        }
        if (submitTextStepByStepData) {
            if (typeof (submitTextStepByStepData.text) == "string") {
                const newChunk: Chunk = {
                    type: "chunk", content: [{
                        type: "text",
                        value: submitTextStepByStepData.text
                    }, ...chunk.content]
                }
                updateChunk && updateChunk(newChunk, chunkIndex)
                resetTextStepByStep();
            }
            else if (submitTextStepByStepData && isText(submitTextStepByStepData.text)) {
                const newChunk: Chunk = {
                    type: "chunk", content: [submitTextStepByStepData.text, ...chunk.content]
                }
                updateChunk && updateChunk(newChunk, chunkIndex)
                resetTextStepByStep();
            }
            else
                console.log("unexpected type from step by step", submitTextStepByStepData.text, "type", typeof (submitTextStepByStepData.text))

            console.log(submitTextStepByStepData)
        }

    }, [submitTextData, rerollData, submitTextSimilarData, submitTextLatexData, updateChunk, chunkIndex, resetTextSimilar, resetTextLatex, chunk, searchData, submitTextStepByStepData, resetTextStepByStep])

    return (
        <>
            <div
                ref={(node) => ref(drop(node))}
                onMouseEnter={() => !isHovered && setIsHovered(true)}
                onMouseLeave={() => isHovered && setIsHovered(false)}
                className={`tooltip border relative p-2 w-full transition-all duration-300 ease-in-out ${isHovered ? "border-base-content border-dashed" : "border-transparent"}`}
                data-tip={!id ? "Click and drag to a problem bank." : null}
            >
                <div className="absolute top-0 right-0 flex flex-row gap-2">
                    {(
                        isLoadingSubmitText
                        || isLoadingSubmitTextLatex
                        || isLoadingSubmitTextSimilar
                        || isLoadingSearch
                        || isLoadingSubmitTextStepByStep
                    ) && <GridLoader color="#4A90E2" size={4} margin={4} speedMultiplier={.75} className='mr-2' />}

                    {!id && <AddChunkModal chunk={chunk} modalId={'addChunkModal' + chunk.chunkId} enabled={false} />}

                    {id && chunk.tags && Object.keys(chunk.tags).length > 0 && (
                        <button
                            className="btn btn-secondary tooltip tooltip-bottom"
                            data-tip="Add problem to problem bank."
                            onClick={handleReroll}
                        >
                            Reroll
                        </button>
                    )}

                    {id && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteChunk(chunkIndex);
                            }}
                            className="btn btn-error tooltip tooltip-bottom"
                            data-tip="Delete this problem from bank."
                        >
                            Delete
                        </button>
                    )}
                </div>
                <div className='p-4'></div>

                {chunk?.content?.map((item, index) => {
                    const element = (() => {
                        switch (item.type) {
                            case 'instruction':
                                return <InstructionComponent chunkIndex={chunkIndex} instructionIndex={index} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} instruction={item} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                            case 'problem':
                                return <ProblemComponent chunkIndex={chunkIndex} problemIndex={index} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} problem={item} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                            case 'text':
                                return renderItem(item)
                            default:
                                return null;
                        }
                    })();

                    return (
                        <div key={`${item.type}-${index}-${chunk.content.length}`}>
                            {element}
                        </div>
                    );
                })}

                {chunkIndex == rerollData?.chunkIndex &&
                    <div>
                        Rerolled Chunk:
                        {rerollData?.chunks[currentRerollIndex].content.map((rerolledItem, rerollIndex) => {
                            const rerollElement = (() => {
                                switch (rerolledItem.type) {
                                    case 'instruction':
                                        return <InstructionComponent chunkIndex={chunkIndex} instructionIndex={rerollIndex} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} instruction={rerolledItem} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                                    case 'problem':
                                        return <ProblemComponent chunkIndex={chunkIndex} problemIndex={rerollIndex} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} problem={rerolledItem} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                                    default:
                                        return <div>None</div>;
                                }
                            })();

                            return (
                                <div key={`${rerolledItem.type}-${rerollIndex}-${chunk.content.length}`}>
                                    {chunkIndex == rerollData?.chunkIndex && rerollElement}
                                </div>
                            );
                        })}
                    </div>

                }

                <div>
                    {searchData?.response && searchData?.response.length > 0 && <div>Search Results:</div>}
                    {searchData?.response[currentSearchResponseIndex].content.map((item: any, index: any) => {
                        const searchResponseElement = (() => {
                            switch (item.type) {
                                case 'instruction':
                                    return <InstructionComponent chunkIndex={chunkIndex} instructionIndex={index} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} instruction={item} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                                case 'problem':
                                    return <ProblemComponent chunkIndex={chunkIndex} problemIndex={index} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} problem={item} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                                default:
                                    return <div>None</div>;
                            }
                        })();

                        return (
                            <div key={`${item.type}-${index}-${chunk.content.length}`}>
                                {searchResponseElement}
                            </div>
                        );
                    })}
                </div>


                {chunkIndex == submitTextData?.chunkIndex &&
                    <div>
                        Text changed:
                        {
                            submitTextData?.chunk.content?.map((changedItem, changedIndex) => {
                                const rerollElement = (() => {
                                    switch (changedItem.type) {
                                        case 'instruction':
                                            return <InstructionComponent chunkIndex={chunkIndex} instructionIndex={changedIndex} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} instruction={changedItem} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                                        case 'problem':
                                            return <ProblemComponent chunkIndex={chunkIndex} problemIndex={changedIndex} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} problem={changedItem} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                                        default:
                                            return <div>None</div>;
                                    }
                                })();

                                return (
                                    <div key={`${changedItem.type}-${changedIndex}-${chunk.content.length}`}>
                                        {chunkIndex == submitTextData?.chunkIndex && rerollElement}
                                    </div>
                                );
                            })}
                    </div>}

                {chunkIndex == submitTextSimilarData?.chunkIndex &&
                    <div>
                        Text changed:
                        {
                            submitTextSimilarData?.chunk.content?.map((changedItem, changedIndex) => {
                                const element = (() => {
                                    switch (changedItem.type) {
                                        case 'instruction':
                                            return <InstructionComponent chunkIndex={chunkIndex} instructionIndex={changedIndex} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} instruction={changedItem} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                                        case 'problem':
                                            return <ProblemComponent chunkIndex={chunkIndex} problemIndex={changedIndex} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} problem={changedItem} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                                        default:
                                            return <div>None</div>;
                                    }
                                })();

                                return (
                                    <div key={`${changedItem.type}-${changedIndex}-${chunk.content.length}`}>
                                        {chunkIndex == submitTextSimilarData?.chunkIndex && element}
                                    </div>
                                );
                            })}
                    </div>}

                {(errorText || errorTextSimilar || errorTextLatex || errorSearch || errorTextStepByStep) &&
                    <div className="text-error text-center mt-2">
                        {errorText && errorText.message}
                        {errorTextSimilar && errorTextSimilar.message}
                        {errorTextLatex && errorTextLatex.message}
                        {errorSearch && errorSearch.message}
                        {errorTextStepByStep && errorTextStepByStep.message}
                    </div>}

                {id && (submitTextData || rerollData || searchData) && <>
                    <button
                        className="btn btn-warning tooltip tooltip-bottom"
                        data-tip="Reject this change."
                        onClick={() => resetTextChange()}
                    >
                        Reject
                    </button>
                    <button
                        className="btn btn-secondary tooltip tooltip-bottom"
                        data-tip="Accept this change."
                        onClick={handleAcceptChunkChange}
                    >
                        Accept
                    </button>
                </>}



                {id && chunk.content.length == 0 && <>
                    {/* if a problem does not yet exist */}
                    <div>Create a new problem</div>
                    <input
                        type="text"
                        placeholder="Easy Derivative, or y=mx+b."
                        value={userInput} // Assuming userInput is your state variable
                        onChange={(e) => setUserInput(e.target.value)} // And setUserInput is the setter
                        className="input input-bordered w-full max-w-lg m-2"
                    />

                    <div className='space-x-2'>
                        <button
                            className="btn btn-secondary tooltip tooltip-left"
                            data-tip="Create a latex formatted math problem using your text description."
                            onClick={() => console.log("upload")}
                        >
                            Upload
                        </button>
                        <button
                            className="btn btn-secondary tooltip tooltip-left"
                            data-tip="Create a latex formatted math problem using your text description."
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                        <button
                            className="btn btn-secondary tooltip tooltip-left"
                            data-tip="Create a latex formatted math problem using your text description."
                            onClick={handleTextToLatex}
                        >
                            Create
                        </button>
                    </div>
                </>}

                {id && !submitTextData && !rerollData && chunk.content.length > 0 && <>
                    <input
                        type="text"
                        placeholder="Please make this problem easier or find me another problem like this one."
                        value={userInput} // Assuming userInput is your state variable
                        onChange={(e) => setUserInput(e.target.value)} // And setUserInput is the setter
                        className="input input-bordered w-full max-w-lg m-2"
                    />
                    <div className='space-x-2'>
                        {env == "local" && <button
                            className="btn btn-secondary tooltip tooltip-bottom"
                            data-tip={env == "local" ? "This is a dev only at the moment. " : "Send your input."}
                            onClick={handleSubmitText}
                            disabled={userInput.length == 0}
                        >
                            Change it (make a new one)!
                        </button>}
                        <button
                            className="btn btn-secondary tooltip tooltip-left mr-2"
                            data-tip="Find a similar problem using a text description."
                            onClick={handleSimilarSearchText}
                            disabled={userInput.length == 0}
                        >
                            Change it!
                        </button>
                        {env == "local" && //not allowed by wolfram in prod/test yet
                            <button
                                className="btn btn-secondary tooltip tooltip-left mr-2"
                                data-tip="Find a similar problem using a text description."
                                onClick={handleStepByStep}
                            >
                                Step-by-step
                            </button>
                        }
                    </div>
                </>}

            </div>
        </>
    );

};
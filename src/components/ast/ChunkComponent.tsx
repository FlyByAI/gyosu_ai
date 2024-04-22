import 'katex/dist/katex.min.css';
import React, { useEffect, useState } from 'react';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { useParams } from 'react-router-dom';
import { GridLoader } from 'react-spinners';
import { useDragContext } from '../../contexts/DragContext';
import { renderItem } from '../../helpers/AstRender';
import useGetDocument from '../../hooks/tools/math/useGetDocument';
import useImageUpload from '../../hooks/tools/math/useImageUpload';
import useSubmitChunk from '../../hooks/tools/math/useSubmitChunk';
import useSubmitDocument from '../../hooks/tools/math/useSubmitDocument';
import useSubmitMathForm from '../../hooks/tools/math/useSubmitMathForm';
import useSubmitReroll from '../../hooks/tools/math/useSubmitReroll';
import useSubmitTextWithChunk from '../../hooks/tools/math/useSubmitTextWithChunk';
import useSubmitTextWithChunkLatex from '../../hooks/tools/math/useSubmitTextWithChunkLatex';
import useSubmitTextWithChunkSimilar from '../../hooks/tools/math/useSubmitTextWithChunkSimilar';
import useEnvironment from '../../hooks/useEnvironment';
import { CHUNK_DRAG_TYPE, Chunk, INSTRUCTION_DRAG_TYPE, INSTRUCTION_TYPE, Instruction, PROBLEM_DRAG_TYPE, PROBLEM_TYPE, Problem, isText } from '../../interfaces';
import ArrowLeft from '../../svg/ArrowLeftIcon';
import ArrowRight from '../../svg/ArrowRightIcon';
import TrashIcon from '../../svg/TrashIcon';
import AddChunkModal from '../AddChunkModal';
import ImageUploader from '../ImageUploader';
import { InstructionComponent } from './InstructionComponent';
import { ProblemComponent } from './ProblemComponent';

interface ChunkProps {
    chunk: Chunk;
    edit?: boolean;
    insertChunk?: (chunkIndex: number) => void;
    updateChunk?: (updatedChunk: Chunk, chunkIndex: number) => void;
    chunkIndex: number;
    disableInstructionProblemDrag?: boolean;
    landingPageDemo?: boolean; //only used for landing page
}

type Direction = 'up' | 'down';

export function calculateNewIndex(currentIndex: number, length: number, direction: Direction): number {
    if (length <= 1) return 0; // If there's only one item or none, always return 0

    if (direction === 'up') {
        // If going up, increment the index, and wrap around to 0 if at the end
        return (currentIndex + 1) % length;
    } else {
        // If going down, decrement the index, and wrap around to the last item if at the beginning
        return (currentIndex - 1 + length) % length;
    }
}

export const ChunkComponent: React.FC<ChunkProps> = ({ chunk, updateChunk, chunkIndex, disableInstructionProblemDrag, landingPageDemo }) => {
    const { setDragState } = useDragContext();

    const [currentRerollIndex, setCurrentRerollIndex] = useState(0);
    const [currentSearchResponseIndex, setCurrentSearchResponseIndex] = useState(0);

    const { env, apiUrl } = useEnvironment();

    const endpoint2 = `${apiUrl}/math_app/school_document/`;
    const wolframEndpoint = `${apiUrl}/math_app/wolfram/`;

    const { isLoading, updateDocument } = useSubmitDocument(endpoint2);

    const [isHovered, setIsHovered] = useState(false);

    const [userInput, setUserInput] = useState(landingPageDemo ? "word problems, fractions" : "")

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

    const { submitReroll, data: rerollData, reset: resetReroll, isLoading: isLoadingReroll } = useSubmitReroll(`${apiUrl}/math_app/reroll/`)
    const { submitMathForm, data: searchData, reset: resetSearchData, isLoading: isLoadingSearch, error: errorSearch } = useSubmitMathForm(`${apiUrl}/math_app/generate/`)
    const { submitTextWithChunk, data: submitTextData, reset: resetTextChange, isLoading: isLoadingSubmitText, error: errorText } = useSubmitTextWithChunk(`${apiUrl}/math_app/chat/problem/agent/`)
    const { submitTextWithChunkLatex, data: submitTextLatexData, reset: resetTextLatex, isLoading: isLoadingSubmitTextLatex, error: errorTextLatex } = useSubmitTextWithChunkLatex(`${apiUrl}/math_app/chat/problem/text_to_latex/`)
    const { submitTextWithChunkSimilar, data: submitTextSimilarData, reset: resetTextSimilar, isLoading: isLoadingSubmitTextSimilar, error: errorTextSimilar } = useSubmitTextWithChunkSimilar(`${apiUrl}/math_app/chat/problem/similar/`)
    const { uploadImage, data: submitImageData, reset: resetImage, isLoading: isLoadingSubmitImage, error: errorImage } = useImageUpload(`${apiUrl}/math_app/chat/image/`)
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
        console.log("searching")
        submitMathForm({ data: { userInput: userInput } })
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
        if (submitTextSimilarData) {
            const updatedChunk = submitTextSimilarData.chunk
            updateChunk && updateChunk(updatedChunk, chunkIndex)
            resetTextSimilar()
        }
        if (searchData) {
            const updatedChunk = searchData.response[currentSearchResponseIndex]
            updateChunk && updateChunk(updatedChunk, chunkIndex)
            resetSearchData()
        }
    }

    useEffect(() => {

        if (submitImageData) {
            console.log("image uploaded", submitImageData)
            const instructions = { type: "instruction", content: [{ type: "text", value: submitImageData.instructions }] } as Instruction
            const problems = submitImageData.problems

            console.log("instructions", instructions, typeof (instructions))
            console.log("problems", problems, typeof (problems))

            if (typeof (problems) == "string") {
                const problemsStringArr = JSON.parse(problems)
                console.log("problemsStringArr", problemsStringArr)
                const problemsArr = problemsStringArr.map((problem: string) => {
                    return { type: "problem", content: [{ type: "math", value: problem }] } as Problem
                })

                const newChunk: Chunk = { type: "chunk", content: [instructions, ...problemsArr] }

                console.log(newChunk)
                updateChunk && updateChunk(newChunk, chunkIndex)
                resetImage()

            }
            else {
                console.log("unexpected type from image upload", typeof (problems))
            }

            // updateChunk && updateChunk(submitImageData.chunk, chunkIndex)
            // resetImage()
        }
        if (submitTextData) {
            console.log("new text changed chunk", submitTextData)
            console.log("old chunk", chunk)
        }
        if (rerollData) {
            console.log("new rerolled chunks", rerollData)
        }
        if (submitTextSimilarData) {
            console.log("new similar chunk", submitTextSimilarData)
            
        }
        if (submitTextLatexData) {
            console.log("new problem from text_to_latex", submitTextLatexData)

            const instruction = {
                type: "instruction",
                content: [{ type: "text", value: submitTextLatexData.instruction }]
            } as Instruction

            const problem = {
                type: "problem",
                content: [{ type: "math", value: submitTextLatexData.latex }]
            } as Problem
            const chunk: Chunk = { content: [instruction, problem], type: "chunk", tags: {}, ...submitTextLatexData.chunk }
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

    }, [submitTextData, rerollData, submitTextSimilarData, submitTextLatexData, updateChunk, chunkIndex, resetTextSimilar, resetTextLatex, chunk, searchData, submitTextStepByStepData, resetTextStepByStep, submitImageData, resetImage])



    return (
        <>
            <div
                ref={(node) => ref(drop(node))}
                onMouseEnter={() => !isHovered && setIsHovered(true)}
                onMouseLeave={() => isHovered && setIsHovered(false)}
                className={`${!id && "tooltip"} border relative p-2 w-full transition-all duration-300 ease-in-out ${isHovered ? "border-base-content border-dashed" : "border-transparent"}`}
                data-tip={(!id && !landingPageDemo) ? "Click and drag to a problem bank." : undefined}
            >
                <div className="absolute top-0 right-0 flex flex-row gap-2">
                    {(
                        isLoadingSubmitText
                        || isLoadingSubmitTextLatex
                        || isLoadingSubmitTextSimilar
                        || isLoadingSearch
                        || isLoadingReroll
                        || isLoadingSubmitTextStepByStep
                        || isLoadingSubmitImage
                    ) && <GridLoader color="#4A90E2" size={4} margin={4} speedMultiplier={.75} className='mr-2' />}

                    {!landingPageDemo && !id && <AddChunkModal chunk={chunk} modalId={'addChunkModal' + chunk.chunkId} enabled={false} />}



                    {id && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteChunk(chunkIndex);
                            }}
                            disabled={isLoading}
                            className="btn hover:bg-red-200 tooltip tooltip-bottom"
                            data-tip="Delete this problem from bank."
                        >
                            <TrashIcon />
                        </button>
                    )}
                </div>
                <div className='p-4'></div>

                {chunk?.content?.map((item, index) => {
                    const element = (() => {
                        switch (item.type) {
                            case 'instruction':
                                return <InstructionComponent debug={env == "local"} chunkIndex={chunkIndex} instructionIndex={index} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} instruction={item} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                            case 'problem':
                                return <ProblemComponent debug={env == "local"} chunkIndex={chunkIndex} problemIndex={index} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} problem={item} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
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
                        <div className='flex justify-items-between'>
                            <button className='w-1/12 mx-auto btn btn-secondary' onClick={() => setCurrentRerollIndex(calculateNewIndex(currentRerollIndex, rerollData.chunks.length, 'down'))}><ArrowLeft /></button>
                            Use arrows to switch between ({rerollData?.chunks.length}) results
                            <button className='w-1/12 mx-auto btn btn-secondary' onClick={() => setCurrentRerollIndex(calculateNewIndex(currentRerollIndex, rerollData.chunks.length, 'up'))}><ArrowRight /></button>
                        </div>
                        New problem:
                    </div>
                }


                {rerollData?.chunks[currentRerollIndex]?.content?.map((rerolledItem, rerollIndex) => {
                    const rerollElement = (() => {
                        switch (rerolledItem.type) {
                            case 'instruction':
                                return <InstructionComponent debug={env == "local"} chunkIndex={chunkIndex} instructionIndex={rerollIndex} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} instruction={rerolledItem} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                            case 'problem':
                                return <ProblemComponent debug={env == "local"} chunkIndex={chunkIndex} problemIndex={rerollIndex} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} problem={rerolledItem} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                            default:
                                return <div>None</div>;
                        }
                    })();

                    return (
                        <div>
                            <div key={`${rerolledItem.type}-${rerollIndex}-${chunk.content.length}`}>
                                {chunkIndex == rerollData?.chunkIndex && rerollElement}
                            </div>
                        </div>
                    );
                })}


                {searchData && searchData?.response.length > 0 &&
                    <div className='flex justify-items-between text-lg'>
                        <button className="w-1/12 mx-auto btn btn-secondary tooltip" data-tip="View previous result." onClick={() => setCurrentSearchResponseIndex(calculateNewIndex(currentSearchResponseIndex, searchData?.response.length, 'down'))}><ArrowLeft /></button>
                        Use arrows to switch between ({searchData?.response.length}) results
                        <button className="w-1/12 mx-auto btn btn-secondary tooltip" data-tip="View next result." onClick={() => setCurrentSearchResponseIndex(calculateNewIndex(currentSearchResponseIndex, searchData?.response.length, 'up'))}><ArrowRight /></button>
                    </div>
                }
                {searchData?.response && searchData?.response.length == 0 &&
                    <div>No results, please try another query</div>
                }
                {searchData?.response && searchData?.response.length > 0 && searchData?.response[currentSearchResponseIndex]?.content?.map((item: any, index: any) => {
                    const searchResponseElement = (() => {
                        switch (item.type) {
                            case 'instruction':
                                return <InstructionComponent debug={env == "local"} chunkIndex={chunkIndex} instructionIndex={index} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} instruction={item} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                            case 'problem':
                                return <ProblemComponent debug={env == "local"} chunkIndex={chunkIndex} problemIndex={index} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} problem={item} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                            default:
                                return <div>None</div>;
                        }
                    })();

                    return (
                        <div>
                            <div key={`${item.type}-${index}-${chunk.content?.length}`}>
                                {searchResponseElement}
                            </div>
                        </div>
                    );
                })}


                {chunkIndex == submitTextData?.chunkIndex &&
                    <div>
                        Text changed:
                        {
                            submitTextData?.chunk.content?.map((changedItem, changedIndex) => {
                                const element = (() => {
                                    switch (changedItem.type) {
                                        
                                        case 'instruction':
                                            return <InstructionComponent debug={env == "local"} chunkIndex={chunkIndex} instructionIndex={changedIndex} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} instruction={changedItem} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                                        case 'problem':
                                            return <ProblemComponent debug={env == "local"} chunkIndex={chunkIndex} problemIndex={changedIndex} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} problem={changedItem} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                                        default:
                                            return <div>None</div>;
                                    }
                                })();

                                return (
                                    <div key={`${changedItem.type}-${changedIndex}-${chunk.content.length}`}>
                                        {chunkIndex == submitTextData?.chunkIndex && element}
                                    </div>
                                );
                            })}
                    </div>}

                {chunkIndex == submitTextSimilarData?.chunkIndex &&
                    <div>
                        Text2 changed:
                        {
                            submitTextSimilarData?.chunk.content?.map((changedItem, changedIndex) => {
                                const element2 = (() => {
                                    switch (changedItem.type) {
                                        
                                        case 'instruction':
                                            return <InstructionComponent debug={env == "local"} chunkIndex={chunkIndex} instructionIndex={changedIndex} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} instruction={changedItem} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                                        case 'problem':
                                            return <ProblemComponent debug={env == "local"} chunkIndex={chunkIndex} problemIndex={changedIndex} parentChunk={chunk} parentChunkIndex={chunkIndex} updateChunk={updateChunk} problem={changedItem} onInstructionHover={setIsHovered} disableInstructionProblemDrag={disableInstructionProblemDrag} />;
                                        default:
                                            return <div>None</div>;
                                    }
                                })();

                                return (
                                    <div key={`${changedItem.type}-${changedIndex}-${chunk.content.length}`}>
                                        {chunkIndex == submitTextSimilarData?.chunkIndex && element2}
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
                        {errorImage && errorImage.message}
                    </div>}

                {landingPageDemo || (id && (submitTextData || rerollData || searchData || submitTextSimilarData)) && <>
                    <button
                        className="btn btn-warning tooltip tooltip-bottom mr-4"
                        data-tip="Reject this change."
                        onClick={() => {
                            submitTextData && resetTextChange()
                            submitTextSimilarData && resetTextSimilar()
                            rerollData && resetReroll()
                            searchData && resetSearchData()
                        }}
                    >
                        Reject
                    </button>
                    <button
                        className="btn btn-primary tooltip tooltip-bottom"
                        data-tip="Accept this change."
                        onClick={handleAcceptChunkChange}
                    >
                        Accept
                    </button>
                </>}

                {(landingPageDemo || (id && chunk.content.length == 0 && !searchData)) && <>
                    {/* if a problem does not yet exist */}
                    {!landingPageDemo && <div className='mx-8'>Search or create a problem here!</div>}
                    <div className='mx-8'>Describe what you are looking for in a few words.</div>
                    <input
                        type="text"
                        placeholder="Describe a math problem in text (ex: x^2 + 1), or search for a problem."
                        value={userInput} // Assuming userInput is your state variable
                        onChange={(e) => setUserInput(e.target.value)} // And setUserInput is the setter
                        className="input input-bordered w-full max-w-lg m-2"
                    />

                    <div className='space-x-2'>


                        {!landingPageDemo && env == "local" &&
                            <ImageUploader
                                onFileUpload={function (imageFile: File): void {
                                    console.log("imageFile uploaded", imageFile)
                                    uploadImage({ image: imageFile })

                                }} />
                        }

                        {/* </button> */}
                        <button
                            className="btn btn-secondary tooltip tooltip-left"
                            data-tip="Find a math problem using your text description. Try: word problem, unit circle, fractions multiplication."
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                        {!landingPageDemo && <button
                            className="btn btn-secondary tooltip tooltip-left"
                            data-tip="Create a latex formatted math problem using your text description. Try: integral x^2."
                            onClick={handleTextToLatex}
                        >

                            Create
                        </button>}
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
                        {id && chunk.tags && Object.keys(chunk.tags).length > 0 && (
                            <button
                                className="btn btn-secondary tooltip tooltip-bottom"
                                data-tip="Find similar problems."
                                onClick={handleReroll}
                            >
                                Reroll
                            </button>
                        )}
                        <button
                            className="btn btn-secondary tooltip tooltip-bottom"
                            data-tip={env == "local" ? "This is a dev only at the moment. " : "Send your input."}
                            onClick={handleSubmitText}
                            disabled={userInput.length == 0}
                        >
                            Change it!
                        </button>
                        <button
                            className="btn btn-secondary tooltip tooltip-left mr-2"
                            data-tip="Find a similar problem using a text description."
                            onClick={handleSimilarSearchText}
                            disabled={userInput.length == 0}
                        >
                            Show me similar problems
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
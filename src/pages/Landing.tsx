import React from 'react';
import { Link } from 'react-router-dom';
import ArrowRightMore from '../svg/ArrowRightMore';
import MathProblem from '../components/math/MathProblem';
import { Chunk, ProblemData } from '../interfaces';
import AIChatSmallWrapper from '../components/math/AIChatSmallWrapper';
import LoopingText from '../components/LoopingText';

const LandingPage: React.FC = () => {

    const sampleChunk: Chunk = {
        "id": 445,
        "type": "chunk",
        "content": [
            {
                "type": "instruction",
                "content": [
                    {
                        "type": "text",
                        "value": "For the following exercises, find the domain of each function using interval notation."
                    }
                ],
            },
            {
                "type": "problem",
                "content": [
                    {
                        "type": "math",
                        "value": "f(x) = - 2x(x - 1)(x - 2)"
                    }
                ],
            },
            {
                "type": "problem",
                "content": [
                    {
                        "type": "math",
                        "value": "\\begin{array}{l}\n \\\\\n{f(x) = \\sqrt[{}]{x^{2} + 4}}\n\\end{array}"
                    }
                ],
            },
            {
                "type": "problem",
                "content": [
                    {
                        "type": "math",
                        "value": "f(x) = \\sqrt[3]{x - 1}"
                    }
                ],
            },
            {
                "type": "problem",
                "content": [
                    {
                        "type": "math",
                        "value": "{f(x) =}\\frac{5}{\\sqrt{x - 3}}"
                    }
                ],
            },
            {
                "type": "problem",
                "content": [
                    {
                        "type": "math",
                        "value": "f(x) = \\frac{\\sqrt{x - 4}}{\\sqrt{x - 6}}"
                    }
                ],
            },
            {
                "type": "problem",
                "content": [
                    {
                        "type": "math",
                        "value": "f(x) = \\frac{x}{x}"
                    }
                ],
            },
            {
                "type": "problem",
                "content": [
                    {
                        "type": "math",
                        "value": "f(x) = \\frac{x^{2} - 9x}{x^{2} - 81}"
                    }
                ],
            }
        ],

    }

    return (
        <div>
            <section className="h-full flex flex-col md:flex-row items-center" style={{ backgroundImage: `url('/svg/dark-bg.svg')`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                <img className="w-3/4 md:w-1/3 h-auto mx-auto md:mx-0" src="/svg/teacher1.svg" alt="Image 1" />
                <div className="ml-0 md:ml-20 w-full md:w-2/3 text-center md:text-left text-3xl md:text-5xl text-gray-300 p-4">
                    <p className="font-bold mt-4">Create math worksheets</p>
                    <p className="font-bold mt-4">with AI</p>
                    <p className="mt-4 text-lg">Customized content for your students in seconds</p>
                    <Link className="text-sm" to="/math-app">
                        <button className="bg-gradient-to-r from-blue-700 to-green-600 hover:from-blue-500 hover:to-green-500 text-white rounded-3xl flex items-center my-6 p-1 pl-4">
                            Create a worksheet
                            <ArrowRightMore className="p-2 text-lg" />
                        </button>
                    </Link>
                </div>
            </section>


            <section className="h-full bg-gray-100 justify-center py-8 text-gray-700 flex flex-col items-center">
                <div className='font-bold w-full text-center text-3xl md:text-5xl mb-4'>
                    The problems you face
                </div>
                <div className='w-full text-center text-xl mb-8'>
                    We understand that you have a lot on your plate.
                </div>

                <div className='flex flex-col md:flex-row space-x-0 space-y-16 md:space-x-16 md:space-y-0 w-3/4 h-full'>
                    <div className="w-full xl:w-1/3 text-gray-800 max-w-lg p-4 bg-orange-100 flex flex-col items-center rounded-3xl">
                        <img className="w-1/4 sm:w-1/3 h-auto m-6" src="/svg/time.svg" alt="Time" />
                        <div className="text-center text-2xl font-bold">Time</div>
                        <div className='text-center text-lg'>Creating content for your classrooms is time consuming when you already have a lot on your plate.</div>
                    </div>
                    <div className="w-full xl:w-1/3 text-gray-800 max-w-lg p-4 bg-blue-100 flex flex-col items-center rounded-3xl">
                        <img className="w-1/4 sm:w-1/3 h-auto m-6" src="/svg/pencilwrench.svg" alt="Customization" />
                        <div className="text-center text-2xl font-bold">Customization</div>
                        <div className='text-center text-lg'>Students need customized learning, but creating customized and engaging content can be a challenge.</div>
                    </div>
                    <div className="w-full xl:w-1/3 text-gray-800 max-w-lg p-4 bg-pink-100 flex flex-col items-center rounded-3xl">
                        <img className="w-1/4 sm:w-1/3 h-auto m-6" src="/svg/ai.svg" alt="AI" />
                        <div className="text-center text-2xl font-bold">Artificial Intelligence</div>
                        <div className="text-center text-lg">Students are leveraging AI, but educators have yet to fully harness its potential.</div>
                    </div>
                </div>
            </section>
            <section className="py-10 h-full bg-pink-100 justify-center text-gray-700 flex flex-col md:flex-row items-center">
                <div className='w-full md:w-1/2 text-2xl md:text-5xl flex flex-col items-center'>
                    <h1 className="font-bold mb-4">Drag and drop</h1>
                    <p className=" text-lg">Drag problems to re-arrange them</p>
                </div>
                <div className='w-full md:w-1/2 flex flex-col py-4'>
                    <div className='w-3/4 mx-auto flex flex-row mb-4 bg-gray-900 p-2'>
                        <div className='w-full rounded-xl'>
                            <MathProblem chunkIndex={0}
                                problem={sampleChunk as Chunk}
                                updateChunk={() => console.log('update')} />
                        </div>
                    </div>
                </div>
            </section>
            {/* <section className="py-10 h-full bg-pink-100 justify-center text-gray-700 flex flex-col md:flex-row items-center">
                <div className='w-full md:w-1/2 text-2xl md:text-5xl flex flex-col items-center'>
                    <h1 className="font-bold mb-4">Chat with AI</h1>
                    <p className="text-lg">Make the problem more fun</p>
                </div>
                <div className='w-full md:w-1/2 flex flex-col py-4'>
                    <div className='w-3/4 mx-auto flex flex-row mb-4 bg-gray-900 p-2'>
                        <div className='w-full rounded-xl'>
                            <MathProblem chunkIndex={0}
                                problem={sampleChunk2 as Chunk}
                                updateChunk={() => console.log('update')} />
                        </div>
                    </div>
                </div>
            </section > */}
            <section className="p-10 h-full flex items-center" style={{ backgroundImage: `url('/svg/tech-bg.svg')`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                <div className="w-2/3 text-5xl text-gray-800">
                    <h1 className="font-bold">A teaching tool</h1>
                    <h1 className="font-bold">just for you</h1>
                    <p className="mt-4 text-lg">Let us be your full time content creation tool</p>
                    <Link className="text-sm" to="/math-app">
                        <button className="bg-gradient-to-r from-blue-700 to-green-600 hover:from-blue-500 hover:to-green-500 text-white rounded-3xl flex items-center my-6 p-1 pl-4">
                            Create a worksheet
                            <ArrowRightMore className="p-2 text-lg" />
                        </button>
                    </Link>
                </div>
                <img className="w-1/3 h-auto" src="/svg/teacher2.svg" alt="Image 1" />
            </section>
        </div >
    );
};

export default LandingPage;

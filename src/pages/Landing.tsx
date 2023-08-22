import React from 'react';
import { Link } from 'react-router-dom';
import ArrowRightMore from '../svg/ArrowRightMore';
import MathProblem from '../components/math/MathProblem';
import { Chunk, ProblemData } from '../interfaces';

const LandingPage: React.FC = () => {
    return (
        <div>
            <section className="h-full flex items-center" style={{ backgroundImage: `url('/png/dark-bg.png')`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: '100% auto' }}>
                <img className="w-1/3 h-auto" src="/png/teacher1.png" alt="Image 1" />
                <div className="ml-20 w-2/3 text-5xl text-gray-300">
                    <p className="font-bold mt-4">Empowering you with</p>
                    <p className="font-bold mt-4">custom AI math tools</p>
                    <p className="mt-4 text-lg">Quickly create customized content for your students</p>
                    <Link className="text-sm" to="/math-app">
                        <button className="bg-orange-500 text-white rounded-3xl flex items-center my-6 p-1 pl-4">
                            Try AI Generate
                            <ArrowRightMore className="p-2 text-lg" />
                        </button>
                    </Link>
                </div>
            </section>

            <section className="h-full bg-gray-100 justify-center py-8 text-gray-700 flex flex-col items-center">
                <div className='font-bold w-full text-center text-5xl mb-4'>
                    The problems you face
                </div>
                <div className='w-full text-center text-xl mb-8'>
                    We understand that you have a lot on your plate.
                </div>
                <div className='flex flex-row space-x-16 w-3/4'>
                    <div className="w-1/3 text-gray-800 h-96 p-4 bg-orange-100 flex flex-col items-center rounded-3xl">
                        <img className="w-1/3 h-auto m-6" src="/png/time.png" alt="Time" />
                        <div className="text-center text-2xl">Time</div>
                        <div className='text-center text-lg'>Creating content for your classrooms is extremely time consuming when you already have a lot on your plate.</div>
                    </div>
                    <div className="w-1/3 text-gray-800 h-96 p-4 bg-blue-100 flex flex-col items-center rounded-3xl">
                        <img className="w-1/3 h-auto m-6" src="/png/pencilwrench.png" alt="Customization" />
                        <div className="text-center text-2xl">Customization</div>
                        <div className='text-center text-lg'>Students need custom lesson plans for them, but creating customized content is too difficult.</div>
                    </div>
                    <div className="w-1/3 text-gray-800 h-96 p-4 bg-pink-100 flex flex-col items-center rounded-3xl">
                        <img className="w-1/3 h-auto m-6" src="/png/ai.png" alt="AI" />
                        <div className="text-center text-2xl">AI</div>
                        <div className='text-center text-lg'>Students are using AI to cheat traditional methods of teaching, and teachers are not using AI to their advantage.</div>
                    </div>
                </div>
            </section>



            <section className="h-full bg-pink-100 justify-center py-8 text-gray-700 flex flex-row items-center">
                <div className='w-1/2 flex flex-col'>
                    <MathProblem index={0}
                        problem={{
                            "id": 1,
                            "parent_id": null,
                            "type": "chunk",
                            "content": [
                                {
                                    "type": "problem",
                                    "content": [
                                        {
                                            "type": "text",
                                            "value": "What is the difference between a relation and a function?"
                                        }
                                    ]
                                }
                            ]
                        } as Chunk}
                        problemData={{} as ProblemData}
                        insertChunk={() => console.log("demo")}
                        deleteChunk={() => console.log("demo")}
                    />
                    <MathProblem index={0}
                        problem={{
                            "id": 1,
                            "parent_id": null,
                            "type": "chunk",
                            "content": [
                                {
                                    "type": "problem",
                                    "content": [
                                        {
                                            "type": "text",
                                            "value": "What is the difference between a relation and a function?"
                                        }
                                    ]
                                }
                            ]
                        } as Chunk}
                        problemData={{} as ProblemData}
                        insertChunk={() => console.log("demo")}
                        deleteChunk={() => console.log("demo")}
                    />
                </div>
                <div className='w-1/2 text-5xl flex flex-col items-center'>
                    <h1 className="font-bold">Drag and drop</h1>
                    <p className="mb-16 text-lg">Drag problems to re-arrange them</p>

                    <h1 className="mt-16 font-bold">Chat with AI</h1>
                    <p className="text-lg">Make the problem more fun</p>
                </div>
            </section>

            <section className="h-full bg-gray-100 flex items-center">
                <div className="ml-20 w-2/3 text-5xl text-gray-800">
                    <h1 className="font-bold">A teaching tool</h1>
                    <h1 className="font-bold">just for you</h1>
                    <p className="mt-4 text-lg">Let us be your full time content creation tool</p>
                    <Link className="text-sm" to="/math-app">
                        <button className="bg-orange-500 text-white rounded-3xl flex items-center my-6 p-1 pl-4">
                            Try AI Generate
                            <ArrowRightMore className="p-2 text-lg" />
                        </button>
                    </Link>
                </div>
                <img className="w-1/3 h-auto" src="/png/teacher2.png" alt="Image 1" />
            </section>
        </div>
    );
};

export default LandingPage;

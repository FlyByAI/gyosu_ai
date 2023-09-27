import React from 'react';
import { Link } from 'react-router-dom';
import ArrowRightMore from '../svg/ArrowRightMore';
import MathProblem from '../components/math/MathProblem';
import { Chunk, ProblemData } from '../interfaces';
import AIChatSmallWrapper from '../components/math/AIChatSmallWrapper';
import LoopingText from '../components/LoopingText';

const LandingPage: React.FC = () => {

    return (
        <div>
            <section className="h-full flex flex-col md:flex-row items-center" style={{ backgroundImage: `url('/svg/dark-bg.svg')`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundColor: '#0b1536' }}>
                <img className="w-3/4 md:w-1/3 h-auto mx-auto md:mx-0" src="/svg/teacher1.svg" alt="Teacher illustration with open book" />
                <div className="ml-0 md:ml-20 w-full md:w-2/3 text-center md:text-left text-3xl md:text-5xl text-gray-300 p-4">
                    <p className="font-bold mt-4 flex-col"><div className='mb-4'>Create math </div><LoopingText variant='typed' textArray={['worksheets', 'problems', 'quizzes', 'exams']} /></p>
                    <p className="font-bold mt-4">with AI</p>
                    <p className="mt-4 text-lg">Generative AI, for math teachers.</p>
                    <Link className="text-sm" to="/math-app">
                        <button className="bg-gradient-to-r from-blue-700 to-green-600 hover:from-blue-500 hover:to-green-500 text-white rounded-3xl flex items-center my-6 p-1 pl-4">
                            Create a worksheet
                            <ArrowRightMore className="p-2 text-lg" />
                        </button>
                    </Link>
                </div>
            </section>
            <section className="h-full bg-gray-100 justify-center py-8 text-gray-700 flex flex-col items-center">
                <h1 className='font-bold w-full text-center text-3xl md:text-5xl mb-4'>
                    Teacher burnout is a major problem.
                </h1>
                <div className='w-full text-center text-xl mb-8'>
                    We believe we can be a part of your solution.
                </div>

                <div className='flex flex-col md:flex-row space-x-0 space-y-16 md:space-x-16 md:space-y-0 w-3/4 h-full'>
                    <div className="w-full xl:w-1/3 text-gray-800 max-w-lg p-4 bg-orange-100 flex flex-col items-center rounded-3xl">
                        <img className="w-1/4 sm:w-1/3 h-auto m-6" src="/svg/time.svg" alt="Time Illustration" />
                        <div className="text-center text-2xl font-bold mb-4">Save Time</div>
                        <div className='text-left text-lg'>Spend more time with your students, spend less time finding problems & creating content.</div>
                    </div>
                    <div className="w-full xl:w-1/3 text-gray-800 max-w-lg p-4 bg-blue-100 flex flex-col items-center rounded-3xl">
                        <img className="w-1/4 sm:w-1/3 h-auto m-6" src="/svg/pencilwrench.svg" alt="Customization Illustration" />
                        <div className="text-center text-2xl font-bold mb-4">Customize</div>
                        <div className='text-left text-lg'>Every year, class, and student is unique. Create customized content just for them.</div>
                    </div>
                    <div className="w-full xl:w-1/3 text-gray-800 max-w-lg p-4 bg-pink-100 flex flex-col items-center rounded-3xl">
                        <img className="w-1/4 sm:w-1/3 h-auto m-6" src="/svg/ai.svg" alt="AI Illustration" />
                        <div className="text-center text-2xl font-bold mb-4">AI</div>
                        <div className="text-left text-lg">AI generated math problems that you can trust.</div>
                    </div>
                </div>
            </section>
            <section className="py-10 h-full bg-pink-100 justify-center text-gray-700 flex flex-col md:flex-row items-center">
                <div className='w-full md:w-1/2 text-2xl md:text-5xl flex flex-col items-center md:ms-4'>
                    <h1 className="font-bold mb-4">22,000+ Problems</h1>
                    <p className="text-center text-lg">High quality problems sourced from math textbooks.</p>
                </div>
                <div className='w-full md:w-1/2 flex flex-col py-4'>
                    <div className='w-3/4 mx-auto flex flex-row mb-4 bg-gray-900 p-2'>
                        <div className='w-full rounded-xl'>
                            <img className='w-full' src="images/chunkcomponent.png" alt="Math problem component with latex" />
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-10 h-full bg-blue-100 justify-center text-gray-700 flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 flex flex-col py-4 h-96 items-center justify-center">
                    <img
                        className="object-contain h-full max-h-96 border-2 me-8 border-gray-900"
                        src="/images/landing_page_worksheet_demo.png"
                        alt="Math Worksheet - Understanding Functions and Relations"
                    />
                </div>
                <div className='w-full mx-auto md:w-1/2 text-2xl md:text-5xl flex flex-col items-center md:me-4'>
                    <h1 className="text-center font-bold mb-4 mx-auto">Customized Classroom Materials</h1>
                    <p className="text-center mx-auto text-lg">Created by you in seconds.</p>
                </div>
            </section>

            <section className="p-10 h-full flex items-center" style={{ backgroundImage: `url('/svg/tech-bg.svg')`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundColor: '#0b1536' }}>
                <div className="w-2/3 text-3xl text-gray-800">
                    <h1 className="font-bold" ><LoopingText variant='typed' textArray={['Innovative', 'Impactful', 'Customized']} /></h1><h1>Education</h1>
                    <h1 className="font-bold"></h1>
                    <p className="mt-4 text-lg">starts with you.</p>
                    <Link className="text-sm" to="/math-app">
                        <button className="bg-gradient-to-r from-blue-700 to-green-600 hover:from-blue-500 hover:to-green-500 text-white rounded-3xl flex items-center my-6 p-1 pl-4">
                            Start Creating
                            <ArrowRightMore className="p-2 text-lg" />
                        </button>
                    </Link>
                </div>
                <img className="w-1/3 h-auto" src="/svg/teacher2.svg" alt="Teacher illustration with stack of books" />
            </section>
        </div >
    );
};

export default LandingPage;

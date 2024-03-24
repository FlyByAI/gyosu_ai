import { useClerk } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoopingText from '../components/LoopingText';
import ArrowRightMore from '../svg/ArrowRightMore';
import DocxSVG from '../svg/DocxSVG';
import PdfSVG from '../svg/PdfSVG';

const LandingPage: React.FC = () => {

    const [inputText, setInputText] = useState('');
    const { session, openSignIn } = useClerk();
    const navigate = useNavigate();

    useEffect(() => {
        const savedMessage = localStorage.getItem('userMessage');
        if (session && savedMessage) {
            navigate('/math-app/chat', { state: { text: savedMessage } });
            localStorage.removeItem('userMessage');
        }
    }, [session, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            localStorage.setItem('userMessage', inputText);
            openSignIn({
                afterSignInUrl: window.location.href
            });
        } else {
            navigate('/math-app/chat', { state: { text: inputText } });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (!session) {
                localStorage.setItem('userMessage', inputText);
                openSignIn({
                    afterSignInUrl: window.location.href
                });
            } else {
                navigate('/math-app/chat', { state: { text: inputText } });
            }
        }
    };

    return (
        <div>
            <section className="h-full flex flex-col md:flex-row items-center" style={{ backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                <img className="w-1/2 pt-4 md:pt-0 md:w-1/3 md:mx-0" src="/png/teacher1.png" alt="Teacher illustration with open book" />
                <div className="ml-0 md:ml-20 w-full md:w-2/3 text-center md:text-left text-3xl md:text-5xl p-4">
                    <p className="font-bold my-4 flex-col">Create </p><LoopingText variant='typed' textArray={['worksheets', 'lesson plans', 'quizzes', 'exams', "study guides", "class activities"]} />
                    {/* <p className="font-bold mt-4">quickly & easily</p> */}
                    <p className="mt-4 text-lg">Customized & classroom-ready educational content sourced directly from textbooks.</p>
                    <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden shadow-lg my-4 p-2">
                        {/* <textarea
                            value={inputText}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Can you create a lesson plan for me to teach the unit circle?"
                            className="resize-none md:w-1/2 w-full bg-gray-100 text-black text-lg rounded leading-tight p-2 flex-1 border-green-300 border-2 focus:outline-none focus:border-2 focus:border-blue-300"
                            style={{
                                boxShadow: '0 0 5px rgba(81, 203, 238, 0.5)',
                            }}
                        /> */}
                        <button
                            type="submit"
                            className="btn btn-primary md:w-2/5 w-2/3 "
                            style={{
                                boxShadow: '0 0 5px rgba(81, 203, 238, 0.5)',
                            }}
                        >
                            Chat
                            <ArrowRightMore className="ml-2" />
                        </button>
                    </form>
                </div>
            </section>
            <section className="h-full bg-white justify-center py-8 text-gray-700 flex flex-col items-center" style={{ backgroundPosition: 'center', backgroundRepeat: 'repeat', backgroundSize: 'cover' }}>
                <h1 className='font-bold w-full text-center text-3xl md:text-5xl mb-4'>
                    Improving access to high-quality, customized education for everyone.
                </h1>
                {/* <div className='w-full text-center text-xl mb-8'>
                    We believe we can be a part of your solution.
                </div> */}

                <div className='flex flex-col md:flex-row space-x-0 space-y-16 md:space-x-8 md:space-y-0 w-4/5 h-full'>
                    <div className="w-full xl:w-1/4 text-gray-800 max-w-lg p-4 bg-orange-100 flex flex-col items-center rounded-3xl">
                        <img className="w-1/4 sm:w-1/4 h-auto m-6" src="/png/time.png" alt="Time Illustration" />
                        <div className="text-center text-2xl font-bold mb-4">Quality of Life</div>
                        <div className='text-left text-lg'>Spend more time teaching, not preparing to teach.</div>
                    </div>
                    <div className="w-full xl:w-1/4 text-gray-800 max-w-lg p-4 bg-blue-100 flex flex-col items-center rounded-3xl">
                        <img className="w-1/4 sm:w-1/4 h-auto m-6" src="/png/pencilwrench.png" alt="Customization Illustration" />
                        <div className="text-center text-2xl font-bold mb-4">Effective Teaching</div>
                        <div className='text-left text-lg'>Teach to the student, not the standard.</div>
                    </div>
                    <div className="w-full xl:w-1/4 text-gray-800 max-w-lg p-4 bg-pink-100 flex flex-col items-center rounded-3xl">
                        <img className="w-1/4 sm:w-1/4 h-auto m-6" src="/png/ai.png" alt="AI Illustration" />
                        <div className="text-center text-2xl font-bold mb-4">Verifiable AI</div>
                        <div className="text-left text-lg">Verify quality with ease. Documents link directly to textbook sources.</div>
                    </div>
                    <div className="w-full xl:w-1/4 text-gray-800 max-w-lg p-4 bg-green-100 flex flex-col items-center rounded-3xl">
                        <div className='flex m-4 w-1/2'>
                            <PdfSVG height="100%" color="#cc1510" className='bg-white py-1 rounded-md mb-2 mr-4' />
                            <DocxSVG height="100%" color="#0167b3" className='bg-white py-1 rounded-md mb-2' />
                        </div>
                        <div className="text-center text-2xl font-bold mb-4">Classroom Ready</div>
                        <div className="text-left text-lg">Export your session quiz or worksheet in a format you can edit and print.</div>
                    </div>
                </div>
            </section>
            <section className="py-10 h-full bg-pink-100 justify-center text-gray-700 flex flex-col md:flex-row items-center">
                <div className='w-full md:w-1/2 text-2xl md:text-5xl flex flex-col items-center md:ms-4'>
                    <h1 className="font-bold mb-4">22,000+ Problems</h1>
                    <p className="text-center text-lg">High quality problems sourced directly from math textbooks you can trust.</p>
                </div>
                <div className='w-full md:w-1/2 flex flex-col py-4'>
                    <div className='w-3/4 mx-auto flex flex-row mb-4 bg-gray-900 p-2'>
                        <div className='w-full rounded-xl'>
                            <img className='w-full' src="images/chunkcomponent.png" alt="Math problem component with latex" />
                        </div>
                    </div>
                </div>
            </section>
            <section className="flex flex-col items-center text-gray-700 bg-blue-100 py-10">
                <div className="text-center mb-4">
                    <h1 className="font-bold text-2xl md:text-5xl mb-4">Customized Classroom Materials</h1>
                    <p className="text-lg md:text-xl">Created by you in seconds.</p>
                </div>

                {/* <div className="flex flex-wrap justify-center w-full h-1/2 space-x-10">
                    <Link to="/images/landing_page_worksheet_demo.jpg"
                        className="object-contain w-1/6 h-full max-h-1/2 border-2 border-gray-900"
                        target="_blank">
                        <img
                            src="/images/landing_page_worksheet_demo.jpg"
                            alt="Math Worksheet - Understanding Functions and Relations"
                        />
                    </Link>
                    <Link to="/images/landing_page_worksheet_demo2.jpg"
                        className="object-contain w-1/6 h-full max-h-1/2 border-2 border-gray-900"
                        target="_blank">
                        <img
                            src="/images/landing_page_worksheet_demo2.jpg"
                            alt="Math Worksheet - Understanding Functions and Relations"
                        />
                    </Link>
                    <Link to="/images/landing_page_worksheet_demo3.jpg"
                        className="object-contain w-1/6 h-full max-h-1/2 border-2 border-gray-900"
                        target="_blank">

                        <img
                            src="/images/landing_page_worksheet_demo3.jpg"
                            alt="Math Worksheet - Understanding Functions and Relations"
                        />
                    </Link>
                    <Link to="/images/landing_page_worksheet_demo4.jpg"
                        className="object-contain w-1/6 h-full max-h-1/2 border-2 border-gray-900"
                        target="_blank">

                        <img
                            src="/images/landing_page_worksheet_demo4.jpg"
                            alt="Math Worksheet - Understanding Functions and Relations"
                        />
                    </Link>
                </div> */}

                <div className="flex flex-wrap justify-center w-full h-1/2 space-x-10 pt-10">
                    <Link to="/images/landing_page_worksheet_demo.jpg"
                        className="object-contain w-1/3 h-full max-h-1/2 border-2 border-gray-900"
                        target="_blank">
                        <img
                            src="/images/landing_page_worksheet_demo.jpg"
                            alt="Math Worksheet - Understanding Functions and Relations"
                        />
                    </Link>
                    <Link to="/images/landing_page_worksheet_demo2.jpg"
                        className="object-contain w-1/3 h-full max-h-1/2 border-2 border-gray-900"
                        target="_blank">
                        <img
                            src="/images/landing_page_worksheet_demo2.jpg"
                            alt="Math Worksheet - Understanding Functions and Relations"
                        />
                    </Link>
                </div>

                <div className="flex flex-wrap justify-center w-full h-1/2 space-x-10 pt-10">

                    <Link to="/images/landing_page_worksheet_demo3.jpg"
                        className="object-contain w-1/3 h-full max-h-1/2 border-2 border-gray-900"
                        target="_blank">

                        <img
                            src="/images/landing_page_worksheet_demo3.jpg"
                            alt="Math Worksheet - Understanding Functions and Relations"
                        />
                    </Link>
                    <Link to="/images/landing_page_worksheet_demo4.jpg"
                        className="object-contain w-1/3 h-full max-h-1/2 border-2 border-gray-900"
                        target="_blank">

                        <img
                            src="/images/landing_page_worksheet_demo4.jpg"
                            alt="Math Worksheet - Understanding Functions and Relations"
                        />
                    </Link>
                </div>


            </section>

            <section className="p-10 h-full flex items-center" style={{ backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                <div className="w-3/4 text-3xl">
                    <h1 className="font-bold" ><LoopingText variant='typed' textArray={['Innovative', 'Impactful', 'Customized']} /></h1><h1>Education</h1>
                    <h1 className="font-bold"></h1>
                    <p className="mt-4 text-lg">starts with you.</p>
                    <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden my-4 p-2">
                        {/* <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Can you help me write a quiz for grade 5 students on fraction multiplication?"
                            className="resize-none md:w-1/2 w-full bg-gray-100 text-lg rounded leading-tight p-2 flex-1 border-green-700 border"
                            style={{
                                boxShadow: '0 0 5px rgba(81, 203, 238, 0.5)',
                            }}
                        /> */}
                        <button
                            type="submit"
                            className="md:w-1/3 w-2/3 btn btn-primary items-center justify-center overflow-hidden flex-wrap"
                            style={{
                                boxShadow: '0 0 5px rgba(81, 203, 238, 0.5)',
                            }}
                        >
                            Chat
                            <ArrowRightMore className="ml-2" />
                        </button>
                    </form>
                </div>
                <img className="w-1/4 h-auto" src="/png/teacher2.png" alt="Teacher illustration with stack of books" />
            </section>
        </div >
    );
};

export default LandingPage;

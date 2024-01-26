import { useClerk } from '@clerk/clerk-react';
import CheckmarkIcon from '../svg/CheckmarkIcon';
import { SubscribePaidButton } from './SubscribeButton';

const Pricing = () => {

    const { session } = useClerk();

    return (
        <div className='text-white text-l'>
            <section id="pricing">
                <div className='flex flex-col md:flex-row justify-between'>

                    <div className="tier w-full md:w-1/3 p-6 rounded-md shadow-lg bg-gray-800 border border-gray-700 my-4 md:mx-4">
                        <h2 className='text-2xl font-semibold mb-1 text-center'>Free Tier</h2>
                        <p className='my-4 text-left'>For teachers testing out Gyosu.</p>
                        {/* <h3 className='text-left'>Free</h3> */}
                        {/* {!session && <SubscribeFreeButton className="btn w-1/3 text-white font-bold min-w-fit rounded-md border border-blue-500 shadow-sm p-4 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 cursor-pointer" />}
                        {session && <SubscribeFreeButton className="w-1/3 text-white font-bold min-w-fit rounded-md shadow-sm p-4 bg-gray-600" />} */}
                        <br></br>
                        <div className='mb-2' />
                        <hr></hr>
                        {/* <p className='my-4 text-left'>Plan includes:</p> */}
                        <ul className='list-decimal-none list-inside text-left space-y-4 mt-4 flex flex-col'>
                            <li className="flex flex-row"><CheckmarkIcon /> GyosuChat Assistant</li>
                            <li className="flex flex-row"><CheckmarkIcon /> 25 message limit per day </li>
                            <li className="flex flex-row"><CheckmarkIcon /> Full access to problem database</li>
                            <li className="flex flex-row"><CheckmarkIcon /> Limited access to additional features</li>
                        </ul>
                    </div>

                    <div className="tier w-full md:w-1/3 p-6 rounded-md shadow-lg bg-gray-800 border border-gray-700 my-4 md:mx-4">
                        <h2 className='text-2xl font-semibold mb-1 text-center'>Paid Tier - $10/Month</h2>
                        <p className='my-4 text-left'>For innovative teachers using Gyosu regularly.</p>
                        {/* <h3 className='text-left'>$10/Month</h3> */}
                        <hr></hr>
                        {/* <p className='my-4 text-left'>Plan includes:</p> */}
                        <ul className='list-decimal-none list-inside text-left space-y-4 mt-4 flex flex-col'>
                            <li className="flex flex-row"><CheckmarkIcon /> GyosuChat Assistant</li>
                            <li className="flex flex-row"><CheckmarkIcon /> 200 message limit per day. </li>
                            <li className="flex flex-row"><CheckmarkIcon />Full access to problem database</li>
                            <li className="flex flex-row"><CheckmarkIcon />Early Access to additional features</li>
                        </ul>
                        <br></br>
                        <SubscribePaidButton className="btn w-1/3 text-white font-bold min-w-fit rounded-md border border-blue-500 shadow-sm p-4 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 cursor-pointer" />
                    </div>

                    <div className="tier w-full md:w-1/3 p-6 rounded-md shadow-lg bg-gray-800 border border-gray-700 my-4 md:mx-4">
                        <h2 className='text-2xl font-semibold mb-1 text-center'>Custom School Package</h2>
                        <p className='my-4 text-left'>For Schools with advanced educational needs.</p>
                        {/* <SubscribePremiumButton className="btn w-1/3 text-white font-bold min-w-fit rounded-md border border-blue-500 shadow-sm py-4 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 cursor-pointer" /> */}
                        <hr></hr>
                        {/* <p className='my-4 text-left'>Plan includes:</p> */}
                        <ul className='list-decimal-none list-inside text-left space-y-4 mt-4 flex flex-col'>
                            <li className="flex flex-row"><CheckmarkIcon />Customized GyosuChat - Fine Tuned for your school.</li>
                            <li className="flex flex-row"><CheckmarkIcon />Customized Curriculum - Just for your students.</li>
                            <li className="flex flex-row"><CheckmarkIcon />Discounted licenses for all teachers.</li>
                            <li className="flex flex-row"><CheckmarkIcon />Prioritized Support.</li>
                        </ul>
                        <br></br>
                        <br></br>
                        <h3 className='text-left'>Custom Pricing - <a href="mailto:support@gyosu.ai" className="text-blue-300 underline">Contact Us</a></h3>
                    </div>

                </div>
            </section >
        </div >
    );
};

export default Pricing;

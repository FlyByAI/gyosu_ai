import CheckmarkIcon from '../svg/CheckmarkIcon';
import { SubscribePaidButton } from './SubscribeButton';

const Pricing = () => {

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
                            <li className="flex flex-row"><div className="w-6 h-6 flex items-center justify-center"><CheckmarkIcon /></div><div className="ml-2"> GyosuChat Assistant</div></li>
                            <li className="flex flex-row"><div className="w-6 h-6 flex items-center justify-center"><CheckmarkIcon /></div><div className="ml-2"> 10 message limit per week</div></li>
                            <li className="flex flex-row"><div className="w-6 h-6 flex items-center justify-center"><CheckmarkIcon /></div><div className="ml-2"> Full access to problem database</div></li>
                        </ul>
                    </div>

                    <div className="tier w-full md:w-1/3 p-6 rounded-md shadow-lg bg-gray-800 border border-gray-700 my-4 md:mx-4">
                        <h2 className='text-2xl font-semibold mb-1 text-center'>Paid Tier - $10/Month</h2>
                        <p className='my-4 text-left'>For innovative teachers using Gyosu regularly.</p>
                        {/* <h3 className='text-left'>$10/Month</h3> */}
                        <hr></hr>
                        {/* <p className='my-4 text-left'>Plan includes:</p> */}
                        <ul className='list-decimal-none list-inside text-left space-y-4 mt-4 flex flex-col'>
                            <li className="flex flex-row"><div className="w-6 h-6 flex items-center justify-center"><CheckmarkIcon /></div><div className="ml-2"> GyosuChat Assistant</div></li>
                            <li className="flex flex-row"><div className="w-6 h-6 flex items-center justify-center"><CheckmarkIcon /></div><div className="ml-2"> 100 message limit per day </div></li>
                            <li className="flex flex-row"><div className="w-6 h-6 flex items-center justify-center"><CheckmarkIcon /></div><div className="ml-2">Full access to problem database</div></li>
                            <li className="flex flex-row"><div className="w-6 h-6 flex items-center justify-center"><CheckmarkIcon /></div><div className="ml-2">Save Documents to profile</div></li>
                            <li className="flex flex-row"><div className="w-6 h-6 flex items-center justify-center"><CheckmarkIcon /></div><div className="ml-2">Community Document Library - Coming Soon!</div></li>
                            <li className="flex flex-row"><div className="w-6 h-6 flex items-center justify-center"><CheckmarkIcon /></div><div className="ml-2">Custom Document Templates - Coming Soon!</div></li>
                        </ul>
                        <br></br>
                        <div className='flex flex-col space-y-4 pb-4'>
                            <div>Use code <b>GYOSU50</b> to get 50% off monthly rate. </div>
                            <div>Cancel anytime.</div>
                        </div>
                        <SubscribePaidButton className="btn w-1/3 text-white font-bold min-w-fit rounded-md border border-blue-500 shadow-sm p-4 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 cursor-pointer" />
                    </div>

                    <div className="tier w-full md:w-1/3 p-6 rounded-md shadow-lg bg-gray-800 border border-gray-700 my-4 md:mx-4">
                        <h2 className='text-2xl font-semibold mb-1 text-center'>Custom School Package</h2>
                        <p className='my-4 text-left'>For Schools with advanced educational needs.</p>
                        {/* <SubscribePremiumButton className="btn w-1/3 text-white font-bold min-w-fit rounded-md border border-blue-500 shadow-sm py-4 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 cursor-pointer" /> */}
                        <hr></hr>
                        {/* <p className='my-4 text-left'>Plan includes:</p> */}
                        <ul className='list-decimal-none list-inside text-left space-y-4 mt-4 flex flex-col'>
                            <li className="flex flex-row"><div className="w-6 h-6 flex items-center justify-center"><CheckmarkIcon /></div><div className="ml-2">Customized GyosuChat - Fine Tuned for your school.</div></li>
                            <li className="flex flex-row"><div className="w-6 h-6 flex items-center justify-center"><CheckmarkIcon /></div><div className="ml-2">Customized Curriculum - Just for your students.</div></li>
                            <li className="flex flex-row"><div className="w-6 h-6 flex items-center justify-center"><CheckmarkIcon /></div><div className="ml-2">Discounted licenses for all teachers.</div></li>
                            <li className="flex flex-row"><div className="w-6 h-6 flex items-center justify-center"><CheckmarkIcon /></div><div className="ml-2 w-full mr-auto">Prioritized Support.</div></li>
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

import React, { useEffect } from 'react';
import { SubscribeLiteButton, SubscribePremiumButton, SubscribeFreeButton } from './SubscribeButton';
import useFetchSubscriptionInfo from '../hooks/subscription/useFetchSubscriptionInfo';
import TrialButton from './TrialButton';
import FreeTierButton from './FreeTierButton';
import { useClerk } from '@clerk/clerk-react';
import CheckmarkIcon from '../svg/CheckmarkIcon';

const Subscribe = () => {

    const { session } = useClerk();

    return (
        <div className='text-white text-l'>
            <section id="pricing">
                <div className='flex flex-row justify-between'>

                    {/* Card Container */}
                    <div className="tier w-1/3 p-6 rounded-md shadow-lg bg-gray-800 border border-gray-700 mr-4">
                        <h2 className='text-2xl font-semibold mb-1 text-center'>Free</h2>
                        <p className='my-4 text-left'>For educators with minimal document creation needs.</p>
                        <h3 className='text-left'>Free</h3>
                        <br></br>
                        {!session && <SubscribeFreeButton className="btn w-1/3 text-white font-bold min-w-fit rounded-md border border-blue-500 shadow-sm p-4 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 cursor-pointer" />}
                        {session && <SubscribeFreeButton className="w-1/3 text-white font-bold min-w-fit rounded-md shadow-sm p-4 bg-gray-600" />}
                        <br></br>
                        <br></br>
                        <br></br>
                        <div className='mb-2' />
                        <hr></hr>
                        {/* Features List */}
                        <p className='my-4 text-left'>Plan includes:</p>
                        <ul className='list-decimal-none list-inside text-left space-y-4 mt-4 flex flex-col'>
                            <li className="flex flex-row"><CheckmarkIcon />Full access to problem database</li>
                            <li className="flex flex-row"><CheckmarkIcon />Create up to 20 AI generated documents per month</li>
                            <li className="flex flex-row"><CheckmarkIcon />50 custom AI problems per month</li>
                            <li className="flex flex-row"><CheckmarkIcon />Limited access to additional features</li>
                        </ul>
                    </div>

                    {/* Educator Tier Card */}
                    <div className="tier w-1/3 p-6 rounded-md shadow-lg bg-gray-800 border border-gray-700 mx-2">
                        <h2 className='text-2xl font-semibold mb-1 text-center'>Educator</h2>
                        <p className='my-4 text-left'>For teachers with normal class needs.</p>
                        <h3 className='text-left'>$5/Month</h3>
                        <br></br>
                        <SubscribeLiteButton className="btn w-1/3 text-white font-bold min-w-fit rounded-md border border-blue-500 shadow-sm p-4 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 cursor-pointer" />
                        <br></br>
                        <hr></hr>
                        <p className='my-4 text-left'>Plan includes:</p>
                        <ul className='list-decimal-none list-inside text-left space-y-4 mt-4 flex flex-col'>
                            <li className="flex flex-row"><CheckmarkIcon />Full access to problem database</li>
                            <li className="flex flex-row"><CheckmarkIcon />100 AI generated documents per month</li>
                            <li className="flex flex-row"><CheckmarkIcon />500 custom AI problems per month</li>
                        </ul>
                    </div>

                    {/* Premium Tier Card */}
                    <div className="tier w-1/3 p-6 rounded-md shadow-lg bg-gray-800 border border-gray-700 ml-4">
                        <h2 className='text-2xl font-semibold mb-1 text-center'>School</h2>
                        <p className='my-4 text-left'>For Schools with advanced educational needs.</p>
                        <h3 className='text-left'>$9/Month</h3>
                        <br></br>
                        <SubscribePremiumButton className="btn w-1/3 text-white font-bold min-w-fit rounded-md border border-blue-500 shadow-sm py-4 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 cursor-pointer" />
                        <br></br>
                        <hr></hr>
                        <p className='my-4 text-left'>Plan includes:</p>
                        <ul className='list-decimal-none list-inside text-left space-y-4 mt-4 flex flex-col'>
                            <li className="flex flex-row"><CheckmarkIcon />Full access to problem database</li>
                            <li className="flex flex-row"><CheckmarkIcon />500 AI generated documents per month</li>
                            <li className="flex flex-row"><CheckmarkIcon />1000 problem generations per month</li>
                        </ul>
                    </div>

                </div>
            </section >
        </div >
    );
};

export default Subscribe;

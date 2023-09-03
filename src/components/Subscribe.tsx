import React from 'react';
import { SubscribeLiteButton, SubscribePremiumButton } from './SubscribeButton';
import useFetchSubscriptionInfo from '../hooks/subscription/useFetchSubscriptionInfo';
import { notSecretConstants } from '../constants/notSecretConstants';
import TrialButton from './TrialButton';
import FreeTierButton from './FreeTierButton';

const Subscribe = () => {


    return (
        <div className='text-white text-l'>
            <section id="pricing">
                <div className='flex flex-row justify-between'>
                    <div className="tier w-1/3  p-6 rounded-md">
                        <h2 className='text-2xl font-semibold mb-1 text-left'>🌟 Free</h2>
                        <hr />
                        <p className='my-4 text-left'>Try creating documents</p>
                        <ul className='list-decimal-none list-inside text-left space-y-4'>
                            <li>• Generate problem banks for class</li>
                            <li>• Create up to 10 documents</li>
                        </ul>
                    </div>

                    <div className="tier w-1/3  p-6 rounded-md">
                        <h2 className='text-2xl font-semibold mb-1 text-left'>🚀 Lite $12.99 / month</h2>
                        <hr />
                        <p className='my-4 text-left'>For active educators</p>
                        <ul className='list-decimal-none list-inside text-left space-y-4'>
                            <li>• Higher generation limits</li>
                            <li>• Answer keys & advanced exports</li>
                        </ul>
                    </div>

                    <div className="tier w-1/3  p-6 rounded-md">
                        <h2 className='text-2xl font-semibold mb-1 text-left'>💎 Premium $29.99 / month</h2>
                        <hr />
                        <p className='my-4 text-left'>Unlock full potential.</p>
                        <ul className='list-decimal-none list-inside text-left space-y-4'>
                            <li>• Unlimited access & generations</li>
                            <li>• Exclusive features & analytics</li>
                        </ul>
                    </div>

                </div>
                <div className="actions flex flex-row justify-center my-4">
                    <FreeTierButton className="btn w-1/3 text-white font-bold inline-flex justify-center rounded-md border border-blue-500 shadow-sm p-4 mx-16 bg-gradient-to-r from-blue-600 to-green-500" />
                    <SubscribeLiteButton className="btn w-1/3 text-white font-bold inline-flex justify-center rounded-md border border-blue-500 shadow-sm p-4 mx-16 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 cursor-pointer" />
                    <SubscribePremiumButton className="btn w-1/3 text-white font-bold inline-flex justify-center rounded-md border border-blue-500 shadow-sm p-4 mx-16 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600  cursor-pointer" />
                </div>
            </section >
        </div >
    );
};

export default Subscribe;

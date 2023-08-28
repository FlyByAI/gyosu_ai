import React from 'react';
import { SubscribeLiteButton, SubscribePremiumButton } from './SubscribeButton';

const Subscribe = () => {
    return (
        <div className='text-white text-l bg-gray-900 p-8'>
            <section id="pricing">
                <h1 className='text-4xl mb-6 font-semibold text-center'>Choose Your Perfect Plan</h1>
                <p className='text-lg mb-12 text-center'>At <strong className='font-semibold'>Gyosu</strong>, we understand that every educator's needs are unique. That's why we've crafted three distinct packages, ensuring there's a fit for everyone.</p>
                <div className='flex flex-row justify-between'>
                    <div className="tier w-1/3 bg-gray-800 p-6 rounded-md">
                        <h2 className='text-2xl font-semibold mb-4 text-left'>🌟 Free Tier</h2>
                        <p className='mb-4 text-left'><em className='italic'>Perfect for:</em> Teachers just starting out or those needing occasional resources.</p>
                        <ul className='list-decimal-none list-inside text-left space-y-4'>
                            <li>Generate math problems at a comfortable pace.</li>
                            <li>Create worksheets on-the-fly.</li>
                            <li>Try out our chat feature for any math-related queries.</li>
                        </ul>
                    </div>

                    <div className="tier w-1/3 bg-gray-800 p-6 rounded-md">
                        <h2 className='text-2xl font-semibold mb-4 text-left'>🚀 Lite Tier - $12.99/month</h2>
                        <p className='mb-4 text-left'><em className='italic'>Perfect for:</em> Active educators, larger classes, and regular assignments.</p>
                        <ul className='list-decimal-none list-inside text-left space-y-4'>
                            <li>Amped up generation limits for every feature.</li>
                            <li>Unlock answer views and enhanced document exports.</li>
                            <li>Delve deeper with our expanded chat limits.</li>
                        </ul>
                    </div>

                    <div className="tier w-1/3 bg-gray-800 p-6 rounded-md">
                        <h2 className='text-2xl font-semibold mb-4 text-left'>💎 Premium Tier - $29.99/month</h2>
                        <p className='mb-4 text-left'><em className='italic'>Perfect for:</em> The dedicated educator looking for the best.</p>
                        <ul className='list-decimal-none list-inside text-left space-y-4'>
                            <li>Enjoy unlimited access to problem generations, rerolls, answer views, and exports.</li>
                            <li>Get hands-on with exclusive features and advanced analytics.</li>
                            <li>Collaborate with peers using our special collaborative tools.</li>
                            <li>Access premium teaching content.</li>
                            <li>Receive priority support and enjoy partner discounts.</li>
                        </ul>
                    </div>
                </div>
                <p className='text-lg mt-12 text-center'>Join our community of educators who are revolutionizing teaching.</p>
                <p className='text-lg mb-8 text-center'>Choose a plan, grow with us, and let's make education brighter and smarter together.</p>

                <div className="actions flex flex-row justify-center my-8">
                    <button className="btn w-1/6 text-white font-bold inline-flex justify-center rounded-md border border-transparent shadow-sm p-4 mx-2 bg-gray-600 hover:bg-gray-700">Start for Free</button>
                    <SubscribeLiteButton className="btn w-1/6 text-white font-bold inline-flex justify-center rounded-md border border-transparent shadow-sm p-4 mx-2 bg-blue-600 hover:bg-blue-700" />
                    <SubscribePremiumButton className="btn w-1/6 text-white font-bold inline-flex justify-center rounded-md border border-transparent shadow-sm p-4 mx-2 bg-green-600 hover:bg-green-700" />
                </div>

                <h2 className='text-2xl font-semibold mb-4'>Pricing &amp; Rate Limits</h2>
                <table className='min-w-full bg-white text-black rounded-md overflow-hidden'>
                    <thead>
                        <tr className='bg-gray-300'>
                            <th className='px-4 py-2'>Feature</th>
                            <th className='px-4 py-2'>🌟 <strong className='font-semibold'>Free</strong></th>
                            <th className='px-4 py-2'>🚀 <strong className='font-semibold'>Lite ($12.99/month)</strong></th>
                            <th className='px-4 py-2'>💎 <strong className='font-semibold'>Premium ($29.99/month)</strong></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>GenerateMathProblemView</strong></td>
                            <td>10/h</td>
                            <td>50/h</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr>
                            <td><strong>MathProblemChat</strong></td>
                            <td>3.33/h</td>
                            <td>40/h</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr>
                            <td><strong>RerollMathProblem</strong></td>
                            <td>10/h</td>
                            <td>40/h</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr>
                            <td><strong>AnswerKeyView</strong></td>
                            <td>❌</td>
                            <td>20/h</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr>
                            <td><strong>WorksheetCreateView</strong></td>
                            <td>3.33/h</td>
                            <td>20/d</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr>
                            <td><strong>GuidedNotesView</strong></td>
                            <td>3.33/h (grouped with worksheets)</td>
                            <td>20/h</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr>
                            <td><strong>ExportPDFWorksheetsView</strong></td>
                            <td>1/h (grouped with docs)</td>
                            <td>15/h</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr>
                            <td><strong>ExportDocsWorksheetsView</strong></td>
                            <td>❌</td>
                            <td>15/h</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr>
                            <td><strong>Community Access</strong></td>
                            <td>❌</td>
                            <td>Yes</td>
                            <td>Yes</td>
                        </tr>
                        <tr>
                            <td><strong>Collaborative Features</strong></td>
                            <td>❌</td>
                            <td>Yes</td>
                            <td>Yes</td>
                        </tr>
                        <tr>
                            <td>Advanced analytics, unique problem types</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><strong>Premium Support</strong></td>
                            <td>❌</td>
                            <td>Yes</td>
                            <td>Yes</td>
                        </tr>
                        <tr>
                            <td><strong>Bulk Export &amp; Import</strong></td>
                            <td>❌</td>
                            <td>❌</td>
                            <td>Yes</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default Subscribe;

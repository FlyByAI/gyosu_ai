import CheckmarkIcon from '../svg/CheckmarkIcon';
import ManageSubscriptionButton from './ManageSubscriptionButton';
import { SubscribePaidButton } from './SubscribeButton';

const Pricing = () => {

    return (
        <section id="pricing" className="max-w-7xl mx-auto text-center">
            <div className='grid md:grid-cols-3 w-full'>
                {/* Free Tier */}
                <div className="card bg-secondary-content shadow-none p-6 me-2">
                    <div className="card-body text-left">
                        <h2 className="card-title text-center">Free Trial</h2>
                        <div className="list-inside space-y-2 mt-4">
                            <p>For teachers testing out Gyosu.</p>
                            <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>GyosuChat Assistant</div></div>
                            <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>10 message limit per week</div></div>
                            <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>3 document exports</div></div>
                            <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>Limited access to search problems</div></div>
                            <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>Problem creation trial</div></div>
                        </div>
                    </div>

                </div>

                {/* Paid Tier */}
                <div className="card bg-base-200 shadow-xl p-6 mx-2">
                    <div className="card-body text-left">
                        <h2 className="card-title text-center">Paid Tier - $10/Month</h2>
                        <div className="list-inside space-y-2 my-4">
                            <p className='font-bold'>Please consider supporting us so we can do this full time!</p>
                            <div className='my-2 py-2 rounded-xl font-bold bg-blue-200'>
                                <p className='text-center mx-auto'>Current subscriber goal: 4/100</p>
                            </div>
                            <p className='mb-4 italic'>*If we reach our subcriber goal we will shave our heads</p>
                            <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>GyosuChat Assistant</div></div>
                            <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>100 chat message limit per day</div></div>
                            <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>50 document exports per week</div></div>
                            <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>200 problem creations per week</div></div>
                            <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>Full access to search database of 50,000 problems</div></div>
                            <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>Save Documents to profile</div></div>
                            <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>Custom Document Templates - Coming Soon!</div></div>
                        </div>
                        <div className="flex flex-col space-y-2 mt-4">
                            <p>Use code <b>GYOSU50</b> to get 50% off monthly rate.</p>
                            <p>Cancel anytime.</p>
                        </div>
                        <SubscribePaidButton />
                        <ManageSubscriptionButton />
                    </div>
                </div>

                {/* Custom School Package */}
                <div className="card bg-base-200 shadow-xl p-6 ms-2">
                    <div className="card-body text-left">
                        <h2 className="card-title text-center">Custom School Package</h2>
                        <div className="list-inside space-y-2 mt-4">
                            <p>For Schools with advanced educational needs.</p>
                            <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>Customized GyosuChat - Fine Tuned for your school.</div></div>
                            <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>Customized Curriculum - Just for your students.</div></div>
                            <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>Discounted licenses for all teachers.</div></div>
                            <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>Prioritized Support.</div></div>
                        </div>
                        <button
                            onClick={() => window.location.href = 'mailto:support@gyosu.ai'}
                            className="btn btn-primary">
                            Contact Us
                        </button>
                    </div>
                </div>

            </div>
        </section>

    );
};

export default Pricing;

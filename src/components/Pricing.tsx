import CheckmarkIcon from '../svg/CheckmarkIcon';
import { SubscribePaidButton } from './SubscribeButton';

const Pricing = () => {

    return (
        <div className='text-base-content'>
            <section id="pricing" className="flex flex-col items-center w-full my-8 p-4">
                <div className='grid md:grid-cols-3 w-full'>

                    {/* Free Tier */}
                    <div className="card bg-base-200 shadow-xl p-6 mx-2">
                        <div className="card-body text-left">
                            <h2 className="card-title text-center">Free Tier</h2>
                            <div className="list-inside space-y-2 mt-4">
                                <p>For teachers testing out Gyosu.</p>
                                <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>GyosuChat Assistant</div></div>
                                <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>10 message limit per week</div></div>
                                <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>Full access to problem database</div></div>
                            </div>
                        </div>
                    </div>

                    {/* Paid Tier */}
                    <div className="card bg-base-200 shadow-xl p-6 mx-2">
                        <div className="card-body text-left">
                            <h2 className="card-title text-center">Paid Tier - $10/Month</h2>
                            <div className="list-inside space-y-2 mt-4">
                                <p>For innovative teachers using Gyosu regularly.</p>
                                <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>GyosuChat Assistant</div></div>
                                <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>100 message limit per day</div></div>
                                <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>Full access to problem database</div></div>
                                <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>Save Documents to profile</div></div>
                                <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>Community Document Library - Coming Soon!</div></div>
                                <div className="w-full flex items-center pr-2"><div><CheckmarkIcon /></div><div>Custom Document Templates - Coming Soon!</div></div>
                            </div>
                            <div className="flex flex-col space-y-2 mt-4">
                                <p>Use code <b>GYOSU50</b> to get 50% off monthly rate.</p>
                                <p>Cancel anytime.</p>
                            </div>
                            <SubscribePaidButton />
                        </div>
                    </div>

                    {/* Custom School Package */}
                    <div className="card bg-base-200 shadow-xl p-6 mx-2">
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
        </div>


    );
};

export default Pricing;

import { useClerk } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import useEnvironment from '../../hooks/useEnvironment';
import useIpAddress from '../../hooks/useIpAddress';
import useSubmitSubscribe from '../../hooks/useSubscribe';


interface SubscribeFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SubscribeFormModal = ({ isOpen, onClose }: SubscribeFormModalProps) => {
    const { session } = useClerk();
    const { ipAddress } = useIpAddress();
    const [email, setEmail] = useState("");
    const { apiUrl } = useEnvironment();
    const { subscriptionData, submitSubscriptions } = useSubmitSubscribe(`${apiUrl}/subscriptions/subscribe`, email);
    const [newToolReleases, setNewToolReleases] = useState(subscriptionData?.newToolReleases || false);
    const [aiNewsletter, setAiNewsletter] = useState(subscriptionData?.aiNewsletter || false);
    const [blogPosts, setBlogPosts] = useState(subscriptionData?.blogPosts || false);
    const consentText = "By clicking \"Subscribe\", you are consenting to receive the selected emails. You can revoke this consent at any time."

    useEffect(() => {
        if (session?.user?.primaryEmailAddress?.emailAddress) {
            setEmail(session?.user?.primaryEmailAddress?.emailAddress)
            setNewToolReleases(subscriptionData?.newToolReleases || false)
            setAiNewsletter(subscriptionData?.aiNewsletter || false)
            setBlogPosts(subscriptionData?.blogPosts || false)
        }
    }, [email, session?.user?.primaryEmailAddress?.emailAddress, subscriptionData])


    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Your logic to handle form submission here
        submitSubscriptions({
            email,
            newToolReleases,
            aiNewsletter,
            blogPosts,
            consentGiven: true,
            consentTimestamp: new Date().toISOString(),
            consentText: consentText,
            consentIp: ipAddress,
        })
        onClose()
    }

    return isOpen ? (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-700"></div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full md:w-3/4 lg:w-2/3">
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="mb-4 text-center">
                        <h2 className="text-3xl font-bold dark:text-gray-300">Stay Updated</h2>
                        <p className="mt-4 text-xl dark:text-gray-300">Receive the latest emerging AI powered newsletters in your niche, directly to your inbox.</p>
                        <p className="mt-2 text-xl dark:text-gray-300">Select the email you’d like to receive and enter your email below to sign up.</p>
                    </div>
                    <form className="mt-4">
                        <input
                            id="newsletterEmail"
                            type="email"
                            className="mt-4 p-2 border rounded min-w-[200px] w-full md:w-2/3 lg:w-1/2 mx-auto"
                            placeholder="Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email" />
                        <div className="mt-4 grid gap-2 md:w-1/2 mx-auto">
                            <div className="flex flex-col space-y-4">
                                <label className="inline-flex items-center space-x-2">
                                    <input type="checkbox" className="hidden" checked={newToolReleases} onChange={(e) => setNewToolReleases(e.target.checked)} />
                                    <span className="w-6 h-6 inline-block rounded-md border-2 border-blue-500 relative">
                                        {newToolReleases && <span className="absolute inset-0 bg-blue-500 inline-block rounded-md"></span>}
                                    </span>
                                    <span className="text-lg text-gray-700 dark:text-gray-300">Notify me about new AI tool releases</span>
                                </label>
                                <label className="inline-flex items-center space-x-2">
                                    <input type="checkbox" className="hidden" checked={aiNewsletter} onChange={(e) => setAiNewsletter(e.target.checked)} />
                                    <span className="w-6 h-6 inline-block rounded-md border-2 border-blue-500 relative">
                                        {aiNewsletter && <span className="absolute inset-0 bg-blue-500 inline-block rounded-md"></span>}
                                    </span>
                                    <span className="text-lg text-gray-700 dark:text-gray-300">Subscribe me to the AI newsletter</span>
                                </label>
                                <label className="inline-flex items-center space-x-2">
                                    <input type="checkbox" className="hidden" checked={blogPosts} onChange={(e) => setBlogPosts(e.target.checked)} />
                                    <span className="w-6 h-6 inline-block rounded-md border-2 border-blue-500 relative">
                                        {blogPosts && <span className="absolute inset-0 bg-blue-500 inline-block rounded-md"></span>}
                                    </span>
                                    <span className="text-lg text-gray-700 dark:text-gray-300">Send me updates about blog posts</span>
                                </label>
                            </div>

                        </div>

                        <p className="mt-2 text-sm text-gray-500 text-center">{consentText}</p>
                    </form>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse items-center justify-center">
                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-gray-300 hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleSubmit}>
                        Subscribe
                    </button>
                    <button onClick={onClose} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    ) : null;
}

export default SubscribeFormModal;

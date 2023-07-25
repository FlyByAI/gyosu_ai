import { useState } from "react";
import { useAITools } from "../hooks/tools/useAITools";
import { Link } from "react-router-dom";
import { IPost, ITool } from "../interfaces";
import { useRecentPost } from "../hooks/blog/useRecentPost";
import SubscribeFormModal from "../components/forms/SubscribeFormModal";

export default function Home() {

    const blogPosts: IPost[] = useRecentPost();
    const tools: ITool[] = useAITools();

    const [showAllTools, setShowAllTools] = useState(false);
    const [showAllPosts, setShowAllPosts] = useState(false);

    const [showButton, setShowButton] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const displayedTools = showAllTools ? tools : tools.slice(0, 3);

    return (
        <>
            <div className="">
                {/* Hero Section */}
                <div className="text-center py-12 dark:bg-gray-900">
                    <h1 className="text-4xl font-bold dark:text-white">AI powered blogs for everyday people.</h1>
                    <p className="mt-4 text-xl dark:text-gray-300">Our website offers AI tools, an AI newsletter, and AI blog about a variety of specialized topics.</p>
                    <button
                        className="mt-4 px-4 py-2 text-white bg-yellow-500 rounded"
                        onClick={openModal}
                    >
                        Subscribe
                    </button>
                    <SubscribeFormModal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                    />
                </div>

                {/* Blog Posts Section */}
                <div className="grid grid-cols-3 gap-4 bg-green-100 p-8 rounded dark:bg-gray-800">
                    <h2 className="text-3xl font-bold col-span-full dark:text-white">Recent Blog Posts</h2>
                    {(showAllPosts ? blogPosts : blogPosts.slice(0, 3)).map((post, index) => (
                        <div key={index} className="p-4 border rounded">
                            <h3 className="text-2xl font-bold dark:text-white">{post.title}</h3>
                            <p className="mt-2 text-left dark:text-white">{post.body?.substring(0, 115) + "..."}</p>
                            <Link to={`/post/${post.id}`}>
                                <button className="mt-4 px-4 py-2 text-white bg-green-500 rounded">Read More</button>
                            </Link>
                        </div>
                    ))}

                    {!showAllPosts && (
                        <button className="mt-4 px-4 py-2 text-white bg-green-500 rounded col-span-full" onClick={() => setShowAllPosts(true)}>
                            Show More
                        </button>
                    )}
                </div>

                {/* AI Tools Section */}
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-blue-100 p-8 rounded dark:bg-gray-800">
                    <h2 className="text-3xl font-bold col-span-full dark:text-white">Our Custom AI enhanced Tools</h2>
                    {displayedTools.map((tool, index) => (
                        <div
                            key={tool.id}
                            className="relative p-4 border rounded"
                            onMouseEnter={() => setShowButton(index)}
                            onMouseLeave={() => setShowButton(null)}
                        >
                            <img className="w-1/2 mx-auto" src={tool.imageUrl} alt={tool.title} />
                            <h3 className="text-2xl font-bold dark:text-white">{tool.title}</h3>
                            <p className="mt-2 dark:text-white">{tool.description}</p>
                            {tool.linkUrl ?
                                <Link
                                    to={tool.linkUrl}
                                    className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
                                >
                                    Try now!
                                </Link>
                                :
                                <button className="mt-4 px-4 py-2 bg-gray-300 text-gray-500 cursor-not-allowed" disabled>Not yet available</button>
                            }
                        </div>
                    ))}
                    {!showAllTools && (
                        <button className="mt-4 px-4 py-2 text-white bg-blue-500 rounded col-span-full" onClick={() => setShowAllTools(true)}>
                            Show More
                        </button>
                    )}
                </div>

                {/* About Section */}
                <div className="py-12 dark:text-white">
                    <h2 className="text-3xl font-bold">About Us</h2>
                    <p className="mt-4 dark:text-white">
                        If you're a business professional seeking to ramp up productivity, or a hobbyist looking for cool AI stuff, or just a curious cat on the web, welcome!
                    </p>
                    <p className="mt-0 dark:text-white">
                        We're thrilled to have you here.
                    </p>
                </div>

            </div>
        </>
    );
};

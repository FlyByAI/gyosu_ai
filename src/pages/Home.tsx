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
                    <h1 className="text-4xl font-bold dark:text-white">Gyosu AI Beta Release</h1>
                    <p className="mt-4 text-xl dark:text-gray-300">Use AI to help create a better learning experience.</p>
                    {/* <button
                        className="mt-4 px-4 py-2 text-white bg-yellow-500 rounded"
                        onClick={openModal}
                    >
                        Subscribe
                    </button>
                    <SubscribeFormModal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                    /> */}
                </div>

                {/* Blog Posts Section */}
                {blogPosts.length > 0 && <div className="grid grid-cols-3 gap-4 bg-green-100 p-8 rounded dark:bg-gray-800">
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
                </div>}



                {/* About Section */}
                <div className="py-12 dark:text-white">
                    <h2 className="text-3xl font-bold">About Us</h2>
                    <p className="mt-4 dark:text-white">
                        Gyosu is a platform built to empower teachers to make learning more customizable, fun, and engaging.
                    </p>
                    <p className="mt-0 dark:text-white">
                        We're thrilled to have you here.
                    </p>
                </div>

            </div>
        </>
    );
};

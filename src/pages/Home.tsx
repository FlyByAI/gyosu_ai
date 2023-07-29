import { useState } from "react";
import { useAITools } from "../hooks/tools/useAITools";
import { Link } from "react-router-dom";
import { IPost, ITool } from "../interfaces";
import { useRecentPost } from "../hooks/blog/useRecentPost";
import SubscribeFormModal from "../components/forms/SubscribeFormModal";
import { useDarkMode } from "../hooks/useDarkMode";



const Home = () => {

    const blogPosts: IPost[] = useRecentPost();

    const [showAllPosts, setShowAllPosts] = useState(false);

    const { darkMode, SunIcon, MoonIcon, setDarkMode } = useDarkMode()

    return (
        <div>
            {/* Hero Section */}
            {darkMode &&
                <div
                    className="bg-center bg-fit h-screen flex flex-col justify-center items-center rounded-3xl mb-8"
                    style={{
                        backgroundImage: `url("../../images/shownaldo_A_minimalistic__simple_logo_black_and_white_line_art__8881a185-cbdc-4310-a557-147335e0c85a.png")`
                    }}
                >
                    <div className="text-center bg-black bg-opacity-90 backdrop-filter rounded-2xl">
                        <div className="p-4 inline-block border-spacing-1 border-4 rounded-2xl border-blue-600">
                            <h1 className="text-4xl m-0 font-bold dark:text-white font-mono">Gyosu.ai</h1>
                            <p className="mt-4 text-3xl dark:text-blue-400 italic font-bold ">Beta Release</p>
                            <Link to="/math-app">
                                <button className="text-xl mt-4 px-8 py-4 text-white bg-purple-700 hover:bg-purple-800 font-mono font-bold rounded-xl">
                                    Generate Math Worksheets
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>}
            {darkMode === false &&
                <div
                    className="bg-center bg-fit h-screen flex flex-col justify-center items-center  mb-8"
                    style={{
                        backgroundImage: `url("../../images/shownaldo_A_minimalistic__simple_logo_showing_an_open_book_with_21c010c6-e179-4ee7-8a82-cfde4c295a73.png")`
                    }}
                >
                    <div className="text-center py-4 bg-white bg-opacity-80 backdrop-filter rounded-2xl">
                        <div className=" p-5 inline-block">
                            <h1 className="text-4xl font-bold dark:text-white">Gyosu AI Beta Release</h1>
                            <p className="mt-4 text-xl dark:text-gray-300">Limited release for beta testers to get access to our math content here.</p>
                            <Link to="/math-app">
                                <button className="text-xl  mt-4 px-4 py-2 rounded bg-blue-300 ">
                                    Generate Math Worksheets
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            }





            {/* About Section */}
            <div className="py-12 dark:text-white text-center dark:bg-gray-900">
                <h2 className="text-2xl font-bold">About Us</h2>
                <p className="mt-4 dark:text-white">
                    Gyosu is a platform built to empower teachers to make learning more customizable, accessible, and engaging.
                </p>
                <p className="mt-0 dark:text-white">
                    We're thrilled to have you here.
                </p>
            </div>

        </div>
    );
};
export default Home;
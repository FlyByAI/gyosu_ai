import { Link } from "react-router-dom";
import { useDarkMode } from "../hooks/useDarkMode";
import { useClerk } from "@clerk/clerk-react";



const Home = () => {


    const { darkMode } = useDarkMode()

    const { openSignIn, session } = useClerk();

    const buttonClasses = "glow text-l mt-4 px-8 py-4 text-gray-100 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 font-mono font-bold rounded"

    return (
        <div>
            <div className={"text-white text-bold text-2xl mb-4"}>
                Scroll down to see what's coming in Version 2!
            </div>
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
                            {session ? (
                                <Link to="/math-app">
                                    <button className={buttonClasses}>
                                        Generate Math Worksheets
                                    </button>
                                </Link>
                            ) : (
                                <button onClick={() => openSignIn()} className={buttonClasses}>
                                    Generate Math Worksheets
                                </button>
                            )}
                        </div>
                    </div>
                </div>}
            <div className={"text-white text-bold text-2xl mb-4"}>
                Version 2 is in development: Here's a quick preview of what's to come!
            </div>
            <div className={"bg-white rounded-xl p-2 mb-8"}>
                <p style={{ border: 0, width: "100%", marginBottom: 0, height: " 450px" }}>
                    <iframe
                        style={{ width: "100%", height: "100%", border: 0 }}
                        src="https://www.floik.com/embed/7d6e51c5-8700-44ed-b686-e5f224ad5142/890119d1-2588-44a2-906b-51b23af49743-flo.html"
                        width="100%"
                        height="450px"
                        allowfullscreen="allowfullscreen"
                        webkitallowfullscreen
                        mozallowfullscreen
                    >
                    </iframe>
                </p>
            </div>


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
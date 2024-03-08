import toast from "react-hot-toast";
import CopyIcon from "../svg/CopyIcon";

const ShareLinkModalContent = ({ link }: { link: string }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(link)
            .then(() => {
                toast('Link copied to clipboard')
            })
            .catch(err => {
                toast(`Error copying link.`);
                console.error('Error copying to clipboard:', err)
            });
    };

    return (
        <div>
            {/* Are there npm libraries for creating share links? */}
            {/* On mobile, it would be cool to share this via text, etc with one tap. */}
            <p className="py-2">Share link: </p>
            <p className="py-2">{link} </p>
            <button onClick={handleCopy} className="mt-2 px-4 py-2 rounded bg-blue-500 text-gray-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 inline-flex items-center">
                <CopyIcon />
                <span className="ml-2">Copy Link</span>
            </button>
        </div>
    );
};

export default ShareLinkModalContent
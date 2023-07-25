import { Rating } from "../interfaces";

export const ThumbsUpSvg = ({ rating }: { rating: Rating }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-800 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke={rating == "thumbsUp" ? "green" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
    </svg>
);

export const ThumbsDownSvg = ({ rating }: { rating: Rating }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-800 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke={rating == "thumbsDown" ? "red" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
    </svg>
);
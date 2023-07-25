import React from "react";
import { Link } from "react-router-dom";

interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl?: string;
}

const Card = ({ title, description, imageUrl, linkUrl }: CardProps) => (
  <div className="max-w-sm rounded overflow-hidden shadow-lg mt-4 bg-white dark:bg-gray-800">
    <img className="w-full" src={imageUrl} alt={title} />
    <div className="px-6 py-4">
      <div className="font-bold text-xl mb-2 text-gray-900 dark:text-white">{title}</div>
      <p className="text-gray-700 text-base dark:text-gray-300">{description}</p>
      {linkUrl && (
        <Link
          to={linkUrl}
          className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Try now!
        </Link>
      )}
    </div>
  </div>
);

export default Card;

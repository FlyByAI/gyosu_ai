import React from 'react';

export interface RestaurantResponseProps {
    restaurant: {
        name: string;
        contact: string;
        website: string;
        address: string;
        selectionReason: string;
    }
}

const RestaurantResponse: React.FC<RestaurantResponseProps> = ({ restaurant }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-sm">
            <h2 className="text-lg font-bold mb-2 dark:text-white">{restaurant.name}</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">{restaurant.address}</p>
            <p className="text-gray-700 dark:text-gray-300 mb-2">{restaurant.selectionReason}</p>
            <div className="flex justify-between">
                <a href={`tel:${restaurant.contact}`} className="bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600">Call: {restaurant.contact}</a>
                <a href={restaurant.website} target="_blank" rel="noreferrer" className="bg-green-500 text-white py-1 px-3 rounded text-sm hover:bg-green-600">Visit Website</a>
            </div>
        </div>
    );
}

export default RestaurantResponse;

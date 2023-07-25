import React from 'react';
import { useGeolocation } from '../hooks/useGeolocation';

const GeolocationButton = () => {
    const { latitude, longitude, error, getLocation } = useGeolocation();

    return (
        <button onClick={getLocation}>
            Get Location
        </button>
    );
};

export default GeolocationButton;

import { useState, useEffect } from 'react';
interface ILocation {
    latitude: number | null,
    longitude: number | null,
    error: any,
}
export const useGeolocation = () => {
    const [location, setLocation] = useState<ILocation>({
        latitude: null,
        longitude: null,
        error: null,
    });

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        error: null,
                    });
                },
                (error) => {
                    setLocation({
                        latitude: null,
                        longitude: null,
                        error: error.message,
                    });
                }
            );
        } else {
            setLocation({
                latitude: null,
                longitude: null,
                error: "Geolocation is not enabled in this browser.",
            });
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    return { ...location, getLocation };
};

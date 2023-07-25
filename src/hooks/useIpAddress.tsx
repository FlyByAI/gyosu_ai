import { useState, useEffect } from 'react';
import axios from 'axios';

const useIpAddress = () => {
    const [ipAddress, setIpAddress] = useState("");

    useEffect(() => {
        const getIpAddress = async () => {
            try {
                const res = await axios.get("https://api.ipify.org/?format=json");
                setIpAddress(res.data.ip);
            } catch (err) {
                console.error(err);
            }
        };

        getIpAddress();
    }, []);

    return { ipAddress };
};

export default useIpAddress;

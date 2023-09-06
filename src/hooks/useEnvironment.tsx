import { useEffect, useState } from "react";
import { notSecretConstants } from "../constants/notSecretConstants";

interface EnvironmentInfo {
    env: string;
    apiUrl: string;
}

const useEnvironment = (): EnvironmentInfo => {
    const [envInfo, setEnvInfo] = useState<EnvironmentInfo>({ env: "", apiUrl: "" });

    useEffect(() => {
        const url = window.location.href;
        let env = "";
        let apiUrl = "";

        switch (true) {
            case url.includes("https://test.gyosu.ai"):
                env = "test";
                apiUrl = notSecretConstants.testDjangoApi;
                break;
            case url.includes("https://gyosu.ai"):
                env = "production";
                apiUrl = notSecretConstants.djangoApi;
                break;
            default:
                env = "local";
                apiUrl = import.meta.env.VITE_API_URL || "";
        }

        setEnvInfo({ env, apiUrl });
    }, []);

    return envInfo;
};

export default useEnvironment;

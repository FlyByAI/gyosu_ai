import { useEffect, useState } from "react";
import { notSecretConstants } from "../constants/notSecretConstants";

interface EnvironmentInfo {
    env: string;
    apiUrl: string;
    mathAppApiUrl: string;
}

const useEnvironment = (): EnvironmentInfo => {
    const initialEnvInfo = (): EnvironmentInfo => {
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
                apiUrl = import.meta.env.VITE_API_URL || "https://localhost:8000";
        }
        const mathAppApiUrl = `${apiUrl}/math_app`;

        return { env, apiUrl, mathAppApiUrl };
    };

    const [envInfo, setEnvInfo] = useState<EnvironmentInfo>(initialEnvInfo);

    return envInfo;
};

export default useEnvironment;

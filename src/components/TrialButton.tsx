import React from 'react';

import useInitiateCheckout from '../hooks/subscription/useInitiateCheckout';
import { notSecretConstants } from '../constants/notSecretConstants';
import useFetchSubscriptionInfo from '../hooks/subscription/useFetchSubscriptionInfo';
import useActivateTrial from '../hooks/subscription/useActivateTrial';




const TrialButton = ({ className }: { className: string }) => {

    const { trialActivated, activateTrial } = useActivateTrial(`${window.location.href.includes("https://test.gyosu.ai")
        ? notSecretConstants.testDjangoApi
        : import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/stripe/activate-trial/`)
    const { subscriptionInfo, isLoading } = useFetchSubscriptionInfo(`${window.location.href.includes("https://test.gyosu.ai")
        ? notSecretConstants.testDjangoApi
        : import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/user_data/get_subscription_info/`)
    return (<>
        {!isLoading &&
            <div
                onClick={!subscriptionInfo?.active_trial || trialActivated ? activateTrial : () => console.log("Trial already activated")}
                className={className + ((trialActivated || subscriptionInfo?.active_trial) ? "" : " bg-orange-500 hover:bg-orange-600")}
            >
                {(trialActivated || subscriptionInfo?.active_trial) ? "Trial Active" : "Start Free Trial"}
            </div >
        }
    </>
    );
};

export default TrialButton;
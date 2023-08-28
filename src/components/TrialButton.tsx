import React from 'react';

import useInitiateCheckout from '../hooks/subscription/useInitiateCheckout';
import { notSecretConstants } from '../constants/notSecretConstants';
import useFetchSubscriptionInfo from '../hooks/subscription/useFetchSubscriptionInfo';
import useActivateTrial from '../hooks/subscription/useActivateTrial';




const TrialButton: React.FC = () => {

    const { trialActivated, activateTrial } = useActivateTrial(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/stripe/activate-trial/`)
    const { subscriptionInfo, isLoading } = useFetchSubscriptionInfo(`${import.meta.env.VITE_API_URL || notSecretConstants.djangoApi}/user_data/get_subscription_info/`)
    return (!isLoading ?
        <div
            onClick={!subscriptionInfo?.active_trial || trialActivated ? activateTrial : () => console.log("Trial already activated")}
            className="font-bold fixed bottom-4 left-4 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white text-sm rounded-lg h-10 w-32 flex items-center justify-center shadow-2xl cursor-pointer transition-colors z-50">
            {trialActivated || subscriptionInfo?.active_trial ? <p className='ms-2'>Trial Active</p> : <p className='ms-2'>Free Trial</p>}
        </div> : null
    );
};

export default TrialButton;
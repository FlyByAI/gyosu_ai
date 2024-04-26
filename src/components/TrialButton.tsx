import useFetchSubscriptionInfo from '../hooks/subscription/useFetchSubscriptionInfo';
import useActivateTrial from '../hooks/subscription/useActivateTrial';
import useEnvironment from '../hooks/useEnvironment';




const TrialButton = ({ className }: { className: string }) => {
    const { apiUrl } = useEnvironment();
    const { trialActivated, activateTrial } = useActivateTrial(`${apiUrl}/stripe/activate-trial/`)
    const { subscriptionInfo, isLoading } = useFetchSubscriptionInfo(`${apiUrl}/user_data/get_subscription_info/`)
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
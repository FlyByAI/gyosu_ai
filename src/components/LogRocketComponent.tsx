import { useClerk } from '@clerk/clerk-react';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import { useEffect } from 'react';
import { notSecretConstants } from '../constants/notSecretConstants';
import useFetchSubscriptionInfo from '../hooks/subscription/useFetchSubscriptionInfo';
import useEnvironment from '../hooks/useEnvironment';

export default function LogRocketComponent() {

  const { env, apiUrl } = useEnvironment();

  const { user } = useClerk();

  const { subscriptionInfo, isLoading } = useFetchSubscriptionInfo(`${apiUrl}/user_data/get_subscription_info/`);

  useEffect(() => {
    if (env !== 'development') {
      LogRocket.init(notSecretConstants.logRocket);
      setupLogRocketReact(LogRocket);
    }

    if (user && !isLoading && env !== 'development') {
      LogRocket.identify(user.id, {
        name: user.fullName as string | boolean | number,
        email: user.primaryEmailAddress?.emailAddress as string | number | boolean,
        hasValidSubscription: subscriptionInfo?.has_valid_subscription as string | number | boolean, // has valid subscription?
        chatDocumentsCreated: subscriptionInfo?.chat_documents_created as string | number | boolean,

        // can add whatever else we want in here arbitrarily
      });
    }
  }, [user, isLoading, subscriptionInfo, env])

  return (
    null
  )
}
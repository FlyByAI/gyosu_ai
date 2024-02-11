import { useClerk } from '@clerk/clerk-react';
import { useEffect } from 'react';

export function useRequireSignIn() {
  const { session, openSignIn } = useClerk();

  useEffect(() => {
    if (session === null) {
      console.log(window.location.href)
      openSignIn({
        afterSignInUrl: window.location.href
      });
    }
  }, [session, openSignIn]);
}

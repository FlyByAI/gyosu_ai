import { useClerk } from '@clerk/clerk-react';
import { useEffect } from 'react';

export function useRequireSignIn() {
  const { session, openSignIn } = useClerk();

  useEffect(() => {
    if (session === null) {
      // Save the current URL before opening the sign-in modal
      localStorage.setItem('preSignInUrl', window.location.href);
      
      // Simply open the sign-in modal without specifying afterSignIn
      openSignIn();
    } else {
      // Check if there's a URL to redirect to after sign-in
      const preSignInUrl = localStorage.getItem('preSignInUrl');
      if (preSignInUrl) {
        window.location.href = preSignInUrl; // Redirect to the saved URL
        localStorage.removeItem('preSignInUrl'); // Clear the saved URL
      }
    }
  }, [session, openSignIn]);
}

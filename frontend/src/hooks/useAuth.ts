import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useStore } from '@store/auth';

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const { setUser, clearUser } = useStore();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        clearUser();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, clearUser]);

  return { loading };
}; 
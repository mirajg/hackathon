
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAuth } from '../userInfoContext';

export const UseOwnInfo = () => {
  const { setUser, user } = useAuth();
  const { data: session, status: sessionStatus } = useSession();
  const [loadingBackend, setLoadingBackend] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKENDPATH}/api/check-token`,
          {
            method: 'GET',
            credentials: 'include', 
            
          }
        );

        if (res.status === 401) {
          // it means that guys, user is not login with Custom auth which we made using express js .
          if (session?.user?.email) {
            setUser(session.user);
          } else {
            setUser(null);
          }
          return; 
        }

        if (!res.ok) {
          throw new Error(`Backend error: ${res.status}`);
        }

        const data = await res.json();

        if (data?.user && data?.user?.email) {
          setUser(data.user);
        } else if (session?.user?.email) {
          setUser(session.user);
        } else {
          setUser(null);
        }

        // store userId in cookie if available. It helps us in future, make convenient., 
        if (session?.user?.userId) {
          document.cookie = `userId=${session.user.userId}; path=/; max-age=${
            30 * 24 * 60 * 60
          }`;
        }
      } catch (err) {
        console.error("Unexpected error in useOwnInfo:", err);
      } finally {
        setLoadingBackend(false);
      }
    };

    if (sessionStatus !== 'loading') {
      fetchUser();
    }
  }, [session, sessionStatus, setUser]);

  return { user, loadingBackend, sessionStatus };
};

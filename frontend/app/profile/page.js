

'use client';
// yo bhaneko just user ko id assign garna design gariye ko ko. This page, below code. This is not real profile. Page. 

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../userInfoContext';
import Loading from '../components/Loading';
import { useSession } from 'next-auth/react';

const Page = () => {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === 'loading') return;

    const getUserTokenDetails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/api/check-token`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`server responded with  status ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error(' failed to fetch token details:', error.message);
        return null;
      }
    };

    const handleAuth = async () => {
      const tokenData = await getUserTokenDetails();

      if (tokenData?.user?.userId) {
        router.push(`/profile/${tokenData.user.userId}`);
        return;
      }

      if (session?.user?.userId) {
        setUser(session.user);
        router.push(`/profile/${session.user.userId}`);
        return;
      }

      router.push('/login');
    };


    handleAuth();
  }, [session, sessionStatus, router, setUser]);


  return <Loading />;
};

export default Page;

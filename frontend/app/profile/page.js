

'use client';

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
    if (sessionStatus === 'loading') return; // wait until session is loaded

    if (session?.user) {
      setUser(session.user);
      router.push(`/profile/${session.user.userId}`);
    } else {
      router.push('/login'); // fallback management here. 
    }
  }, [session, sessionStatus, router, setUser]);


  return <Loading />;
};

export default Page;

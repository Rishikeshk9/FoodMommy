'use client';
import { IconBrandGoogle } from '@tabler/icons-react';
import React, { useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { useGlobalContext } from '../contexts/globalContext';

function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { fetchUserItems } = useGlobalContext();

  useEffect(() => {
    checkUserMeals();
  }, [status, session, router, fetchUserItems]);
  const checkUserMeals = async () => {
    if (status === 'authenticated' && session?.user?.id) {
      const user = await fetchUserItems(session.user.id);
      if (user && (!user.breakfast || user.breakfast.length === 0)) {
        router.push('/home/account/preferences');
      } else {
        router.push('/home');
      }
    }
  };
  useEffect(() => {
    console.log(session?.user);

    if (status === 'authenticated' && session?.user?.id) {
      checkUserMeals();
    }
  }, [status, session, router]);

  const handleSignIn = async () => {
    const result = await signIn('google', { redirect: false });
    if (result?.error) {
      console.error('Sign in error:', result.error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center h-screen bg-black/10 backdrop-blur'>
        <div className='flex flex-col max-w-md gap-2 p-4 bg-white min-w-md'>
          <div>
            {!session ? (
              <div
                onClick={handleSignIn}
                className='flex gap-2  p-4 border active:bg-black/10 cursor-pointer active:scale-[0.99]  uppercase text-xs align-middle items-center'
              >
                <IconBrandGoogle />
                Sign In with Google
              </div>
            ) : (
              <div className='flex flex-col gap-4 text-center'>
                <p>Welcome, {session.user.name}</p>
                <button
                  onClick={() => signOut()}
                  className='px-4 py-2 text-white bg-red-500 rounded'
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

'use client';
import { IconBrandGoogle } from '@tabler/icons-react';
import React, { useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '../contexts/globalContext';

function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { fetchUserItems } = useGlobalContext();

  useEffect(() => {
    checkUserMeals();
  }, [status, session, router, fetchUserItems]);
  const checkUserMeals = async () => {
    if (status === 'authenticated' && session?.user?.id) {
      const user = await fetchUserItems(session?.user?.id);
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
      {/* Removed Navbar component */}
      <div className='flex flex-col items-center justify-center h-screen align-middle bg-black/10 backdrop-blur'>
        <div className='flex flex-col items-center justify-center max-w-md gap-2 p-4 min-w-md'>
          <div className='flex justify-center mb-4'>
            <img
              src='/logo.svg'
              alt='KayKhau Logo'
              className='w-64 h-auto drop-shadow'
            />
          </div>
          <div>
            {!session ? (
              <div className='flex h-12 ' onClick={handleSignIn}>
                <div className='flex gap-2 px-4 py-2 mt-auto font-bold text-black uppercase transition-all duration-100 ease-in-out bg-white border-b-4 rounded-lg cursor-pointer border-b-black/30 hover:bg-white active:bg-white active:text-lime-500 active:border-0'>
                  <svg
                    className='w-6 h-6'
                    xmlns='http://www.w3.org/2000/svg'
                    width='2443'
                    height='2500'
                    preserveAspectRatio='xMidYMid'
                    viewBox='0 0 256 262'
                    id='google'
                  >
                    <path
                      fill='#4285F4'
                      d='M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027'
                    ></path>
                    <path
                      fill='#34A853'
                      d='M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1'
                    ></path>
                    <path
                      fill='#FBBC05'
                      d='M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782'
                    ></path>
                    <path
                      fill='#EB4335'
                      d='M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251'
                    ></path>
                  </svg>
                  Sign In with Google
                </div>
              </div>
            ) : (
              <div className='flex flex-col gap-4 text-center text-black'>
                <p>Welcome, {session.user.name}</p>
                Redirecting...
                <button
                  onClick={() => signOut()}
                  className='hidden text-white rounded active:text-red-500'
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
        <p className='absolute bottom-0 p-4 mt-12 text-sm text-center text-gray-500'>
          By signing in, you agree to our{' '}
          <a href='/terms' className='text-blue-500'>
            Terms of Service
          </a>
          and{' '}
          <a href='/privacy' className='text-blue-500'>
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default Page;

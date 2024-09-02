'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Navbar from './components/Navbar';
import { useSession } from 'next-auth/react';

export default function Page() {
  const { data: session } = useSession();

  useEffect(() => {
    // Check if session exists
    if (session) {
      // Session exists, redirect to home route
      window.location.href = '/home';
    } else {
      // Session does not exist, redirect to login route
      window.location.href = '/login';
    }
  }, [session]);
  return <div className='scrollbar-none '></div>;
}

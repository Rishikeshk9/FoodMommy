'use client'; // Ensure this file is treated as a client component

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { usePathname } from 'next/navigation';

const Home = ({ children }) => {
  const pathname = usePathname();
  const [showBottomNav, setShowBottomNav] = useState(true);

  useEffect(() => {
    console.log('pathname', pathname);
    const showBottomNav = pathname !== '/home/account/preferences';
    setShowBottomNav(showBottomNav);
  }, [pathname]);

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      {children}
      {showBottomNav && <BottomNav />}
    </div>
  );
};

export default Home;

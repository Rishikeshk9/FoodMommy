'use client'; // Ensure this file is treated as a client component

import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../contexts/globalContext';
import { useSession } from 'next-auth/react';
import GroupsListItemUser from '../components/GroupsListItemUser';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { usePathname } from 'next/navigation';

const Home = ({ children }) => {
  const { fetchGroupItems } = useGlobalContext();
  const { data: session } = useSession();
  const [groupItems, setGroupItems] = useState([]);
  const pathname = usePathname();
  const [showBottomNav, setShowBottomNav] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id) {
        let data = await fetchGroupItems();
        setGroupItems(data);
      }
    };
    fetchData();
  }, [session, fetchGroupItems]);

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

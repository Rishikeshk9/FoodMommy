'use client'; // Ensure this file is treated as a client component

import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../contexts/globalContext';
import { useSession } from 'next-auth/react';
import GroupsListItemUser from '../components/GroupsListItemUser';
import Navbar from '../components/Navbar';

const Home = ({ children }) => {
  const { fetchGroupItems } = useGlobalContext();
  const { data: session } = useSession();
  const [groupItems, setGroupItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id) {
        let data = await fetchGroupItems();
        setGroupItems(data);
      }
    };
    fetchData();
  }, [session, fetchGroupItems]);

  return (
    <div className='w-full bg-white'>
      <Navbar />
      {children}
    </div>
  );
};

export default Home;

'use client';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../contexts/globalContext';
import { useSession } from 'next-auth/react';
import GroupsListItemUser from '../components/GroupsListItemUser';

function Home() {
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
  }, [session]);

  return (
    <div className='w-full h-screen bg-white'>
      {groupItems?.map((group) => (
        <div key={group._id} className='flex flex-col gap-4'>
          {group?.members?.includes(session?.user?.id) ? (
            <GroupsListItemUser group={group} />
          ) : (
            <div>Join a Group</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Home;

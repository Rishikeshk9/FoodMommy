'use client';
import React, { useContext, useEffect, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import DropDown from '@/app/components/DropDown';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';
import Badge from '@/app/components/Badge';
import Link from 'next/link';
 import { useSupabaseInit } from '../../api';
import { useSupabaseContext } from '@/app/context/SupabaseProvider';

function Home() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const supabaseStore = useSupabaseContext();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState();
  const [someGroups,setSomeGroups] = useState();

  function handleAddItem() {
    if (item.length > 2) {
      // Add the new item to the items array
      setItems([...items, item]);

      // Optionally, clear the item input after adding
      setItem('');
    }
  }

  function handleRemoveItem(itemToRemove) {
    setItems(items.filter((item) => item !== itemToRemove));
  }



  useEffect(   () => {
    supabaseStore.fetchUser() ;
   
    return () => {
       
    }
  }, [ ])


  const fetchMyGroups = async () => {
    const { data, error } = await supabaseStore.fetchAllGroupsImMemberOf(supabaseStore?.user?.id);
    if (error) {
      console.error('Error fetching groups:', error);
      return null;
    }
    console.log('Groups:', data);
    setGroups(data);
  };


  useEffect(() => {
    console.log(supabaseStore?.user);
    // supabaseStore.fetchAllGroupsImMemberOf(supabaseStore?.user?.id).then((data) => {
    //   console.log('Groups:', data);
    //   setGroups(data?.data);
    // });
  
    fetchMyGroups();
    supabaseStore.fetchAllGroups().then((data) => {
      console.log('All Groups:', data);
      setSomeGroups(data?.data);
    }
    );
    return () => {
       
    }
  }, [supabaseStore?.user])
  
 
  
  return (
    <> 
      <div className='flex   w-full h-screen   items-center flex-col gap-4  '>
        <div className='flex flex-col   bg-black/25 w-full max-w-lg p-4 gap-2 rounded-md'>
          <p className='cursor-pointer'  >Today Special</p>
         
          <Link href="/group">
            {groups?.length>0 &&   groups.map((group, index) => (
              <div
                key={index}
                onClick={() => setSelectedGroup(group)}
                className='bg-slate-600 p-4 flex justify-between  w-full hover:bg-slate-700 cursor-pointer hover:shadow-md rounded-md'
              >
                <div className='flex flex-col  '>
                  <p className='text-lg font-bold'>{group.groups.group_name}</p>

                  <p className='text-sm'>Group Members</p>
                </div>
                <div className='flex    gap-2'>
                  <div className=' border-white border rounded-full bg-slate-400 p-1 h-12 w-12 text-center items-center   align-middle flex justify-center z-10'>
                    a
                  </div>
                  <div className=' -ml-6 border-white border rounded-full bg-slate-500 p-1 h-12 w-12 text-center items-center  align-middle flex justify-center'>
                    b{' '}
                  </div>
                </div>
              </div>
            )) }

          
          {/* <div className='bg-slate-600 p-4 flex justify-between  w-full hover:bg-slate-700 cursor-pointer hover:shadow-md rounded-md'>
            <div className='flex flex-col  '>
              <p className='text-lg font-bold'>Supersapiens</p>

              <p className='text-sm'>Group Members</p>
            </div>
            <div className='flex    gap-2'>
              <div className=' border-white border rounded-full bg-slate-400 p-1 h-12 w-12 text-center items-center   align-middle flex justify-center z-10'> a</div>
              <div className=' -ml-6 border-white border rounded-full bg-slate-500 p-1 h-12 w-12 text-center items-center  align-middle flex justify-center'>b </div>
            </div>
          </div> */}
          </Link>
          {!groups && <div className='flex flex-col gap-4 w-full'>
            <div className='flex gap-4 items-center'>
              <div className='skeleton w-16 h-16 rounded-full shrink-0'></div>
              <div className='flex flex-col gap-4'>
                <div className='skeleton h-4 w-20'></div>
                <div className='skeleton h-4 w-28'></div>
              </div>
            </div>

            <div className='flex gap-4 items-center'>
              <div className='skeleton w-16 h-16 rounded-full shrink-0'></div>
              <div className='flex flex-col gap-4'>
                <div className='skeleton h-4 w-20'></div>
                <div className='skeleton h-4 w-28'></div>
              </div>
            </div>
          </div>}
          {groups && groups?.length===0 && <><p className='p-3 bg-info/80 rounded'>Join a group to get started</p>
<hr/>
<p>Top Food Communities </p>
          <div className='  flex flex-col'>
          {someGroups && someGroups.map((group, index) => (
              <div
                key={index}
                onClick={() => setSelectedGroup(group)}
                className='bg-slate-600 p-2 px-4 flex justify-between items-center align-middle w-full hover:bg-slate-700 cursor-pointer hover:shadow-md rounded-md'
              >
                <div className='flex flex-col  '>
                  <p className='text-lg font-bold'>{group.group_name}</p>

<div className='flex gap-2 align-middle items-center '>
                  <p className='text-sm'>Group Members</p><div className='flex    gap-2'>
                  <div className=' border-white border rounded-full bg-slate-400 p-1 h-8 w-8 text-center items-center   align-middle flex justify-center z-10'>
                    a
                  </div>
                  <div className=' -ml-6 border-white border rounded-full bg-slate-500 p-1 h-8 w-8 text-center items-center  align-middle flex justify-center'>
                    b{' '}
                  </div></div>
                </div>
                </div>
                <button className='btn btn-primary' onClick={async()=>{await supabaseStore.addUserToGroup(group.group_id);fetchMyGroups();}}>Join</button>
              </div>
            )) }
          </div></>}
        </div>
      </div>{' '}
    </>
  );
}

export default Home;

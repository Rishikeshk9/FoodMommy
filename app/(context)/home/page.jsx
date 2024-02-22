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
  const supabase = useSupabaseInit();  

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
  
  return (
    <> 
      <div className='flex   w-full h-screen   items-center flex-col gap-4  '>
        <div className='flex flex-col   bg-black/25 w-full max-w-lg p-4 gap-2 rounded-md'>
          <p className='cursor-pointer'  >Today Special</p>
         
          <Link href="/group">
          <div className='bg-slate-600 p-4 flex justify-between  w-full hover:bg-slate-700 cursor-pointer hover:shadow-md rounded-md'>
            <div className='flex flex-col  '>
              <p className='text-lg font-bold'>Supersapiens</p>

              <p className='text-sm'>Group Members</p>
            </div>
            <div className='flex    gap-2'>
              <div className=' border-white border rounded-full bg-slate-400 p-1 h-12 w-12 text-center items-center   align-middle flex justify-center z-10'> a</div>
              <div className=' -ml-6 border-white border rounded-full bg-slate-500 p-1 h-12 w-12 text-center items-center  align-middle flex justify-center'>b </div>
            </div>
          </div>
          </Link>
        </div>
      </div>{' '}
    </>
  );
}

export default Home;

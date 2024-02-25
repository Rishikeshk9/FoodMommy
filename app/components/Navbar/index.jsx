'use client'
import { useSupabaseContext } from '@/app/context/SupabaseProvider';
import Link from 'next/link';
import React, { useContext, useEffect } from 'react'
import { BeakerIcon, PlusIcon, UserGroupIcon } from '@heroicons/react/24/solid'

export default function Navbar() {
    const supabase = useSupabaseContext();

    useEffect(() => {
      !supabase.user??window.location('/register');
    
      return () => {
         
      }
    }, [supabase.user ])
    
  return (
     <><div className="navbar bg-base-100 sticky top-0 z-[9999]">
     <div className="flex-1">
     <Link href="/home">
       <p className="btn btn-ghost text-xl">Food</p>
       </Link>
     </div>
     <div className="flex-none">

     
     <Link href="/joingroup" className='fixed bottom-4 right-4 rounded-full bg-base-100  active:scale-[0.95]  drop-shadow-md'>
      <button className="btn btn-ghost btn-circle p-2 active:text-white/50 "> 
      <div className='flex h-6 items-center align-middle'>
     <UserGroupIcon className="h-6 w-6  " />  </div> </button>
     </Link>
     
       <div className="dropdown dropdown-end">
         <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
           <div className="w-10 rounded-full">
             <img alt="Tailwind CSS Navbar component" src={`${supabase.user?.user_metadata?.avatar_url}`} />
           </div>
         </div>
         <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
           <li>
            
             <Link className= "justify-between"  href="/myfood">
       <p className=" ">My Food</p>
       </Link>
    
           </li>
           <li><a>Settings</a></li>
           <li><a onClick={()=>supabase.signOut()}>Logout</a></li>
         </ul>
       </div>
     </div>
   </div></>
  )
}
 
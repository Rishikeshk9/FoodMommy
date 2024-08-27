import Link from 'next/link';
import React from 'react';
import { useSession, signOut } from 'next-auth/react';

function Navbar() {
  const { data: session } = useSession();

  return (
    <div className='sticky top-0 flex items-center justify-between w-full p-4   bg-white  border-b border-b-[#1e293b4e]  text-black'>
      <div className='flex items-center gap-4'>
        <Link className='text-xl font-bold' href='/home'>
          Sextortion
        </Link>
      </div>

      <div className='flex gap-4'>
        {session ? (
          <Link
            className='text-gray-500 cursor-pointer active:scale-95 hover:text-black'
            href='/home/account'
          >
            Profile
          </Link>
        ) : (
          <Link className='text-gray-500 hover:text-black' href='/login'>
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;

import Link from 'next/link';
import React from 'react';
import { useSession, signOut } from 'next-auth/react';

function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className='sticky top-0 flex items-center justify-between w-full p-4 text-white bg-black shadow-md'>
      <div className='flex items-center gap-4'>
        <Link className='text-xl font-bold' href='/home'>
          Home
        </Link>
        <Link href='/admin'>Admin</Link>
      </div>

      <div className='flex gap-4'>
        {session && (
          <Link
            className='cursor-pointer active:text-white hover:text-white text-white/50'
            href='/home/account'
          >
            Profile
          </Link>
        )}
        {session ? (
          <button
            className='cursor-pointer active:text-white hover:text-white text-white/50'
            onClick={() => signOut()}
          >
            Logout
          </button>
        ) : (
          <Link className='text-white/50 hover:text-white' href='/login'>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

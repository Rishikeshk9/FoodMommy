import Link from 'next/link';
import { IconHome, IconUser } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className='fixed bottom-0 left-0 right-0 flex justify-around w-full bg-white border-t border-gray-200'>
      <Link
        href='/home'
        className={` items-center justify-center  flex  w-full p-3 ${
          pathname === '/home' ? 'text-white bg-lime-500' : 'hover:bg-lime-100'
        }`}
      >
        <IconHome
          className={`w-6 h-6   ${
            pathname === '/home' ? 'text-white' : 'text-slate-400'
          }`}
        />
      </Link>
      <Link
        href='/home/account'
        className={` items-center justify-center  flex  w-full p-3 ${
          pathname === '/home/account'
            ? 'text-white bg-lime-500'
            : 'hover:bg-lime-100 '
        }`}
      >
        <IconUser
          className={`w-6 h-6   ${
            pathname === '/home/account' ? 'text-white' : 'text-slate-400'
          }`}
        />
      </Link>
    </div>
  );
}

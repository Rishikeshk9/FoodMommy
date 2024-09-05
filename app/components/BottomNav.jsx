import Link from 'next/link';
import { IconHome, IconUser } from '@tabler/icons-react';

export default function BottomNav() {
  return (
    <div className='fixed bottom-0 left-0 right-0 flex justify-around p-3 bg-white border-t border-gray-200'>
      <Link href='/home' className='flex flex-col items-center'>
        <IconHome className='w-6 h-6' />
      </Link>
      <Link href='/home/account' className='flex flex-col items-center'>
        <IconUser className='w-6 h-6' />
      </Link>
    </div>
  );
}

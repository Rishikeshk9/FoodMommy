import React from 'react';
import Link from 'next/link';

function page() {
  return (
    <div className='flex gap-2'>
      <Link className='bg-blue-500 p-2 ' href='/admin/users'>
        Go to Users
      </Link>
      <Link href='/admin/food' className='bg-orange-500'>
        Go to Food
      </Link>
      <Link href='/admin/groups' className='bg-orange-500'>
        Go to Groups
      </Link>
    </div>
  );
}

export default page;

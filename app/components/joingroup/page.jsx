import Button from '@/app/components/Button'
import Link from 'next/link'
import React from 'react'

function JoinorCreate() {
  return (
    <div className='bg-slate-900 w-full h-screen items-center flex align-middle  justify-center'>
     <div className='flex gap-4 align-middle items-center'> <Link href="/joingroup/groupdetails"><Button type="primary" text="Join Group"/></Link>or <Button type="secondary" text="Create Group"/></div>
    </div>
  )
}

export default JoinorCreate
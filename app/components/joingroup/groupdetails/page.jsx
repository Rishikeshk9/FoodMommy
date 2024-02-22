"use client"
import Button from '@/app/components/Button'
import React from 'react'
import CustomButton from '@/app/components/EatButton'

function groupdetails() {
  return (
    <div className='flex   w-full h-screen justify-center align-middle items-center flex-col gap-4 bg-slate-900'>
          
    <input  type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs focus:ring-0 focus:outline-0" /> 
     <Button   type="primary" text={"Join"} />
     
    </div> 
  )
}

export default groupdetails
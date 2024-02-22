"use client"
import Button from '@/app/components/Button'
import React from 'react' 

function creategroup() {
  return (
    <div className='flex   w-full h-screen justify-center align-middle items-center flex-col gap-4  '>
        <div role="alert" className="alert alert-success max-w-md">
  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  <span>Group Created</span>
</div><div className='flex flex-col gap-2 '>
  <div>
<label className="form-control w-full max-w-xs">
  <div className="label">
    <span className="label-text">Group Name</span> 
    <span className="label-text-alt">Min 3 chars</span>

  </div>
 <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />    

 
</label></div> <Button   type="primary" text={"Save"} /></div> 

     <Button   type="info" text={"Invite Foodies 😋"} />
     
    <div className="badge   badge-accent"><strong>Group ID : </strong>#1234</div>
    </div> 
  )
}

export default creategroup
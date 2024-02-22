"use client"
import React, { useContext, useState } from 'react';
import SocialButtons from '../../components/SocialButtons';
 function Register() {
 

  return (
    <div className='flex w-full h-screen justify-center align-middle items-center bg-slate-900 gap-4 p-4'>
      
      {/* <input
        type='text'
        onChange={(e)=>{setUserEmail(e.target.value)}}
        value={userEmail}
        placeholder='Enter Email'
        className='input input-bordered w-full max-w-xs focus:ring-0 focus:outline-0'
      />

<button className='btn btn-primary' onClick={handleCreateUser}>Sign Up</button> */}
<SocialButtons/>
    </div>
  );
}

export default Register;

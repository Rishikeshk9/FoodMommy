"use client"
import React, { useContext } from 'react' 
import MenuItem from '@/app/components/MenuItem'
 import { useSupabaseContext } from '@/app/context/SupabaseProvider';

function Group() {
  const supabase = useSupabaseContext();
  
  return (
    <div className='w-full flex flex-col items-center justify-center align-middle   h-full gap-4 p-4'>
        <div className="btn-primary btn-secondary btn-success hidden btn-info btn-accent btn-neutral  "></div>
       <MenuItem when={"Breakfast"} itemName={"Misal Pav"}/>
    
</div>
  )
}

export default Group
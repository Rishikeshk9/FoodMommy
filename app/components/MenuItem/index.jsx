import React from 'react'
import FoodItem from '../FoodItem'
import EatButton from '../EatButton'
import Button from '../Button'
import { useSupabaseInit } from '../../api';

function MenuItem({when,itemName}) {

  
    
        const supabase = useSupabaseInit();

  return (
    <div> <div className='breakfast  food-card'>
    <p>{when} for the Day</p>
    <FoodItem itemName={itemName}/>
<EatButton/> <p className='text-sm'>Raj, Tejas & 10 Others want to eat <strong>{itemName}</strong> for {when}</p>


<div className="collapse collapse-arrow bg-black/30">
<input type="radio" name="my-accordion-2" /> 
<div className="collapse-title text-xl font-medium">
You Might Like
</div>
<div className="collapse-content"> 
<div className='grid grid-cols-3 gap-2'>
<div className='flex flex-col gap-2'>
<FoodItem itemName={itemName}/><Button type="primary"  text={"I'll Eat this 👆"}/> 
<p className='text-sm'>Optimus, Maverick & 2 Others Voted</p>

</div>

<div className='flex flex-col gap-2'>
<FoodItem itemName={itemName}/><Button type="primary"  text={"I'll Eat this 👆"}/> 
<p className='text-sm'>Optimus, Maverick & 2 Others Voted</p>

</div>

<div className='flex flex-col gap-2'>
<FoodItem itemName={itemName}/><Button type="primary"  text={"I'll Eat this 👆"}/> 
<p className='text-sm'>Optimus, Maverick & 2 Others Voted</p>

</div>

</div>
</div>
</div>

</div></div>
  )
}

export default MenuItem
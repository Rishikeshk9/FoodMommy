"use client"
import React, { useEffect, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import DropDown from '@/app/components/DropDown';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';
import Badge from '@/app/components/Badge';
import Link from 'next/link';
import { useSupabaseContext } from '@/app/context/SupabaseProvider';

function Home() {

  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const supaStore = useSupabaseContext();
  const [selectedCategory,setSelectedCategory] = useState();
  const [selectedDay,setSelectedDay] = useState();

  function handleAddItem() {

    if(item.length>2){
      
    // Add the new item to the items array
    setItems([...items, item]);

    // Optionally, clear the item input after adding
    setItem('');
  }
  }

  function handleRemoveItem(itemToRemove) {
    setItems(items.filter(item => item !== itemToRemove));
  }

  function handleSavetoDB(){

  items.forEach((item,index)=> {
    supaStore.addFoodItem(item);
    supaStore.addItemToUser(item,supaStore.user.email,String(selectedCategory).toLowerCase(),String(selectedDay).toLowerCase());
  });


   
   }
    
 
  return ( <> 
      <div className='flex   w-full h-screen justify-center align-middle items-center flex-col gap-4 bg-slate-900'>
        <div className='flex items-center gap-4 '>
          <DropDown setSelected={setSelectedCategory} selected={selectedCategory}  options={['Breakfast', 'Lunch', 'Dinner']} />
          <p>for</p>
          <DropDown setSelected={setSelectedDay} selected={selectedDay} options={['WeekDays', 'Weekends']} />
        </div>
        <div className='flex  items-center gap-4'>
          
        <input onChange={(e)=>{setItem(e.target.value)}} value={item} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs focus:ring-0 focus:outline-0" /> 
         <Button onClick={handleAddItem} type="primary" text={"Add"} />
        </div>
        <div className='flex gap-4  '>
        {items.map((item, index) => (
          <Badge   name={item} onClick={handleRemoveItem} key={index} />
        ))}
      </div>
      
      <Button onClick={()=>handleSavetoDB()} className=" absolute bottom-12 right-12" text="Next" type= "success"  />
      
      </div> </>
  );
}

export default Home;

'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import DropDown from '@/app/components/DropDown';
import InputSelect from '@/app/components/InputSelect';
import Button from '@/app/components/Button';
import Badge from '@/app/components/Badge';
import Link from 'next/link';
import { useSupabaseContext } from '@/app/context/SupabaseProvider';
import Table from '@/app/components/Table';

function Home() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const supaStore = useSupabaseContext();
  const [selectedCategory, setSelectedCategory] = useState('Breakfast');
  const [selectedDay, setSelectedDay] = useState('WeekDays');
  const [allFoodItems, setAllFoodItems] = useState();
  const [userPreferences, setUserPreferences] = useState();

  function handleAddItem() {
    // Add the new item to the items array
    setItems([...items, item]);

    // console.log(item, selectedCategory, selectedDay);
    // Optionally, clear the item input after adding
    //setItem('');
  }

  function handleRemoveItem(itemToRemove) {
    setItems(items.filter((item) => item !== itemToRemove));
  }

  function handleSavetoDB() {
    items.forEach((foodItem) => {
      // Assuming items array now contains food_item_ids selected by the user
      supaStore.addItemToUser(
        foodItem.food_item_id,
        supaStore.user.email,
        String(selectedCategory).toLowerCase(),
        String(selectedDay).toLowerCase()
      );
    });
  }

  function fetchUserPreferences() {
    supaStore.fetchUserPreferences(supaStore?.user?.email).then((data) => {
      if (data.length > 0) setUserPreferences(data);
      console.log(data);
    });
  }

  useEffect(() => {
    let foodItems;
    async function fetchFoodItems() {
      foodItems = await supaStore.fetchAllFoodItems(); //[{"id":22,"created_at":"2024-02-24T18:31:11.553462+00:00","name":"Vad Pav"}]
    }
    fetchFoodItems().then(() => {
      setAllFoodItems(foodItems?.data.map((item) => item));
    });

    fetchUserPreferences();

    return () => {};
  }, [supaStore, supaStore?.user?.email]);

  return (
    <>
      <div className='flex   w-full   justify-center  p-4 items-center flex-col gap-4  '>
        <div className='flex items-center gap-4 '>
          <DropDown
            setSelected={setSelectedCategory}
            selected={selectedCategory}
            options={['Breakfast', 'Lunch', 'Dinner']}
          />
          <p>for</p>
          <DropDown
            setSelected={setSelectedDay}
            selected={selectedDay}
            options={['WeekDays', 'Weekends']}
          />
        </div>
        <div className='flex   gap-4 items-end   '>
          {allFoodItems && (
            <div className='flex flex-col'>
              <p>Choose from {allFoodItems.length} items</p>{' '}
              <InputSelect
                className='w-full'
                setSelected={setItem}
                selected={item}
                options={allFoodItems}
              />{' '}
            </div>
          )}

          {/* <input
            onChange={(e) => {
              setItem(e.target.value);
            }}
            value={item}
            type='text'
            placeholder='Type here'
            className='input input-bordered w-full max-w-xs focus:ring-0 focus:outline-0'
          /> */}
          <button onClick={() => handleAddItem()} className='btn btn-primary '>
            Add
          </button>
        </div>
        <div className='flex gap-4  '>
          {items.map((item, index) => (
            <Badge
              name={item.food_name}
              onClick={handleRemoveItem}
              key={index}
            />
          ))}
        </div>

        <button
          onClick={() => handleSavetoDB()}
          className='btn btn-wide btn-success'
        >
          Save
        </button>
        <div>
          {userPreferences ? (
            <div className=''>{<Table data={userPreferences} />}</div>
          ) : (
            <>
              <div className='flex flex-col gap-4 w-full'>
                <div className='flex gap-4 items-center'>
                  <div className='skeleton w-16 h-16 rounded-full shrink-0'></div>
                  <div className='flex flex-col gap-4'>
                    <div className='skeleton h-4 w-20'></div>
                    <div className='skeleton h-4 w-28'></div>
                  </div>
                </div>

                <div className='flex gap-4 items-center'>
                  <div className='skeleton w-16 h-16 rounded-full shrink-0'></div>
                  <div className='flex flex-col gap-4'>
                    <div className='skeleton h-4 w-20'></div>
                    <div className='skeleton h-4 w-28'></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>{' '}
    </>
  );
}

export default Home;

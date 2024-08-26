'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  getUserItems,
  saveUserPreferences,
} from '../../../_actions/userAction';
import connectDB from '../../../config/database';
import { getFoodItems } from '../../../_actions/postAction';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });
  const [foodItems, setFoodItems] = useState({});
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getUserItems(session?.user?.id);
      console.log(result);
      if (result) {
        setUser(result);
        setPreferences({
          breakfast: result.breakfast || [],
          lunch: result.lunch || [],
          dinner: result.dinner || [],
        });

        const foodIds = [
          ...result.breakfast,
          ...result.lunch,
          ...result.dinner,
        ];

        await fetchFoodItems(foodIds.flat());
      } else {
        console.error('User not found in the fetched data');
      }
    };
    fetchUser();
  }, [session]);

  useEffect(() => {
    console.log(preferences);
    return () => {};
  }, [preferences]);

  const fetchFoodItems = async (foodIds) => {
    const foodData = await getFoodItems(foodIds);
    console.log(foodData);
    const foodMap = {};
    foodData.forEach((food) => {
      foodMap[food._id.toString()] = food.name;
    });
    console.log(foodMap);
    setFoodItems(foodMap);
  };

  const handlePreferenceChange = (meal, value) => {
    setPreferences((prev) => ({
      ...prev,
      [meal]: value.split(',').map((item) => item.trim()),
    }));
  };

  const handleSavePreferences = async () => {
    if (user) {
      const result = await saveUserPreferences(user._id, preferences);
      if (result.success) {
        alert('Preferences saved successfully!');
      } else {
        alert('Error saving preferences');
      }
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className='max-w-2xl p-4 mx-auto text-black bg-white'>
      <h1 className='mb-4 text-2xl font-bold'>User Profile</h1>
      <div className='mb-4'>
        <img
          src={user.image || '/default-avatar.png'}
          alt={user.name}
          width={100}
          height={100}
          className='rounded-full'
        />
      </div>
      <div className='mb-2'>
        <strong>Name:</strong> {user.name}
      </div>
      <div className='mb-2'>
        <strong>Email:</strong> {user.email}
      </div>
      <div className='mb-2'>
        <strong>Username:</strong> {user.userName}
      </div>

      <div className='flex justify-between mb-2'>
        <h2 className='text-xl font-semibold'>Meal Preferences</h2>{' '}
      </div>
      {['breakfast', 'lunch', 'dinner'].map((meal) => (
        <div key={meal} className='mb-4'>
          <div className='flex items-baseline justify-between'>
            <label className='block mb-1 capitalize'>{meal} </label>
            <label className='block text-xs font-semibold text-black/50'>
              {preferences[meal]?.length} items
            </label>
          </div>
          <div className='flex w-full gap-2 p-1 overflow-x-auto bg-inherit scrollbar-none'>
            {preferences[meal]?.map((itemId, index) => (
              <div
                key={index}
                className='w-full px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-lg whitespace-nowrap'
              >
                {foodItems[itemId] || 'Loading...'}
              </div>
            ))}
          </div>
        </div>
      ))}
      <Link href='/home/account/preferences' className='flex h-12'>
        <button className='w-full py-2 mt-auto font-bold text-blue-200 transition-all duration-100 bg-blue-500 border-b-4 rounded-lg active:text-white active:bg-blue-500 active:border-0 border-b-blue-600'>
          Edit Preferences
        </button>
      </Link>
    </div>
  );
};

export default UserProfile;

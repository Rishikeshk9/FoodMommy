'use client';

import { useState, useEffect } from 'react';
import {
  getUserItems,
  updateUserPreferences,
} from '../../../_actions/userAction';
import { getFoodItems } from '../../../_actions/postAction';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

export default function Page() {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });
  const [foodItems, setFoodItems] = useState({});
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isGroupsExpanded, setIsGroupsExpanded] = useState(false);
  const [isAccountSettingsExpanded, setIsAccountSettingsExpanded] =
    useState(false);
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

  if (!user) return <div>Loading...</div>;

  return (
    <div className='flex flex-col w-full h-screen gap-4 p-4 mx-auto text-black bg-white'>
      <div className='flex max-w-md gap-2 p-2 bg-white border-2 rounded-lg shadow border-gray-50'>
        <div className='flex items-center justify-center align-middle'>
          <img
            src={user.image || '/default-avatar.png'}
            alt={user.name}
            width={100}
            height={100}
            className='w-12 h-12 bg-gray-100 rounded-full '
          />
        </div>
        <div className='flex flex-col justify-center align-middle'>
          <div className=''>
            <strong>Name:</strong> {user.name}
          </div>
          <div className=''>
            <strong>Email:</strong> {user.email}
          </div>
        </div>
      </div>
      <div className=''>
        <div
          className='flex items-center mb-2 align-middle cursor-pointer'
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h2 className='font-semibold text'>Meal Preferences</h2>{' '}
          <p className='text-sm font-semibold text-gray-500'>
            {isExpanded ? (
              <IconChevronUp className='text-blue-500' />
            ) : (
              <IconChevronDown />
            )}
          </p>
        </div>

        {isExpanded && (
          <div>
            <div className='transition-all duration-300 ease-in-out'>
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
                        className='w-full px-3 py-1 text-sm font-semibold text-center text-blue-600 bg-blue-100 rounded-lg whitespace-nowrap'
                      >
                        {foodItems[itemId] || 'Loading...'}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Link href='/home/account/preferences' className='flex h-12'>
              <button className='w-full max-w-md py-2 mt-auto font-bold text-blue-200 transition-all duration-100 bg-blue-500 border-b-4 rounded-lg active:text-white active:bg-blue-500 active:border-0 border-b-blue-600'>
                Edit Preferences
              </button>
            </Link>{' '}
          </div>
        )}
      </div>
      <div className='flex flex-col hidden gap-2'>
        <div
          className='flex items-center justify-between mb-2 align-middle cursor-pointer'
          onClick={() => setIsGroupsExpanded(!isGroupsExpanded)}
        >
          <h2 className='font-semibold '>Groups Joined</h2>{' '}
          <p className='text-sm font-semibold text-slate-500'>
            {isGroupsExpanded ? (
              <IconChevronUp className='text-blue-500' />
            ) : (
              <IconChevronDown />
            )}
          </p>
        </div>

        {isGroupsExpanded && (
          <div className='transition-all duration-300 ease-in-out'>
            {user.groups && user.groups.length > 0 ? (
              user.groups.map((group, index) => (
                <div key={index} className='p-2 mb-2 bg-gray-100 rounded-lg'>
                  <p className='font-semibold'>{group.name}</p>
                  <p className='text-sm text-gray-600'>{group.description}</p>
                </div>
              ))
            ) : (
              <p className='text-gray-500'>
                You haven't joined any groups yet.
              </p>
            )}
          </div>
        )}
      </div>

      <button
        className='mx-auto mt-auto mb-24 font-semibold cursor-pointer text-slate-300 active:scale-95 active:text-red-500 w-fit'
        onClick={() => signOut({ callbackUrl: '/login' })}
      >
        Logout
      </button>
    </div>
  );
}

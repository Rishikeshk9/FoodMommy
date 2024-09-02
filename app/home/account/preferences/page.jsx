'use client';
import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../../contexts/globalContext';
import { IconCircleCheckFilled, IconSearch } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [currentMeal, setCurrentMeal] = useState('breakfast');
  const [selectedMeals, setSelectedMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });
  const { data: session } = useSession();
  const router = useRouter();
  const { fetchUserItems, saveUserPreferences, fetchFoodItems, userData } =
    useGlobalContext();

  const fetchUser = async () => {
    const result = await fetchUserItems(session?.user?.id);
    if (result) {
      setSelectedMeals({
        breakfast: result.breakfast || [],
        lunch: result.lunch || [],
        dinner: result.dinner || [],
      });
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchUser();
    }
  }, [session]);

  const handleMealComplete = (items) => {
    if (currentMeal === 'breakfast') {
      setSelectedMeals((prevMeals) => ({ ...prevMeals, [currentMeal]: items }));
      setCurrentMeal('lunch');
    } else if (currentMeal === 'lunch') {
      setSelectedMeals((prevMeals) => ({ ...prevMeals, [currentMeal]: items }));
      setCurrentMeal('dinner');
    } else {
      setSelectedMeals((prevMeals) => {
        const updatedMeals = { ...prevMeals, [currentMeal]: items };
        _saveUserPreferences(updatedMeals);

        return updatedMeals;
      });
    }
  };

  const _saveUserPreferences = async (selectedMeals) => {
    try {
      console.log('SAVING USER PREFERENCES', selectedMeals);
      saveUserPreferences(session.user.id, selectedMeals).then(() => {
        if (!userData.groups || userData.groups.length <= 0) {
          console.log('userData.groups', userData.groups);
          router.push('/home');
        } else {
          console.log('userData.groupsasdasd', userData.groups);
          router.push('/home/account');
        }
      });
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  };

  return (
    <div>
      <OnboardingMeal
        mealType={currentMeal}
        onComplete={handleMealComplete}
        preSelectedItems={selectedMeals[currentMeal]}
      />
    </div>
  );
}

const OnboardingMeal = ({ mealType, onComplete, preSelectedItems }) => {
  const { fetchFoodItems } = useGlobalContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(preSelectedItems);
  const [foodItems, setFoodItems] = useState([]);
  useEffect(() => {
    setSelectedItems(preSelectedItems);

    const fetchItems = async () => {
      const items = await fetchFoodItems();
      setFoodItems(items);
    };

    fetchItems();
  }, [preSelectedItems]);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredItems(foodItems);
    } else {
      const filtered = foodItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, foodItems]);

  const handleItemSelect = (item) => {
    setSelectedItems((prevItems) =>
      prevItems.includes(item._id)
        ? prevItems.filter((i) => i !== item._id)
        : [...prevItems, item._id]
    );
  };

  return (
    <div className='relative text-black '>
      <div className='sticky top-0 left-0 z-10 px-4 py-1 bg-lime-100'>
        <h2 className='mb-4 text-2xl font-semibold'>
          Choose your favorite{' '}
          <span className='px-2 font-bold text-white uppercase rounded-lg bg-lime-500'>
            {mealType}
          </span>{' '}
          items
        </h2>
        <p className='mb-4'>Please select at least 5 items</p>

        <div className='relative mb-4'>
          <input
            type='text'
            placeholder='Search for food items'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full p-2 pl-10 bg-white border rounded-lg'
          />
          <IconSearch className='absolute left-3 top-2.5 text-gray-400' />
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4'>
        {filteredItems?.map((item) => (
          <div className='flex w-full h-12 ' key={item._id}>
            <div
              onClick={() => handleItemSelect(item)}
              className={`cursor-pointer w-full py-2 mt-auto font-bold  transition-all duration-100   rounded-lg active:text-white  active:bg-lime-400 active:border-0   ${
                selectedItems.includes(item._id)
                  ? 'bg-lime-500   border-b-4 text-white  border-b-lime-600'
                  : 'border-b-black/20 bg-slate-50  text-slate-500'
              }`}
            >
              <div className='relative flex items-center justify-center gap-1 text-center'>
                {selectedItems.includes(item._id) && (
                  <IconCircleCheckFilled className='absolute w-4 h-4 left-1 -top-1 ' />
                )}
                {item.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedItems.length >= 5 && (
        <button
          className='sticky bottom-0 left-0 w-full p-2 mt-4 font-bold text-white bg-lime-500 active:bg-lime-600 z-[99] '
          onClick={() => {
            onComplete(selectedItems);
            setSelectedItems([]);
          }}
        >
          {mealType === 'dinner' ? 'SAVE' : 'NEXT'}
        </button>
      )}
    </div>
  );
};

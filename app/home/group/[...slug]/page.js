'use client';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import FoodCard from '../../../components/FoodCard';
import { useGlobalContext } from '../../../contexts/globalContext';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { fetchGroupMembersByGroupId } from '../../../../_actions/groupAction';

function Home() {
  const { slug } = useParams();
  const groupId = slug[0];
  const { fetchFoodItems, fetchVoteItems, fetchVotesByGroup, voteItems } =
    useGlobalContext();

  const [searchQueries, setSearchQueries] = useState({
    breakfast: '',
    lunch: '',
    dinner: '',
  });
  const [openSearches, setOpenSearches] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });
  const [mealItems, setMealItems] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });
  const [groupMembers, setGroupMembers] = useState([]);
  const [foodItems, setFoodItems] = useState([]);

  const fetchGroupMembers = useCallback(async () => {
    const members = await fetchGroupMembersByGroupId(groupId);
    setGroupMembers(members);

    const mealSets = {
      breakfast: new Set(),
      lunch: new Set(),
      dinner: new Set(),
    };

    members.forEach((member) => {
      if (member.breakfast) mealSets.breakfast.add(member.breakfast);
      if (member.lunch) mealSets.lunch.add(member.lunch);
      if (member.dinner) mealSets.dinner.add(member.dinner);
    });

    const updatedMealItems = {};
    for (const [meal, items] of Object.entries(mealSets)) {
      updatedMealItems[meal] = await foodIDsToObjects(Array.from(items));
    }

    setMealItems(updatedMealItems);

    const fetchData = async () => {
      await fetchVotesByGroup(groupId);
    };

    fetchData();
  }, [groupId]);

  const foodIDsToObjects = useCallback(
    async (uniqueItems) => {
      try {
        const foodItemResponses = await fetchFoodItems(uniqueItems);
        setFoodItems((prevItems) => [...prevItems, ...foodItemResponses]);
        return foodItemResponses;
      } catch (error) {
        console.error('Error fetching meal items:', error);
        return [];
      }
    },
    [foodItems]
  );

  const filteredMealItems = useMemo(() => {
    const filtered = {};
    for (const [meal, items] of Object.entries(mealItems)) {
      filtered[meal] = items
        .filter((item) =>
          item.name.toLowerCase().includes(searchQueries[meal].toLowerCase())
        )
        .sort((a, b) => {
          if (voteItems && voteItems.length > 0) {
            const votesA = voteItems.filter(
              (vote) => vote.foodId === a._id
            ).length;
            const votesB = voteItems.filter(
              (vote) => vote.foodId === b._id
            ).length;
            return votesB - votesA;
          } else {
            return a.name.localeCompare(b.name);
          }
        });
    }
    return filtered;
  }, [voteItems, searchQueries, mealItems]);

  useEffect(() => {
    fetchGroupMembers();
  }, [groupId]);

  const handleSearchChange = useCallback((meal, value) => {
    setSearchQueries((prev) => ({ ...prev, [meal]: value }));
  }, []);

  const toggleSearch = useCallback((meal) => {
    setOpenSearches((prev) => ({ ...prev, [meal]: !prev[meal] }));
  }, []);

  return (
    <>
      {foodItems.length > 0 && (
        <>
          {['breakfast', 'lunch', 'dinner'].map((meal) => (
            <div
              key={meal}
              className='flex flex-col h-full gap-2 p-2 text-black/80'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <p className='px-2 font-bold uppercase text-black/70'>
                    {meal}
                  </p>
                  <p className='px-2 text-sm text-gray-500'>
                    {filteredMealItems[meal].length} items
                  </p>
                </div>
                <div
                  className={`flex items-center justify-end p-1 px-2 rounded-lg ${
                    openSearches[meal] && 'bg-gray-100'
                  }`}
                >
                  <input
                    type='text'
                    className={`border border-transparent bg-transparent focus:ring-0 focus:outline-0 rounded transition-all duration-100 ${
                      openSearches[meal] ? 'w-full border-black/20' : 'w-0'
                    }`}
                    value={searchQueries[meal]}
                    placeholder='Search'
                    onChange={(e) => handleSearchChange(meal, e.target.value)}
                  />
                  {!openSearches[meal] ? (
                    <IconSearch
                      onClick={() => toggleSearch(meal)}
                      className='h-5 cursor-pointer text-black/60'
                    />
                  ) : (
                    <IconX
                      onClick={() => toggleSearch(meal)}
                      className='h-5 cursor-pointer text-black/40'
                    />
                  )}
                </div>
              </div>
              <div className='flex w-full h-48 gap-2 overflow-scroll scrollbar-none'>
                {filteredMealItems[meal].length > 0 ? (
                  filteredMealItems[meal].map((item, index) => (
                    <FoodCard
                      key={index}
                      voteItem={
                        voteItems?.length > 0 &&
                        voteItems?.find(
                          (el) =>
                            el.foodItem === item._id &&
                            el.meal === meal &&
                            el.groupId === groupId &&
                            new Date(el.createdAt)
                              .toISOString()
                              .split('T')[0] ===
                              new Date().toISOString().split('T')[0]
                        )
                      }
                      meal={meal}
                      foodItem={item}
                      groupId={groupId}
                      title={item.name}
                      description={item.name}
                    />
                  ))
                ) : (
                  <p className='px-2'>No items found</p>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}

export default Home;

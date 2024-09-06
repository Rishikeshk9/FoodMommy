'use client';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import FoodCard from '../../../components/FoodCard';
import { useGlobalContext } from '../../../contexts/globalContext';
import { IconChartBubbleFilled, IconSearch, IconX } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import {
  fetchGroupMembersByGroupId,
  getGroupById,
} from '../../../../_actions/groupAction';

function Home() {
  const { slug } = useParams();
  const groupId = slug[0];
  const { fetchFoodItems, fetchVoteItems, fetchVotesByGroup, voteItems } =
    useGlobalContext();
  const [group, setGroup] = useState(null);

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
  const [currentIndex, setCurrentIndex] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
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

    fetchData();
    setGroup(await getGroupById(groupId));
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

  const fetchData = async () => {
    await fetchVotesByGroup(groupId);
  };

  const filteredMealItems = useMemo(() => {
    const filtered = {};
    for (const [meal, items] of Object.entries(mealItems)) {
      filtered[meal] = items
        .filter((item) =>
          item.name.toLowerCase().includes(searchQueries[meal].toLowerCase())
        )
        .sort((a, b) => {
          if (voteItems && voteItems.length > 0) {
            // Sort by votes if voteItems exists
            const votesA = voteItems.filter(
              (vote) => vote.foodId === a._id
            ).length;
            const votesB = voteItems.filter(
              (vote) => vote.foodId === b._id
            ).length;
            if (votesA !== votesB) {
              return votesB - votesA; // Sort by votes in descending order
            }
          }
          // If voteItems doesn't exist or votes are equal, sort by name
          return a.name.localeCompare(b.name);
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

  const calculateHighestVotedItems = useCallback(() => {
    const highestVoted = {
      breakfast: null,
      lunch: null,
      dinner: null,
    };

    if (voteItems && voteItems.length > 0) {
      ['breakfast', 'lunch', 'dinner'].forEach((meal) => {
        const mealVotes = voteItems?.filter((vote) => vote.meal === meal);

        if (mealVotes.length > 0) {
          const voteCounts = mealVotes.reduce((acc, vote) => {
            acc[vote.foodItem] = (acc[vote.foodItem] || 0) + 1;
            return acc;
          }, {});

          const highestVotedId = Object.keys(voteCounts).reduce((a, b) =>
            voteCounts[a] > voteCounts[b] ? a : b
          );

          highestVoted[meal] =
            foodItems.find((item) => item._id === highestVotedId) || null;
        }
      });
    }
    console.log(highestVoted);
    return highestVoted;
  }, [voteItems, foodItems]);

  const [highestVotedItems, setHighestVotedItems] = useState({
    breakfast: null,
    lunch: null,
    dinner: null,
  });

  useEffect(() => {
    const highestVoted = calculateHighestVotedItems();
    setHighestVotedItems(highestVoted);
  }, [voteItems, foodItems, calculateHighestVotedItems]);

  return (
    <>
      {/* Top voted items section */}
      <div className='flex items-center justify-center w-full gap-2 p-4 text-center align-middle'>
        <h2 className='font-semibold text-black/70'>Select Date</h2>
        <input
          type='date'
          value={selectedDate.toISOString().split('T')[0]}
          className='p-1 bg-white border rounded text-black/70 stroke-black/70 fill-black/70'
          onChange={(e) => {
            const selectedDate = new Date(e.target.value);
            setSelectedDate(selectedDate);
            fetchVotesByGroup(groupId, selectedDate);
          }}
        />
      </div>

      <div className=''>
        <h2 className='text-2xl font-black text-center text-black uppercase drop-shadow-sm'>
          Choice of the Day
        </h2>
        <div className='flex justify-center fap-2'>
          {['breakfast', 'lunch', 'dinner'].map((meal) => (
            <div key={meal} className='p-4 bg-white rounded-lg '>
              <h3 className='text-lg font-semibold text-center capitalize text-black/70'>
                {meal}
              </h3>
              {highestVotedItems[meal] ? (
                <FoodCard
                  groupId={groupId}
                  meal={meal}
                  podium={true}
                  date={selectedDate}
                  foodItem={highestVotedItems[meal]}
                  voteItem={
                    voteItems &&
                    voteItems.length > 0 &&
                    voteItems.find(
                      (v) => v.foodItem === highestVotedItems[meal]._id
                    )
                  }
                />
              ) : (
                <div className='flex flex-col gap-2 text-xs font-semibold text-center text-gray-500'>
                  No votes yet
                  <div className='flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full '>
                    <IconChartBubbleFilled />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {foodItems.length > 0 && (
        <div className='mt-2 mb-4'>
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
              <div className='relative w-full h-48 overflow-x-auto scrollbar-none'>
                {filteredMealItems[meal].length > 0 ? (
                  <div className='flex items-center justify-start w-full h-full gap-4'>
                    {filteredMealItems[meal].map((item, index) => (
                      <div
                        key={index}
                        className='flex flex-shrink-0 gap-4 transition-all duration-300'
                      >
                        <FoodCard
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
                          date={selectedDate}
                          meal={meal}
                          foodItem={item}
                          groupId={groupId}
                          title={item.name}
                          description={item.name}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='bg-gray-100 rounded skeleton min-w-44 h-fit min-h-44 '></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className='flex flex-col items-center justify-center mb-24'>
        <p className='font-semibold text-center text-black/70'>
          Invite Your Friends for an Interesting Menu
        </p>
        <p className='text-center text-black/70'>
          Group Code: {group?.groupCode}
        </p>
      </div>
    </>
  );
}

export default Home;

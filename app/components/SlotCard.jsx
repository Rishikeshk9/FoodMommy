import React, { useEffect } from 'react';
import FoodCard from './FoodCard';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useGlobalContext } from '../contexts/globalContext';
const SlotCard = ({ data }) => {
  const [spin, setSpin] = React.useState(false);
  const { slug } = useParams(); // Get the params from the slug

  const handleSpin = () => {};
  const {
    foodItems,
    fetchFoodItems,
    voteItems,
    fetchVoteItems,
    fetchGroupItems,
    fetchVotesByGroup,
  } = useGlobalContext();
  const { data: session } = useSession();

  useEffect(() => {
    fetchFoodItems();
    fetchVoteItems();
  }, [data.groupId]);

  return (
    <div className='fixed z-10 flex items-center justify-center w-full h-screen p-5 align-middle bg-black/20'>
      <div className='flex flex-col max-w-sm gap-2 p-2 text-center text-black bg-white border rounded-lg'>
        <p className='font-bold'>BREAKFAST</p>
        <div
          className={`flex flex-col h-72  border-y-4  border-y-slate-200 border-x-4 border-x-slate-100 rounded-lg    overflow-scroll bg-slate-100 py-2 px-4 gap-2 scrollbar-none `}
        >
          <div className={`flex flex-col h-72   gap-4 ${spin ? 'spin' : ''}`}>
            <div className='flex flex-col items-center h-full gap-2 pb-4 font-bold align-middle rounded-lg min-h-48'>
              {foodItems.map((item, index) => (
                <FoodCard
                  key={index}
                  meal='breakfast'
                  foodItem={item}
                  groupId={data.groupId}
                  voteItem={
                    voteItems.length > 0 &&
                    voteItems?.find(
                      (el) =>
                        el.foodItem === item._id &&
                        el.meal === 'breakfast' &&
                        el.groupId === data.groupId &&
                        new Date(el.createdAt).toISOString().split('T')[0] ===
                          new Date().toISOString().split('T')[0]
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>
        <div className='flex items-baseline h-12 align-baseline'>
          <div
            className='w-full py-2 mt-auto font-bold transition-all duration-100 border-b-4 rounded-lg active:text-white text-lime-200 bg-lime-500 active:bg-lime-500 active:border-0 border-b-lime-600'
            onClick={() => {
              setSpin(true);
              setTimeout(() => {
                setSpin(false);
              }, 2000); // Adjust the time (in milliseconds) as needed
            }}
          >
            SPIN
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotCard;

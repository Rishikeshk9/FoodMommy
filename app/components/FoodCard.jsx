import React, { useEffect, useState } from 'react';
import VoteButton from './VoteButton';
import { IconPencil, IconTrash } from '@tabler/icons-react';

function FoodCard({ groupId, meal, index, adminPanel, foodItem, voteItem }) {
  const [image, setImage] = useState(foodItem.image);

  useEffect(() => {
    if (voteItem !== undefined) {
    }
  }, []);
  return (
    <div
      className={`aspect-square    min-w-44 h-fit  shadow-md   flex-col    transition-all duration-400 rounded   text-center align-middle items-center flex justify-center bg-white`}
    >
      <p className='font-semibold '>
        {foodItem.name} {index}
      </p>
      <div
        className={` flex w-full bg-gray-100 items-center align-middle justify-center flex-col  h-24 overflow-clip `}
      >
        <img className='object-cover w-full h-full ' src={image} />
      </div>

      {!adminPanel ? (
        <VoteButton
          meal={meal}
          groupId={groupId}
          itemId={foodItem._id}
          voteItem={voteItem}
        />
      ) : (
        <div className='flex justify-between '>
          <IconPencil className='text-black-700 hover:fill-black-500 active:scale-95' />
          <IconTrash className='text-black-700 hover:fill-black-500 active:scale-95' />
        </div>
      )}
    </div>
  );
}

export default FoodCard;

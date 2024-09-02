import React, { useEffect, useState } from 'react';
import VoteButton from './VoteButton';
import { IconPencil, IconTrash } from '@tabler/icons-react';

function FoodCard({
  date,
  groupId,
  meal,
  index,
  adminPanel,
  foodItem,
  voteItem,
  podium,
}) {
  useEffect(() => {
    if (voteItem !== undefined) {
    }
  }, []);
  return (
    <div
      className={` gap-2    h-fit ${
        !podium ? 'min-h-44' : ''
      }    w-fit max-h-44   flex-col    transition-all duration-400 rounded   text-center align-middle items-center flex justify-center  `}
    >
      <p
        className={`${
          podium && 'text-black/50'
        } truncate w-20   text-xs font-semibold`}
      >
        {foodItem.name}
      </p>

      <img
        className={`${
          podium ? 'w-24 h-24' : 'w-20 h-20'
        } rounded-full aspect-square object-cover bg-white p-1 drop-shadow-md`}
        src={foodItem.image}
      />
      {!adminPanel ? (
        <VoteButton
          podium={podium}
          meal={meal}
          date={date}
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

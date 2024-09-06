import {
  IconHeart,
  IconThumbDown,
  IconThumbDownFilled,
  IconThumbUp,
  IconThumbUpFilled,
} from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { saveVoteItem } from '../../_actions/voteAction';
import { useGlobalContext } from '../contexts/globalContext';
import CountUp from 'react-countup';
import dynamic from 'next/dynamic';

const AnimatedNumbers = dynamic(() => import('react-animated-numbers'), {
  ssr: false,
});

function VoteButton({ itemId, meal, groupId, voteItem, date }) {
  const { fetchVotesByGroup } = useGlobalContext();

  const { data: session } = useSession();
  const [voted, setVoted] = useState(
    voteItem?.voters?.includes(session?.user?.id)
  );

  const handleVote = async (vote) => {
    console.log(voteItem);
    const voteData = {
      _id: voteItem?._id,
      voteType: vote,
      voter: session.user.id.toString(),
      meal: meal,
      foodItem: itemId,
      userId: session.user.id,
      groupId: groupId,
    };

    saveVoteItem(voteData, date).then(async (result) => {
      if (result) {
        console.log('Vote created successfully:', result);
        // Handle success (e.g., navigate to group page, notify user)
        await fetchVotesByGroup(groupId, date);
      } else {
        console.error('Error creating group:', result);
        // Handle error (e.g., show error message to user)
      }
    });
  };

  useEffect(() => {
    setVoted(voteItem?.voters?.includes(session?.user?.id));
  }, [voteItem]);

  return (
    <div className='flex items-center justify-center w-full '>
      <div className='flex items-center justify-center w-10 h-10 text-center text-white uppercase align-middle rounded-full active:bg-red-500/10 aspect-square'>
        <IconHeart
          onClick={() => {
            handleVote(true);
            setVoted(!voted);
          }}
          className={`${'cursor-pointer'}  active:fill-red-500 active:scale-95 ${
            voted ? 'fill-red-500 text-red-600' : 'text-gray-600'
          }`}
        />
      </div>
      <div
        className={`${'cursor-pointer'}   active:fill-red-500 active:scale-95 ${
          voted ? 'fill-red-500 text-red-600' : 'text-gray-600'
        }`}
      >
        <AnimatedNumbers
          includeComma
          transitions={(index) => ({
            type: 'tween',
            duration: index + 0.2,
          })}
          animateToNumber={voteItem?.voters?.length || 0}
        />
      </div>
    </div>
  );
}

export default VoteButton;

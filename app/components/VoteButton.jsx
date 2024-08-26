import {
  IconHeart,
  IconThumbDown,
  IconThumbDownFilled,
  IconThumbUp,
  IconThumbUpFilled,
} from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { saveVoteItem } from '../../_actions/voteAction';
import { useGlobalContext } from '../contexts/globalContext';
import CountUp from 'react-countup';
import AnimatedNumbers from 'react-animated-numbers';

function VoteButton({ itemId, meal, groupId, voteItem }) {
  const { fetchVoteItems } = useGlobalContext();

  const { data: session } = useSession();

  const handleVote = async (vote) => {
    const voteData = {
      voteType: vote,
      negativeVoters: [],
      positiveVoters: [],
      meal: meal,
      foodItem: itemId,
      userId: session.user.id,
      groupId: groupId,
    };
    if (vote === true) {
      voteData.positiveVoters.push(session.user.id);
    } else {
      voteData.negativeVoters.push(session.user.id);
    }
    console.log('POSTING VOTE', voteData);
    saveVoteItem(voteData).then((result) => {
      fetchVoteItems();
      console.log(result);
      if (result.success) {
        console.log('Vote created successfully:', result.data);
        // Handle success (e.g., navigate to group page, notify user)
      } else {
        console.error('Error creating group:', result.errMsg);
        // Handle error (e.g., show error message to user)
      }
    });
  };

  return (
    <div className='flex items-center justify-center w-full '>
      <div className='flex items-center justify-center w-10 h-10 text-center text-white uppercase align-middle rounded-full active:bg-red-500/10 aspect-square'>
        <IconHeart
          onClick={() => {
            handleVote(true);
            fetchVoteItems();
          }}
          className={`cursor-pointer  active:fill-red-500 active:scale-95 ${
            voteItem?.positiveVoters?.includes(session?.user?.id)
              ? 'fill-red-500 text-red-600'
              : 'text-gray-600'
          }`}
        />
      </div>
      <div
        className={`cursor-pointer  active:fill-red-500 active:scale-95 ${
          voteItem?.positiveVoters?.includes(session?.user?.id)
            ? 'fill-red-500 text-red-600'
            : 'text-gray-600'
        }`}
      >
        <AnimatedNumbers
          includeComma
          transitions={(index) => ({
            type: 'tween',
            duration: index + 0.2,
          })}
          animateToNumber={voteItem?.positiveVoters?.length || 0}
        />
      </div>
    </div>
  );
}

export default VoteButton;

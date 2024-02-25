"use client"
// pages/join-group.js
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSupabaseContext } from '@/app/context/SupabaseProvider';

export default function JoinGroup() {
  const [groupId, setGroupId] = useState('');
 
  const supabaseStore = useSupabaseContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
   const { data,error } = await supabaseStore.addUserToGroup(groupId);
      console.log('Joined group:', data);
      console.error('Error joining group:', error);
      // Redirect to group page or show success message
     // router.push(`/group/${groupId}`);
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-2 p-4'>
      <input
        type="text"
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
        placeholder="Group ID"
        required
        className='input input-bordered w-full  '
      />
      <button type="submit"  className='btn btn-primary'>Join Group</button>
    </form>
  );
}

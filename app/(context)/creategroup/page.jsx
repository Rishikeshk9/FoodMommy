
'use client'
// pages/create-group.js
import { useState } from 'react';
import axios from 'axios';
import { useSupabaseContext } from '@/app/context/SupabaseProvider';

export default function CreateGroup() {
  const [groupName, setGroupName] = useState('');
  const supaStore = useSupabaseContext();
const [group, setGroup] = useState( );
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await supaStore.createGroup(groupName);
       
       await supaStore.addUserToGroup(data[0].group_id);

      setGroup(data[0]);
      // Redirect to group page or show success message
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-2 p-4'>
      <input
        type="text"
        className='input input-bordered w-full  '
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Group Name"
        required
      />
      <button type="submit" className='btn btn-primary'>Create Group</button>

      {group && (
        <div>
          <p className='text-white'>Group ID: {group.group_id}</p>
          <p>Group Name: {group.group_name}</p>
        </div>
      )}
    </form>
  );
}

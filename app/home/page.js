'use client';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../contexts/globalContext';
import { useSession } from 'next-auth/react';
import GroupsListItemUser from '../components/GroupsListItemUser';
import dynamic from 'next/dynamic';
import Modal from '../components/Modal';
import { createGroup } from '../../_actions/groupAction';
import { saveUserItem, updateUserItem } from '../../_actions/userAction';
import {
  IconCheckbox,
  IconSquareCheck,
  IconSquareCheckFilled,
} from '@tabler/icons-react';

const HomeComponent = () => {
  const { fetchGroupItems, fetchUserItems, groupItems, userData } =
    useGlobalContext();
  const { data: session } = useSession();
  const [groupName, setGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const [anyoneCanJoin, setAnyoneCanJoin] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id) {
        try {
          const user = await fetchUserItems(session?.user?.id);
          await fetchGroupItems(user?.groups);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false); // Set loading to false once data is fetched
        }
      }
    };
    fetchData();
  }, [session]);

  const handleCreateGroup = async () => {
    const groupData = {
      name: groupName,
      description: 'description',
      createdBy: session?.user?.id,
      members: [session?.user?.id],
      admins: [session?.user?.id],
    };
    console.log('CREATING GROUP', groupData);
    const result = await createGroup(groupData);

    if (result) {
      console.log('Group created successfully:', result);

      if (userData && result._id) {
        const updatedUserData = {
          ...userData,
          groups: [...(userData.groups || []), result._id],
        };

        try {
          const updatedUser = await updateUserItem(
            session?.user?.id,
            updatedUserData
          );
          await fetchUserItems(session?.user?.id);
          await fetchGroupItems(updatedUser.groups);
          console.log('User groups updated successfully', updatedUser);
        } catch (error) {
          console.error('Error updating user groups:', error);
        }
      }
    } else {
      console.error('Error creating group:', result.errMsg);
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center w-full h-screen'>
        <p className='text-2xl font-bold text-black/70'>...</p>
      </div>
    );
  }

  return userData?._id && groupItems !== undefined ? (
    <div className='w-full h-screen bg-white'>
      {/* First Part */}
      {groupItems.length > 0 &&
        groupItems.map((group) => (
          <div key={group._id} className='flex flex-col gap-4'>
            {group.members.includes(session?.user?.id) ? (
              <GroupsListItemUser group={group} />
            ) : null}
          </div>
        ))}

      {/* Second Part */}
      {groupItems.length === 0 && (
        <div className='flex flex-col items-center justify-center h-full gap-2'>
          <div>
            <p className='text-2xl font-bold text-black/70'>
              👋🏻 Welcome {userData?.name}
            </p>
          </div>
          <div className='flex h-12'>
            <div
              onClick={() => {
                const groupId = prompt('Enter the group ID:');
                if (groupId) {
                  console.log('Joining group with ID:', groupId);
                }
              }}
              className='px-4 py-2 mt-auto font-bold uppercase transition-all duration-100 ease-in-out border-b-4 rounded-lg cursor-pointer text-slate-400 bg-slate-200 border-b-slate-400 hover:bg-slate-300 active:bg-slate-400 active:text-white active:border-0'
            >
              Join Group
            </div>
          </div>
          <p className='font-bold uppercase text-slate-300'>or</p>
          <Modal
            trigger={
              <div className='flex h-12'>
                <div className='px-4 py-2 mt-auto font-bold uppercase transition-all duration-100 ease-in-out border-b-4 rounded-lg cursor-pointer text-slate-400 bg-slate-200 border-b-slate-400 hover:bg-slate-300 active:bg-slate-400 active:text-white active:border-0'>
                  Create Group
                </div>
              </div>
            }
            content={
              <div className='flex flex-col gap-2 text-black'>
                <input
                  type='text'
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder='Group Name'
                  className='px-4 py-2 font-bold rounded-lg text-black/60 bg-slate-200 focus:outline-none'
                />
                <div className='flex justify-between w-full h-12'>
                  <div className='flex items-center w-full align-middle '>
                    <div className='flex items-center'>
                      <div
                        onClick={() => setAnyoneCanJoin(!anyoneCanJoin)}
                        className='w-6 h-6 bg-gray-200 rounded-md'
                      >
                        {anyoneCanJoin ? (
                          <IconSquareCheckFilled className='w-6 h-6 text-lime-500' />
                        ) : (
                          ''
                        )}
                      </div>
                      <label
                        htmlFor='anyoneCanJoin'
                        className='ml-2 text-sm font-medium text-black/50'
                      >
                        Anyone can join
                      </label>
                    </div>
                  </div>
                  <div
                    onClick={handleCreateGroup}
                    className={`px-4 py-2 w-full text-center mt-auto font-bold uppercase transition-all duration-100 ease-in-out rounded-lg cursor-pointer ${
                      groupName.length > 0
                        ? 'bg-lime-300 border-b-4  text-lime-500 border-b-lime-400  active:text-white active:border-0 '
                        : 'text-slate-400 bg-slate-100'
                    }`}
                  >
                    Create
                  </div>
                </div>
              </div>
            }
          />
        </div>
      )}
    </div>
  ) : null;
};

export default HomeComponent;

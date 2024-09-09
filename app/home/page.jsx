'use client';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../contexts/globalContext';
import { useSession } from 'next-auth/react';
import GroupsListItemUser from '../components/GroupsListItemUser';
import dynamic from 'next/dynamic';
import Modal from '../components/Modal';
import { createGroup, joinGroup } from '../../_actions/groupAction';
import { saveUserItem, updateUserItem } from '../../_actions/userAction';
import {
  IconCheckbox,
  IconSquareCheck,
  IconSquareCheckFilled,
} from '@tabler/icons-react';

const Page = () => {
  const { fetchGroupItems, fetchUserItems, groupItems, userData } =
    useGlobalContext();
  const { data: session } = useSession();
  const [groupName, setGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const [anyoneCanJoin, setAnyoneCanJoin] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateGroup = async () => {
    const groupCode = generateUniqueCode(6);
    const groupData = {
      name: groupName,
      description: 'description',
      createdBy: session?.user?.id,
      members: [session?.user?.id],
      admins: [session?.user?.id],
      groupCode: groupCode,
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setGroupName('');
    setAnyoneCanJoin(true);
  };

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

  const generateUniqueCode = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  // Generate a 6-character code

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
          <>
            <div key={group._id} className='flex flex-col gap-4'>
              {group.members.includes(session?.user?.id) ? (
                <GroupsListItemUser group={group} />
              ) : null}
            </div>
          </>
        ))}
      <div className='absolute flex items-center justify-center w-full h-12 bottom-16 '></div>
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
              onClick={async () => {
                const groupId = prompt('Enter the group ID:');
                if (groupId) {
                  console.log('Joining group with ID:', groupId);
                  joinGroup(groupId, session?.user?.id).then(() => {
                    fetchUserItems(session?.user?.id).then((userData) => {
                      fetchGroupItems(userData?.groups);
                    });
                  });
                }
              }}
              className='px-4 py-2 mt-auto font-bold uppercase transition-all duration-100 ease-in-out border-b-4 rounded-lg cursor-pointer text-slate-400 bg-slate-200 border-b-slate-400 hover:bg-slate-300 active:bg-slate-400 active:text-white active:border-0'
            >
              Join Group
            </div>
          </div>
          <p className='font-bold uppercase text-slate-300'>or</p>
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            trigger={
              <div className='flex h-12' onClick={() => setIsModalOpen(true)}>
                <div className='px-4 py-2 mt-auto font-bold uppercase transition-all duration-100 ease-in-out border-b-4 rounded-lg cursor-pointer text-slate-400 bg-slate-200 border-b-slate-400 hover:bg-slate-300 active:bg-slate-400 active:text-white active:border-0'>
                  Create Group
                </div>
              </div>
            }
            content={
              <div className='flex flex-col w-full gap-2 text-black '>
                <div className='flex items-center justify-between'>
                  <h2 className='text-lg font-bold'>Create Group</h2>
                  <button
                    onClick={handleCloseModal}
                    className='text-black/50 hover:text-black'
                  >
                    ✕
                  </button>
                </div>
                <input
                  type='text'
                  onChange={(e) => setGroupName(e.target.value.trimStart())}
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
                    onClick={() => {
                      handleCreateGroup();
                      handleCloseModal();
                    }}
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

export default Page;

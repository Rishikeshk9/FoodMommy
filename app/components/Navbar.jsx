import Link from 'next/link';
import React, { useState } from 'react';
import {
  IconHome,
  IconPlus,
  IconSettings,
  IconSquareCheckFilled,
  IconUser,
  IconUsersGroup,
} from '@tabler/icons-react';
import { useGlobalContext } from '../contexts/globalContext';

import { useSession } from 'next-auth/react';
import GroupsListItemUser from './GroupsListItemUser';
import dynamic from 'next/dynamic';
import Modal from './Modal';
import { createGroup, joinGroup } from '../../_actions/groupAction';
import { saveUserItem, updateUserItem } from '../../_actions/userAction';

function Navbar() {
  const { fetchGroupItems, fetchUserItems, groupItems, userData } =
    useGlobalContext();
  const { data: session } = useSession();
  const [groupName, setGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const [anyoneCanJoin, setAnyoneCanJoin] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setGroupName('');
    setAnyoneCanJoin(true);
  };

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

  return (
    <nav className='relative'>
      <div className='flex justify-between p-3'>
        <Link href='/' className='flex items-center'>
          {/* Replace the brand text with the logo image */}
          <img src='/logo.svg' alt='KayKhau Logo' className='w-auto h-5' />
        </Link>

        <div className='flex items-center justify-between gap-2 text-sm font-semibold rounded-lg'>
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
            className='px-2 py-1 font-bold uppercase transition-all duration-100 ease-in-out border rounded-lg cursor-pointer text-slate-400 active:text-white hover:text-lime-600 hover:bg-lime-300 active:bg-lime-400'
          >
            Join Group
          </div>
          <div className='flex items-center justify-between text-sm font-semibold uppercase rounded-lg'>
            <Modal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              trigger={
                <div
                  onClick={() => setIsModalOpen(true)}
                  className='px-2 py-1 font-bold uppercase transition-all duration-100 ease-in-out border rounded-lg cursor-pointer text-slate-400 active:text-white hover:text-lime-600 hover:bg-lime-300 active:bg-lime-400'
                >
                  <IconPlus className='w-5 h-5' />
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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

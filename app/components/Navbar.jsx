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
import GroupsListItemUser from '../components/GroupsListItemUser';
import dynamic from 'next/dynamic';
import Modal from '../components/Modal';
import { createGroup, joinGroup } from '../../_actions/groupAction';
import { saveUserItem, updateUserItem } from '../../_actions/userAction';

function Navbar() {
  const { fetchGroupItems, fetchUserItems, groupItems, userData } =
    useGlobalContext();
  const { data: session } = useSession();
  const [groupName, setGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const [anyoneCanJoin, setAnyoneCanJoin] = useState(true);

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
    <>
      <div className='sticky top-0 w-full px-4 align-middle  items-center pb-2 bg-white border-b border-b-[#1e293b4e] text-black z-50 justify-between flex'>
        <Link className='text-xl font-bold' href='/home'>
          KayKhau
        </Link>
        <div className='flex items-center justify-between text-sm font-semibold rounded-lg'>
          <Modal
            trigger={
              <div className='flex h-12 '>
                <div className='px-4 py-2 mt-auto font-bold uppercase transition-all duration-100 ease-in-out border-b-4 rounded-lg cursor-pointer text-slate-400 bg-slate-200 border-b-slate-400 hover:bg-slate-300 active:bg-slate-400 active:text-white active:border-0'>
                  Create Group
                </div>
              </div>
            }
            content={
              <div className='flex flex-col gap-2 text-black '>
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
      </div>

      {session && (
        <div className='fixed bottom-0 left-0 right-0 flex justify-around w-full p-2 bg-white border-t border-t-[#1e293b4e] '>
          <Link href='/home' className='text-gray-500 hover:text-black'>
            <IconHome />
          </Link>

          <Link href='/home/account' className='text-gray-500 hover:text-black'>
            <IconUser />
          </Link>
        </div>
      )}
    </>
  );
}

export default Navbar;

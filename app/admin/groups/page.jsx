'use client';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../contexts/globalContext';
import { createGroup } from '../../../_actions/groupAction';
import GroupListItem from '../../components/GroupListItem';
import { IconPlus, IconRefresh, IconX } from '@tabler/icons-react';

export default function Page() {
  const { groupItems, fetchGroupItems, fetchUserItems, userItems } =
    useGlobalContext();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchGroupItems();
    fetchUserItems();
    return () => {};
  }, []);

  return (
    <div className='flex flex-col h-full text-black/80 '>
      <FormModal showModal={showModal} setShowModal={setShowModal} />
      <div className='flex items-center justify-between p-2 align-middle'>
        <p className='flex gap-2 px-2 font-bold uppercase'>
          All Groups{' '}
          <IconRefresh
            className='transition-all cursor-pointer active:rotate-180 active:text-green-700 duration-250 '
            onClick={() => fetchGroupItems()}
          />
        </p>

        <div
          onClick={() => setShowModal(!showModal)}
          className='flex p-1 px-2 text-white bg-blue-500 border border-blue-700 rounded cursor-pointer active:bg-blue-700'
        >
          Add New
        </div>
      </div>
      <div className='flex flex-col '>
        {groupItems &&
          groupItems.length > 0 &&
          groupItems
            .slice() // Create a shallow copy of the array to avoid mutating the original array
            .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by name
            .map((el, index) => (
              <GroupListItem
                id={el._id}
                adminPanel={true}
                key={index}
                index={index}
                title={el.name}
                description={el.name}
              />
            ))}
      </div>
    </div>
  );

  function FormModal({ showModal, setShowModal }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [createdBy, setCreatedBy] = useState('');

    const handleNameChange = (event) => {
      setName(event.target.value);
    };

    const handleDescriptionChange = (event) => {
      setDescription(event.target.value);
    };

    const handleCreatedByChange = (event) => {
      console.log(event.target.value);
      setCreatedBy(event.target.value);
    };

    const handleCreateGroup = async () => {
      const groupData = {
        name: name,
        description: description,
        createdBy: createdBy,
        members: [createdBy],
        admins: [createdBy],
      };
      console.log('CREATING GROUP', groupData);
      const result = await createGroup(groupData);

      console.log(result);
      if (result.success) {
        console.log('Group created successfully:', result.data);
        // Handle success (e.g., navigate to group page, notify user)
      } else {
        console.error('Error creating group:', result.errMsg);
        // Handle error (e.g., show error message to user)
      }
    };

    return (
      showModal && (
        <div className='absolute top-0 flex items-center justify-center w-full h-screen mx-auto text-center align-middle md:p-4 bg-black/10 backdrop-blur-md'>
          <div className='flex flex-col w-full gap-2 p-4 mx-auto mt-auto bg-white border md:rounded-lg border-neutral-200 text-black/80 md:max-w-md'>
            <input
              className='p-2 border rounded'
              type='text'
              value={name}
              onChange={handleNameChange}
              placeholder='Name'
            />
            <label for='cars'>Choose Admin:</label>

            <select onChange={handleCreatedByChange} name='userName' id='cars'>
              <option disabled selected value=''>
                Select a user
              </option>
              {userItems &&
                userItems.length > 0 &&
                userItems.map((el, index) => (
                  <option value={el._id}>{el.name}</option>
                ))}
            </select>
            <input
              className='p-2 border rounded'
              type='text'
              value={createdBy}
              onChange={handleCreatedByChange}
              placeholder='Creator userName'
            />
            <input
              className='p-2 border rounded'
              type='text'
              value={description}
              onChange={handleDescriptionChange}
              placeholder='Description'
            />

            <div className='flex gap-2'>
              <button
                className='w-full   rounded p-2 text-gray-400 active:text-red-500 active:scale-[0.99] transition-all duration-100'
                onClick={() => setShowModal(!showModal)}
              >
                Cancel
              </button>
              <button
                className='w-full bg-green-400 rounded p-2 text-white border border-green-500 hover:bg-green-500 active:scale-[0.99] transition-all duration-100'
                onClick={handleCreateGroup}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )
    );
  }
}

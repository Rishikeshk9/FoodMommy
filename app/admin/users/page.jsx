'use client';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../contexts/globalContext';
import { saveUserItem } from '../../../_actions/userAction';
import UserListItem from '../../components/UserListItem';
import { IconPlus, IconRefresh, IconX } from '@tabler/icons-react';

export default function Page() {
  const { userItems, fetchUserItems } = useGlobalContext();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUserItems();

    return () => {};
  }, []);

  return (
    <div className='flex flex-col h-full text-black/80 '>
      <FormModal showModal={showModal} setShowModal={setShowModal} />
      <div className='flex items-center justify-between p-2 align-middle'>
        <p className='flex gap-2 px-2 font-bold uppercase'>
          All Users{' '}
          <IconRefresh
            className='transition-all cursor-pointer active:rotate-180 active:text-green-700 duration-250 '
            onClick={() => fetchUserItems()}
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
        {userItems &&
          userItems.length > 0 &&
          userItems
            .slice() // Create a shallow copy of the array to avoid mutating the original array
            .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by name
            .map((el, index) => (
              <UserListItem
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
    const [userName, setUserName] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleNameChange = (event) => {
      setName(event.target.value);
    };

    const handleUsernameChange = (event) => {
      setUserName(event.target.value);
    };

    const handleImageUrlChange = (event) => {
      setImageUrl(event.target.value);
    };

    const handleSaveUserItem = async () => {
      const userItem = {
        name: name,
        userName: userName,
        imageUrl: imageUrl,
      };

      const result = await saveUserItem(userItem);

      if (result.success) {
        console.log('Food item saved successfully:', result.data);
        // Handle success (e.g., update UI, notify user)
      } else {
        console.error('Error saving food item:', result.errMsg);
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
            <input
              className='p-2 border rounded'
              type='text'
              value={imageUrl}
              onChange={handleImageUrlChange}
              placeholder='Image URL'
            />
            <input
              className='p-2 border rounded'
              type='text'
              value={userName}
              onChange={handleUsernameChange}
              placeholder='Username'
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
                onClick={handleSaveUserItem}
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

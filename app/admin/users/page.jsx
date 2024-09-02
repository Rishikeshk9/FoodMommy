'use client';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../contexts/globalContext';
import { saveUserItem } from '../../../_actions/userAction';
import UserListItem from '../../components/UserListItem';
import { IconPlus, IconRefresh, IconX } from '@tabler/icons-react';

export default function Admin() {
  const { userItems, fetchUserItems } = useGlobalContext();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUserItems();

    return () => {};
  }, []);

  return (
    <div
      className='flex flex-col  h-full   text-black/80
    '
    >
      <FormModal showModal={showModal} setShowModal={setShowModal} />
      <div className='flex justify-between p-2 items-center align-middle'>
        <p className='font-bold uppercase px-2 flex gap-2'>
          All Users{' '}
          <IconRefresh
            className='active:rotate-180 active:text-green-700  cursor-pointer   transition-all duration-250  '
            onClick={() => fetchUserItems()}
          />
        </p>

        <div
          onClick={() => setShowModal(!showModal)}
          className='bg-blue-500 border border-blue-700 active:bg-blue-700 flex rounded  p-1 px-2 cursor-pointer text-white'
        >
          Add New
        </div>
      </div>
      <div className='flex flex-col    '>
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
        <div className='absolute top-0  md:p-4  w-full h-screen items-center flex   align-middle justify-center  text-center mx-auto bg-black/10 backdrop-blur-md'>
          <div className='bg-white mt-auto md:rounded-lg flex flex-col border border-neutral-200 p-4 text-black/80 gap-2 w-full mx-auto md:max-w-md'>
            <input
              className='border rounded p-2'
              type='text'
              value={name}
              onChange={handleNameChange}
              placeholder='Name'
            />
            <input
              className='border rounded p-2'
              type='text'
              value={imageUrl}
              onChange={handleImageUrlChange}
              placeholder='Image URL'
            />
            <input
              className='border rounded p-2'
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

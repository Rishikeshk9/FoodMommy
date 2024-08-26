'use strict';
import React, { useEffect, useState } from 'react';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { deleteUserItem, updateUserItem } from '../../_actions/userAction';

function UserListItem({ id, title, description, index, adminPanel }) {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <FormModal showModal={showModal} setShowModal={setShowModal} item={id} />
      <DeleteForm
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        item={id}
      />

      <div
        className={`  w-full   cursor-pointer  border    justify-between     transition-all duration-400   text-center align-middle items-center flex px-4 py-2 hover:bg-black/5`}
      >
        <div
          className={` flex items-center align-middle  gap-2      overflow-clip `}
        >
          <p className='whitespace-nowrap'>{title}</p>
        </div>

        <div className='flex justify-between gap-2 '>
          <IconPencil
            onClick={() => setShowModal(true)}
            className='text-gray-500 hover:text-blue-500 active:scale-95'
          />

          <IconTrash
            onClick={() => setShowDeleteModal(true)}
            className='text-gray-500 hover:text-red-500 active:scale-95 '
          />
        </div>
      </div>
    </>
  );
}

export default UserListItem;

function FormModal({ showModal, setShowModal, item }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [newDetails, setNewDetails] = useState({
    name: name,
    description: description,
    imageUrl: imageUrl,
  });
  const handleNameChange = (event) => {
    setName(event.target.value);
    setNewDetails({ ...newDetails, name: event.target.value });
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
    setNewDetails({ ...newDetails, description: event.target.value });
  };

  const handleImageUrlChange = (event) => {
    setImageUrl(event.target.value);
    setNewDetails({ ...newDetails, imageUrl: event.target.value });
  };

  const handleUpdateUserItem = async () => {
    console.log(item, newDetails);
    const result = await updateUserItem(item, newDetails);

    if (result.success) {
      console.log('User item updated successfully:', result.data);
      // Handle success (e.g., update UI, notify user)
    } else {
      console.error('Error updating food item:', result.errMsg);
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
              onClick={handleUpdateUserItem}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  );
}

function DeleteForm({ showDeleteModal, setShowDeleteModal, item }) {
  const handleDeleteUserItem = async (foodId) => {
    const result = await deleteUserItem(foodId);

    if (result.success) {
      console.log('User item deleted successfully:', result.data);
      // Handle success (e.g., update UI, notify user)
    } else {
      console.error('Error deleting food item:', result.errMsg);
      // Handle error (e.g., show error message to user)
    }
  };
  return (
    showDeleteModal && (
      <div className='absolute top-0 flex items-center justify-center w-full h-screen mx-auto text-center align-middle md:p-4 bg-black/10 backdrop-blur-md'>
        <div className='flex flex-col w-full gap-2 p-4 mx-auto mt-auto bg-white border md:rounded-lg border-neutral-200 text-black/80 md:max-w-md'>
          <p className='text-red-400'>
            Are you sure you want to Delete {item?.name}?
          </p>
          <div className='flex gap-2'>
            <button
              className='w-full   rounded p-2 text-gray-400 active:text-green-500 active:scale-[0.99] transition-all duration-100'
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button
              className='w-full bg-red-400 rounded p-2 text-white border border-red-500 hover:bg-red-500 active:scale-[0.99] transition-all duration-100'
              onClick={() => handleDeleteUserItem(item)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  );
}

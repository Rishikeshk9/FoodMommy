'use client';
import React, { useEffect, useState } from 'react';
import VoteButton from './VoteButton';
import axios, { isCancel, AxiosError } from 'axios';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { deleteGroupItem, updateGroupItem } from '../../_actions/groupAction';

function GroupListItem({ id, title, description, index, adminPanel }) {
  const [image, setImage] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  useEffect(() => {
    !image &&
      axios
        .get('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(function (response) {
          setImage(response.data.meals[0].strMealThumb);
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          // always executed
        });

    return () => {};
  }, []);

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
          <img className='   rounded-full h-12 w-full' src={image} />
          <p className='whitespace-nowrap'>{title}</p>
        </div>
        {!adminPanel ? (
          <VoteButton title={description} />
        ) : (
          <div className='justify-between flex gap-2 '>
            <IconPencil
              onClick={() => setShowModal(true)}
              className='text-gray-500 hover:text-blue-500 active:scale-95'
            />

            <IconTrash
              onClick={() => setShowDeleteModal(true)}
              className='text-gray-500 hover:text-red-500 active:scale-95  '
            />
          </div>
        )}
      </div>
    </>
  );
}

export default GroupListItem;

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

  const handleUpdateGroupItem = async () => {
    console.log(item, newDetails);
    const result = await updateGroupItem(item, newDetails);

    if (result.success) {
      console.log('Group item updated successfully:', result.data);
      // Handle success (e.g., update UI, notify user)
    } else {
      console.error('Error updating group item:', result.errMsg);
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
              onClick={handleUpdateGroupItem}
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
  const handleDeleteGroupItem = async (groupId) => {
    const result = await deleteGroupItem(groupId);

    if (result.success) {
      console.log('Group item deleted successfully:', result.data);
      // Handle success (e.g., update UI, notify user)
    } else {
      console.error('Error deleting group item:', result.errMsg);
      // Handle error (e.g., show error message to user)
    }
  };
  return (
    showDeleteModal && (
      <div className='absolute top-0  md:p-4  w-full h-screen items-center flex   align-middle justify-center  text-center mx-auto bg-black/10 backdrop-blur-md'>
        <div className='bg-white mt-auto md:rounded-lg flex flex-col border border-neutral-200 p-4 text-black/80 gap-2 w-full mx-auto md:max-w-md'>
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
              onClick={() => handleDeleteGroupItem(item)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  );
}

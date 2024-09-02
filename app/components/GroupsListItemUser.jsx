'use strict';
import React, { useEffect, useState } from 'react';
import VoteButton from './VoteButton';
import axios, { isCancel, AxiosError } from 'axios';
import {
  IconBurger,
  IconPencil,
  IconTrash,
  IconUsers,
  IconUsersGroup,
} from '@tabler/icons-react';
import Link from 'next/link';

function GroupsListItemUser({ group }) {
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
      <Link
        href={`home/group/${group?._id}`}
        className={`w-full gap-2  cursor-pointer  border        transition-all duration-400   text-center align-middle items-center flex px-4 py-2 hover:bg-black/5`}
      >
        <div
          className={`flex items-center align-middle h-12 w-12 bg-gray-200 rounded-full  gap-2      overflow-clip `}
        >
          <img className='w-full h-12 rounded-full ' src={image} />
        </div>
        <div className='flex flex-col text-left'>
          <p className='font-bold text-black/70'>{group?.name}</p>
          <p className='flex items-center text-xs text-gray-400 align-middle'>
            #{group?.groupCode}
          </p>
        </div>
      </Link>
    </>
  );
}

export default GroupsListItemUser;

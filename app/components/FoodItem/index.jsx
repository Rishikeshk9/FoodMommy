import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import ReactCurvedText from 'react-curved-text';
import axios from 'axios';

function FoodItem({itemId}) {
    const [item, setItem] = useState({ itemName: '', itemImage: '' });

    useEffect(() => {
        axios.get('https://api.example.com/item')
          .then(response => {
            // Assuming the response has the data in the format { itemName: '...', itemImage: '...' }
            setItem(response.data);
          })
          .catch(error => {
            console.error('There was an error!', error);
          });
      }, [itemId]);
    
    

  return (
    <div className='  rounded-md p-4 flex flex-col gap-4 text-center'>
        <p className='text-lg font-bold arc-text'>{item.itemName}</p>
        <Image className='rounded-full aspect-square' height={200} width={200} src={item.itemImage} alt={item.itemName}/>
        
    </div>
  ) 
}

export default FoodItem
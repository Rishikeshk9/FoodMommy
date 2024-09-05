import React, { useState } from 'react';

export default function Modal({ isOpen, onClose, trigger, content }) {
  if (!isOpen) {
    return trigger;
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white p-4 rounded-lg'>{content}</div>
    </div>
  );
}

import React, { useState } from 'react';

export default function Modal({ isOpen, onClose, trigger, content }) {
  if (!isOpen) {
    return trigger;
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='p-4 bg-white rounded-lg'>{content}</div>
    </div>
  );
}

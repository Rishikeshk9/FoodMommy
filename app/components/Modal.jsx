import React, { useState } from 'react';

const Modal = ({ content, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsOpen(true)}> {trigger}</div>
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-end justify-center h-screen md:items-center bg-black/50'>
          <div className='z-10 w-full max-w-md p-5 bg-white rounded-lg'>
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;

'use client';
import React from 'react';
import Navbar from '../components/Navbar';

const layout = ({ children }) => {
  return (
    <div className='bg-white '>
      <Navbar />
      {children}
    </div>
  );
};

export default layout;

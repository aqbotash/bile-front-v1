'use client'
import React from 'react';

interface YellowButtonProps {
  text: string;
  onClick?: () => void; // Optional onClick prop for handling click events
}

const YellowButton: React.FC<YellowButtonProps> = ({ text, onClick }) => {
  return (
    <div
      className='bg-custom-yellow flex lg:text-4xl md:text-2xl sm:text-lg text-md md:p-2 p-1 items-center justify-center text-black cursor-pointer' 
      onClick={onClick} // Handle the click event
    >
      {text}
    </div>
  );
};

export default YellowButton;
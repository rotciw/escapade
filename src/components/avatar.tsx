import React from 'react';

const Avatar: React.FC<{
  eyes: number;
  mouth: number;
  color: number;
  name: string;
  currentPlayer: boolean;
}> = ({ eyes, mouth, color, name, currentPlayer }) => {
  return (
    <div className='flex flex-col items-center w-min'>
      <div className={`relative object-cover w-16 h-16`}>
        <img className='select-none' src={`./images/characters/color/${color}.svg`} />
        <img className='absolute top-0 select-none' src={`./images/characters/eyes/${eyes}.svg`} />
        <img
          className='absolute top-0 select-none'
          src={`./images/characters/mouth/${mouth}.svg`}
        />
      </div>
      <p className='w-full mt-2 font-bold text-center text-independence'>{name}</p>
      <p className='text-center text-independence'>{currentPlayer ? '(deg)' : ''}</p>
    </div>
  );
};

export default Avatar;

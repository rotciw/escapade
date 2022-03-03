import React from 'react';

const AvatarHead: React.FC<{
  head: number;
  color: number;
  name: string;
  currentPlayer: boolean;
}> = ({ head, color, name, currentPlayer }) => {
  return (
    <div className='flex flex-col items-center w-min'>
      <div className={`relative object-cover w-24 h-16`}>
        <img className='select-none' src={`./images/characters/head_bg/${color}.svg`} />
        <img
          className='absolute top-0 select-none'
          src={`./images/characters/head_fg/${head}.svg`}
        />
      </div>
      <p className='w-full mt-2 font-bold text-center text-independence'>{name}</p>
      <p className='text-center text-independence'>{currentPlayer ? '(deg)' : ''}</p>
    </div>
  );
};

export default AvatarHead;
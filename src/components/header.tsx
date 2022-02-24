import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <header className='sticky top-0 flex justify-center '>
        <h1
          className='py-2 mt-5 text-5xl font-bold text-alice-blue hover:cursor-pointer w-fit'
          onClick={() => navigate('/')}
        >
          Escapade
        </h1>
      </header>
    </>
  );
};

export default Header;

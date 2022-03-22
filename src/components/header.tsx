import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <header className='top-0 flex justify-center '>
        <h1 className='py-1 mt-5 text-5xl font-bold text-alice-blue w-fit'>Escapade</h1>
      </header>
    </>
  );
};

export default Header;

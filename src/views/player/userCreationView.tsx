import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../helpers/firebase';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const UserCreationView: React.FC = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [value, setValue] = useLocalStorage('gameCode', '');

  const joinGame = async () => {
    const playerInfo = { ready: false, name: playerName };
    await updateDoc(doc(db, 'games', value), { participants: [playerInfo] });
  };
  console.log(value);
  const onInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    setPlayerName(event.currentTarget.value);
  };

  return (
    <>
      <div className='flex flex-col items-center justify-evenly'>
        <div className='my-4 text-center'>
          <h1 className='my-12 text-6xl font-bold text-center text-alice-blue'>Escapade</h1>
          <input
            className='px-4 py-2 text-black uppercase transition-all border rounded placeholder-normal border-independence focus:outline-none focus:shadow-sm focus:ring-magic-mint outline-colorful-blue'
            type='text'
            value={playerName}
            onChange={onInputChange}
            placeholder='Skriv inn navn'
          />
        </div>
        <button className='btn-sm' onClick={() => navigate('/')}>
          Gå tilbake
        </button>
        <button className='btn-sm' onClick={() => joinGame()}>
          Bli med
        </button>
      </div>
    </>
  );
};

export default UserCreationView;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../helpers/firebase';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const BaseGameView: React.FC = () => {
  const navigate = useNavigate();
  const [gameCode, setGameCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [localStorageValue, setLocalStorageValue] = useLocalStorage('gameCode', '');

  const onInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    setGameCode(event.currentTarget.value);
  };

  const joinGameLobby = async () => {
    // Join a lobby only if code exists
    if (gameCode) {
      const docRef = doc(db, 'games', gameCode);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLocalStorageValue(gameCode);
        navigate('/customize');
      } else {
        console.error('Invalid game code');
        setErrorMessage('Koden er ikke gyldig.');
      }
    } else {
      return;
    }
  };

  return (
    <>
      <div className='flex flex-col items-center h-screen justify-evenly'>
        <div className='my-4'>
          <h1 className='my-12 text-6xl font-bold text-center text-alice-blue'>Escapade</h1>
          <input
            className='px-4 py-2 mr-2 text-black uppercase transition-all border rounded placeholder-normal border-independence focus:outline-none focus:shadow-sm focus:ring-magic-mint outline-colorful-blue'
            type='text'
            value={gameCode}
            onChange={onInputChange}
            placeholder='Kode for spillet'
          />
          <button className='btn-sm' onClick={() => joinGameLobby()}>
            Bli med
          </button>
          {errorMessage ? <p>{errorMessage}</p> : <p>&nbsp;</p>}
        </div>
        <div className='flex flex-col items-center justify-center'>
          <p className='mb-2'>Lag din egen Escapade</p>
          <button className='btn-lg' onClick={() => navigate('/create')}>
            Lag et spill
          </button>
        </div>
      </div>
    </>
  );
};

export default BaseGameView;

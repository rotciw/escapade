import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../helpers/firebase';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const BaseGameView: React.FC = () => {
  const navigate = useNavigate();
  const [gameCode, setGameCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [shakeAnimation, setShakeAnimation] = useState(false);
  const [localStorageValue, setLocalStorageValue] = useLocalStorage('gameCode', '');

  const joinGameLobby = async () => {
    // Join a lobby only if code exists
    if (gameCode) {
      const docRef = doc(db, 'games', gameCode);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().canJoin) {
        setLocalStorageValue(gameCode);
        navigate('/customize');
      } else {
        console.error('Invalid game code');
        setErrorMessage('Koden er ikke gyldig.');
        setShakeAnimation(true);
      }
    } else {
      setErrorMessage('Du må oppgi en kode.');
      setShakeAnimation(true);
    }
  };

  const onInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    setGameCode(event.currentTarget.value.toUpperCase());
  };

  const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == 'Enter') {
      joinGameLobby();
    }
  };

  return (
    <>
      <div className='flex flex-col items-center h-screen justify-evenly'>
        <div className='my-4'>
          <h1 className='my-12 text-6xl font-bold text-center text-alice-blue'>Escapade</h1>
          <input
            className={`${shakeAnimation ? 'animate-shake' : ''} input-main`}
            type='text'
            value={gameCode.toUpperCase()}
            onKeyPress={handleEnterPress}
            onChange={onInputChange}
            onAnimationEnd={() => setShakeAnimation(false)}
            placeholder='Kode for spillet'
          />
          <button
            className='btn-sm'
            onClick={() => {
              joinGameLobby();
            }}
          >
            Bli med
          </button>
          {errorMessage ? (
            <p className={`${shakeAnimation ? 'animate-shake' : ''} mt-1 ml-1`}>{errorMessage}</p>
          ) : (
            <p className='mt-1 ml-1'>&nbsp;</p>
          )}
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

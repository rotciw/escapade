import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { arrayRemove, arrayUnion, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../helpers/firebase';
import { generatePlayerId } from '../../helpers/lobbyHelpers';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const UserCreationView: React.FC = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [value, setValue] = useLocalStorage('gameCode', '');
  const [playerId, setPlayerId] = useLocalStorage('playerId', '');

  const joinGame = async () => {
    const newPlayerId = generatePlayerId();
    setPlayerId(newPlayerId);
    await setDoc(doc(db, 'players', newPlayerId), {
      ready: false,
      name: playerName,
      id: newPlayerId,
    });
    await updateDoc(doc(db, 'games', value), { participants: arrayUnion(newPlayerId) });
    navigate('/lobby');
  };

  const leaveGame = async () => {
    await updateDoc(doc(db, 'games', value), { participants: arrayRemove(playerId) });
  };

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
        <button
          className='btn-sm'
          onClick={() => {
            leaveGame();
            navigate('/');
          }}
        >
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

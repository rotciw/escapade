import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../../helpers/firebase';
import { generateGameCode } from '../../helpers/lobbyHelpers';

const CreatingGameView: React.FC = () => {
  const [gameCode, setGameCode] = useState('');
  const createGame = async (code: string) => {
    try {
      await setDoc(doc(db, 'games', code), {
        created: Date.now(),
        finished: false,
        round: 1,
        participants: [],
        theme: 0,
      });
      console.log('Document written with ID: ', code);
      setGameCode(code);
    } catch (e) {
      console.error('Error', e);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen font-semibold'>
      <button
        disabled={gameCode !== ''}
        className='my-2 btn-lg'
        onClick={() => createGame(generateGameCode(6))}
      >
        Lag et spill
      </button>
      {gameCode ? <p>Koden til spillet er {gameCode}</p> : <></>}
    </div>
  );
};

export default CreatingGameView;

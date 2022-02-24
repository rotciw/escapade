import { doc, setDoc } from 'firebase/firestore';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import { db } from '../../helpers/firebase';
import { generateGameCode, generatePlayerId } from '../../helpers/lobbyHelpers';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const CreatingGameView: React.FC = () => {
  const navigate = useNavigate();
  const [creatorGameCode, setCreatorGameCode] = useLocalStorage('gameCode', '');
  const [gameHostId, setGameHostId] = useLocalStorage('hostId', '');

  const createGame = async () => {
    const gameCode = generateGameCode(6);
    const hostId = generatePlayerId();
    try {
      await setDoc(doc(db, 'games', gameCode), {
        created: Date.now(),
        finished: false,
        round: 1,
        participants: [],
        theme: 0,
        canJoin: true,
        hostId: hostId,
        selectionStep: 0,
      });
      setCreatorGameCode(gameCode);
      setGameHostId(hostId);
      navigate('/lobby');
    } catch (e) {
      console.error('Error', e);
    }
  };

  return (
    <>
      <Header />
      {/* Choose a theme */}
      <div className='flex flex-col items-center justify-center h-screen font-semibold'>
        <h1>Velg et tema</h1>
        <button className='btn-lg'>Intro til Escapade</button>
        {/* More options */}
        <div>
          <h1>Flere innstillinger</h1>
        </div>
        <button className='my-2 btn-lg' onClick={() => createGame()}>
          Fortsett
        </button>
      </div>
    </>
  );
};

export default CreatingGameView;

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
      <div className='flex flex-col items-center'>
        <h1>Velg et tema</h1>
        <div className='flex'>
          <button className='btn-sq'>Intro til Escapade</button>
          <button className='btn-sq'>Revolu-sjonene</button>
          <button className='btn-sq'>1800-tallet</button>
          <button className='btn-sq'>Verdens-kriger</button>
          <button className='btn-sq'>Den Kalde Krigen</button>
          {/* More options */}
        </div>

        <h2>Bilder som vil vises</h2>
        <div className='flex'>
          <img src='' />
        </div>
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

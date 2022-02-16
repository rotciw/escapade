import React, { useEffect, useState } from 'react';

import { collection, doc, documentId, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../helpers/firebase';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { IGame, IPlayer } from '../../types';

const LobbyView: React.FC = () => {
  // const navigate = useNavigate();
  const [value, setValue] = useLocalStorage('gameCode', '');
  const [playerId, setPlayerId] = useLocalStorage('playerId', '');
  const [participants, setParticipants] = useState<IPlayer[]>([]);
  const [participantData, setParticipantData] = useState<IPlayer[]>([]);
  let listener: () => void;

  const handlePlayerRef = async () => {
    if (participants.length > 0) {
      const localList: IPlayer[] = [];
      const playerRef = collection(db, 'players');
      const q = query(playerRef, where(documentId(), 'in', participants));
      const querySnap = await getDocs(q);
      querySnap.forEach((player) => {
        const playerData = player.data() as IPlayer;
        localList.push(playerData);
      });
      setParticipantData(localList);
    }
  };

  const subscribeToListener = () => {
    const docRef = doc(db, 'games', value);
    listener = onSnapshot(docRef, (gameDoc) => {
      const gameData = gameDoc.data() as IGame;
      if (gameData) {
        setParticipants(gameData.participants);
      } else {
        console.error('no data');
      }
    });
  };

  useEffect(() => {
    subscribeToListener();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handlePlayerRef();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participants]);

  return (
    <>
      <div className='flex flex-col items-center justify-evenly'>
        <div className='my-4 text-center'>
          <h1 className='my-12 text-6xl font-bold text-center text-alice-blue'>Escapade</h1>
        </div>
        <h2>
          Kode for spillet er: <b>{value}</b>
        </h2>
        <div className='p-5 rounded bg-alice-blue'>
          <h1 className='text-xl font-bold text-independence'>Disse spillerne er inne</h1>
          <div className='flex flex-row'>
            {participantData.map((player) => (
              <div className='mx-5 my-3 text-md' key={player.id}>
                <p className='text-independence'>
                  {player.name} {playerId === player.id ? '(deg)' : ''}
                </p>
                <p className='text-independence'>{player.isReady ? 'Klar' : 'Ikke klar'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LobbyView;

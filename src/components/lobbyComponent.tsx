import React, { useEffect, useState } from 'react';

import { collection, documentId, getDocs, query, where } from 'firebase/firestore';
import { db } from '../helpers/firebase';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { IPlayer } from '../types';

interface IProps {
  participants: IPlayer[];
}

const LobbyComponent: React.FC<IProps> = (props: IProps) => {
  const { participants } = props;
  const [value, setValue] = useLocalStorage('gameCode', '');
  const [playerId, setPlayerId] = useLocalStorage('playerId', '');
  const [participantData, setParticipantData] = useState<IPlayer[]>([]);

  const handlePlayerRef = async () => {
    if (participants.length > 0) {
      const participantIds = participants.map((participant) => participant.id);
      const localList: IPlayer[] = [];
      const playerRef = collection(db, 'players');
      const q = query(playerRef, where(documentId(), 'in', participantIds));
      const querySnap = await getDocs(q);
      querySnap.forEach((player) => {
        const playerData = player.data() as IPlayer;
        localList.push(playerData);
      });
      setParticipantData(localList);
    }
  };

  useEffect(() => {
    handlePlayerRef();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      setParticipantData([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participants]);

  return (
    <>
      <h2 className='mb-4 text-xl'>
        Kode for spillet er: <b>{value}</b>
      </h2>
      <div className='p-5 rounded bg-alice-blue w-96 h-96'>
        <h1 className='text-xl font-bold text-center text-independence'>Disse spillerne er inne</h1>
        <div className='flex flex-row'>
          {participantData.map((player) => (
            <div className='mx-5 my-3 text-md' key={player.id}>
              <p className='text-independence'>
                {player.name} {playerId === player.id ? '(deg)' : ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LobbyComponent;

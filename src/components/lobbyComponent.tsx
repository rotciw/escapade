import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { IPlayer } from '../types';
import Avatar from './avatar';

interface IProps {
  participants: IPlayer[];
}

const LobbyComponent: React.FC<IProps> = (props: IProps) => {
  const { participants } = props;
  const [value, setValue] = useLocalStorage('gameCode', '');
  const [playerId, setPlayerId] = useLocalStorage('playerId', '');

  return (
    <>
      <h2 className='mb-4 text-xl'>
        Kode for spillet: <b>{value}</b>
      </h2>
      <div className='w-4/6 p-5 rounded h-[65vh] bg-alice-blue overflow-y-auto border border-independence shadow-cameo-pink shadow-lg'>
        <h1 className='mb-4 text-xl font-bold text-center text-independence'>
          Disse spillerne er inne
        </h1>
        <div className='flex flex-row flex-wrap gap-5'>
          {Object.values(participants)
            .sort((a, b) => (a.id > b.id ? 1 : -1))
            .map((player) => (
              <Avatar
                eyes={player.eyes}
                mouth={player.mouth}
                color={player.color}
                name={player.name}
                currentPlayer={playerId === player.id}
                key={player.id}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default LobbyComponent;

import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { IPlayer } from '../types';
import AvatarHead from './avatar/avatarHead';

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
        Kode for spillet er: <b>{value}</b>
      </h2>
      <div className='w-3/5 p-5 rounded min-h-96 h-fit bg-alice-blue'>
        <h1 className='text-xl font-bold text-center text-independence'>Disse spillerne er inne</h1>
        <div className='flex flex-row flex-wrap'>
          {Object.values(participants).map((player) => (
            <AvatarHead
              head={player.head}
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

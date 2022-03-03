import React, { useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../helpers/firebase';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ICurrentGamePlayer, IRoleInfo } from '../../types';

interface IProps {
  team: ICurrentGamePlayer[];
  type: number;
  chooseRole: (type: number) => void;
}

const RoleComponent: React.FC<IProps> = (props: IProps) => {
  const { type, team, chooseRole } = props;
  const [value, setValue] = useLocalStorage('gameCode', '');
  const [playerId, setPlayerId] = useLocalStorage('playerId', '');
  const [currentPlayer, setPlayer] = useState<ICurrentGamePlayer>();
  const [roleInfo, setRoleInfo] = useState<IRoleInfo>({
    title: '',
    subtitle: '',
    description: '',
  });

  const explorer = {
    title: 'Utforsker',
    subtitle: 'Tid og sted',
    description:
      'Din rolle som utforsker vil være å gjøre dette og dette og dette og dette og dette. Samt dette og dette og dette og dette. Passer godt for deg som liker dette.',
  };

  const expert = {
    title: 'Ekspert',
    subtitle: 'noe og noe',
    description:
      'Din rolle som utforsker vil være å gjøre dette og dette og dette og dette og dette. Samt dette og dette og dette og dette. Passer godt for deg som liker dette.',
  };

  const determineRole = () => {
    switch (type) {
      case 1:
        setRoleInfo(explorer);
        break;
      case 2:
        setRoleInfo(expert);
        break;
      case 3:
        setRoleInfo(expert);
        break;
      case 4:
        setRoleInfo(expert);
        break;
      case 5:
        setRoleInfo(explorer);
        break;
    }
  };

  useEffect(() => {
    determineRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const participant = team.filter((player) => player.role === type)[0];
    setPlayer(participant);
  }, [chooseRole, team, type]);

  return (
    <>
      <div className='flex flex-col p-5 m-1 border rounded h-96 w-60 border-independence text-independence bg-alice-blue'>
        <h1 className='text-xl font-bold text-center'>{roleInfo.title}</h1>
        <h2 className='mb-2 italic text-center text-l'>{roleInfo.subtitle}</h2>
        <p className='mb-4'>{roleInfo.description}</p>
        {currentPlayer ? (
          <div className='text-center'>
            <p className='my-2 font-bold'>
              {currentPlayer.name}
              {currentPlayer.id === playerId ? ' (deg)' : ''}
            </p>
          </div>
        ) : (
          <>
            <button
              className='btn-lg'
              onClick={() => {
                chooseRole(type);
              }}
            >
              Velg rolle
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default RoleComponent;

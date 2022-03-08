/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../helpers/firebase';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ICurrentGamePlayer, IRole } from '../../types';
import RoleComponent from './roleComponent';
import AvatarHead from '../avatar/avatarHead';

interface IProps {
  participants: ICurrentGamePlayer[];
}

const RoleSelectionComponent: React.FC<IProps> = (props: IProps) => {
  const { participants } = props;
  const [value, setValue] = useLocalStorage('gameCode', '');
  const [playerId, setPlayerId] = useLocalStorage('playerId', '');
  const [teamId, setTeamId] = useState<number>(0);
  const [currentTeam, setCurrentTeam] = useState<ICurrentGamePlayer[]>();
  const [roles, setRoles] = useState<IRole[]>([]);

  useEffect(() => {
    const onLoadTeamId = Object.values(participants).filter(
      (participant) => participant.id === playerId,
    )[0].teamId;
    setTeamId(onLoadTeamId);

    const onLoadTeam = Object.values(participants).filter(
      (player) => player.teamId === onLoadTeamId,
    );
    setCurrentTeam(onLoadTeam);

    const placeholderRoles = [];
    for (let i = 1; i <= onLoadTeam.length; i++) {
      const roleObject: IRole = { id: i, playerId: '' };
      placeholderRoles.push(roleObject);
    }
    setRoles(placeholderRoles);

    if (onLoadTeam.filter((player) => player.role === 0).length === 0) {
      updateDoc(doc(db, 'games', value), { selectionStep: 3 });
    }
  }, [participants]);

  const handleRoleChange = async (roleType: number) => {
    await updateDoc(doc(db, 'games', value), {
      [`participants.${playerId}.role`]: roleType,
    });
  };

  if (!currentTeam || currentTeam.length < 4) return <>Not enough members</>;

  return (
    <>
      <h1 className='mb-1 text-xl font-bold'>Lag {teamId}</h1>
      <h1 className='text-xl'>Velg din rolle</h1>
      <div className='flex flex-row flex-wrap justify-center p-5'>
        {roles.map((role, index) => (
          <div key={index}>
            <RoleComponent
              key={index}
              type={index + 1}
              team={currentTeam}
              chooseRole={handleRoleChange}
            />
          </div>
        ))}
      </div>
      <div className='p-5 mt-2 rounded bg-alice-blue'>
        <h1 className='text-xl font-bold text-center text-independence'>
          Disse spillerne har ikke valgt rolle
        </h1>
        <div className='flex flex-row mt-2'>
          {currentTeam
            .filter((player) => player.teamId === teamId && player.role === 0)
            .sort((a, b) => (a.id > b.id ? 1 : -1))
            .map((player) => (
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

export default RoleSelectionComponent;

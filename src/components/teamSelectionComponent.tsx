/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../helpers/firebase';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ICurrentGamePlayer, ITeam } from '../types';
import Avatar from './avatar';

interface IProps {
  participants: ICurrentGamePlayer[];
  numberOfTeams: number;
  isHost: boolean;
}

const TeamSelectionComponent: React.FC<IProps> = (props: IProps) => {
  const { participants, numberOfTeams, isHost } = props;
  const [value, setValue] = useLocalStorage('gameCode', '');
  const [playerId, setPlayerId] = useLocalStorage('playerId', '');
  const [teams, setTeams] = useState<ITeam[]>([]);

  const chooseTeam = async (teamId: number) => {
    await updateDoc(doc(db, 'games', value), {
      [`participants.${playerId}.teamId`]: teamId,
    });
  };

  const handleTeam = (teamId: number) => {
    return Object.values(participants).filter((participant) => participant.teamId === teamId);
  };

  useEffect(() => {
    const placeholderTeams = [];
    for (let i = 1; i <= numberOfTeams; i++) {
      const teamObject: ITeam = { id: i, participants: [] };
      placeholderTeams.push(teamObject);
    }
    setTeams(placeholderTeams);
  }, []);

  if (teams.length === 0) return <></>;

  return (
    <>
      <div className='w-5/6 p-5 rounded bg-alice-blue h-5/6'>
        {teams.map((team) => (
          <div key={team.id}>
            <h1 className='text-xl font-bold text-independence'>
              Lag {team.id} ({handleTeam(team.id).length} spillere)
            </h1>
            ;
            {!isHost && handleTeam(team.id).length !== 5 ? (
              <button className='btn-lg' onClick={() => chooseTeam(team.id)}>
                Velg lag {team.id}
              </button>
            ) : (
              <></>
            )}
            <div className='flex flex-row'>
              {handleTeam(team.id).map((participant) => (
                <Avatar
                  eyes={participant.eyes}
                  mouth={participant.mouth}
                  color={participant.color}
                  name={participant.name}
                  currentPlayer={playerId === participant.id}
                  key={participant.id}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className='p-5 mt-8 rounded bg-alice-blue'>
        <h1 className='text-xl font-bold text-center text-independence'>Ikke valgt lag</h1>
        <div className='flex flex-row'>
          {handleTeam(0).map((player) => (
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

export default TeamSelectionComponent;

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
  const [playerTeam, setPlayerTeam] = useState(
    Object.values(participants).filter((participant) => participant.id === playerId)[0].teamId,
  );

  const chooseTeam = async (teamId: number) => {
    setPlayerTeam(teamId);
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

  if (teams.length === 0) return <p>Spillet ble startet før noen spillere kunne bli med.</p>;

  return (
    <>
      <div className='flex flex-wrap justify-around w-5/6 p-5 rounded gap-y-5 gap-x-16 bg-alice-blue'>
        {teams.map((team) => (
          <div key={team.id} className='h-[178px] w-[368px]'>
            <div className='flex'>
              <h2 className='mb-2 text-xl font-bold w-44 text-independence'>
                Lag {team.id} ({handleTeam(team.id).length}{' '}
                {handleTeam(team.id).length === 1 ? 'spiller' : 'spillere'})
              </h2>
              ;
              {!isHost && handleTeam(team.id).length !== 5 && playerTeam !== team.id ? (
                <button className='py-1 mb-2 ml-3 btn-sm' onClick={() => chooseTeam(team.id)}>
                  Velg lag {team.id}
                </button>
              ) : (
                <></>
              )}
              {!isHost && playerTeam === team.id ? (
                <button className='py-1 mb-2 ml-3 btn-sm' onClick={() => chooseTeam(0)}>
                  Gå ut av lag {team.id}
                </button>
              ) : (
                <></>
              )}
            </div>
            <div className='flex flex-row gap-3 mb-4'>
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
      {
        // Box of players with no team is hidden if everyone is in a team
        handleTeam(0).length !== 0 && (
          <div className='p-5 mt-8 rounded bg-alice-blue max-w-[83.3%]'>
            <h1 className='mb-3 text-xl font-bold text-center text-independence'>Ikke valgt lag</h1>
            <div className='flex flex-row flex-wrap gap-3'>
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
        )
      }
    </>
  );
};

export default TeamSelectionComponent;

import React, { useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ICurrentGamePlayer, ITeam } from '../types';
import Countdown from 'react-countdown';

interface IProps {
  participants: ICurrentGamePlayer[];
}

const GameProgressComponent: React.FC<IProps> = (props: IProps) => {
  const { participants } = props;
  const [teams, setTeams] = useState<ITeam[]>([]);

  const getRoleName = (roleId: number) => {
    switch (roleId) {
      case 0:
        return 'Ingen rolle';
      case 2:
        return 'Geografi og flagg';
      case 3:
        return 'Politikk og mote';
      case 4:
        return 'Teknologi og fotografi';
      default:
        return 'Utforsker';
    }
  };

  const renderer = ({ minutes, seconds, completed }: any) => {
    // Render a countdown
    return (
      <span>
        {minutes}:{seconds < 10 ? '0' + seconds : seconds}
      </span>
    );
  };

  useEffect(() => {
    const placeholderTeams: ITeam[] = [];
    const teamsAdded: number[] = [];

    //Iterates through every participant and sorts them into teams
    for (let i = 0; i < Object.values(participants).length; i++) {
      const participant = Object.values(participants)[i];
      const tId: number = participant.teamId;

      if (!teamsAdded.includes(participant.teamId)) {
        // If team has not been created, creates team and adds player as first participant
        teamsAdded.push(participant.teamId);
        placeholderTeams.push({ id: participant.teamId, participants: [participant] });
      } else {
        // If team has already been created, adds player as participant
        placeholderTeams.filter((team) => team.id === tId)[0].participants.push(participant);
      }
    }

    placeholderTeams.sort((a, b) => (a.id > b.id ? 1 : -1)); // Sorts array of teams by team ID
    setTeams(placeholderTeams);
  }, []);

  if (teams.length === 0) return <p>Game has no teams in it.</p>;

  return (
    <>
      <div className='flex flex-wrap justify-center gap-10 p-5 sm:w-5/6'>
        {teams
          .filter((t) => t.id !== 0) // Excludes team 0 from view
          .map((team) => (
            <div
              key={team.id}
              className={
                Math.floor(team.id / 2) % 2 != 0 // Makes colors of team boxes alternate
                  ? 'team-progress-box shadow-magic-mint'
                  : 'team-progress-box shadow-cameo-pink'
              }
            >
              <h2 className='w-full text-2xl font-bold'>Lag {team.id}</h2>
              <div className='flex justify-between'>
                <div className='flex flex-col mr-8'>
                  {team.participants.map((participant) => (
                    <p key={participant.id}>
                      <strong>{participant.name}</strong> - {getRoleName(participant.role)}
                    </p>
                  ))}
                </div>
                <div className='flex flex-col text-right'>
                  <p>
                    Runde: <strong>{team.participants[0].round}/3</strong>
                  </p>
                  <p>
                    Gjenstående rundetid:{' '}
                    <strong>
                      <Countdown
                        date={team.participants[0].startTime + 360000}
                        renderer={renderer}
                      />
                    </strong>
                  </p>
                  <p>
                    Poeng så langt: <strong>{team.participants[0].totalPoints}</strong>
                  </p>
                </div>
              </div>
            </div>
          ))}
        {Object.values(teams).length % 2 === 1 && <div className='max-w-2xl grow basis-1/3' />}
      </div>
    </>
  );
};

export default GameProgressComponent;

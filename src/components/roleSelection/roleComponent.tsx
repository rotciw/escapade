import React, { useEffect, useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ICurrentGamePlayer, IRoleInfo } from '../../types';
import Avatar from '../avatar';

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
      'Du får se bilder og må jobbe med laget ditt for å finne ut hva bildene er av. Passer dersom du er flink til å se detaljer.',
  };

  const geographyExpert = {
    title: 'Ekspert',
    subtitle: 'Geografi og flagg',
    description:
      'Du vil ha tilgang til mange forskjellige flagg og kart. Dersom laget trenger å vite hvor et sted er så bør de spørre deg.',
  };

  const historyExpert = {
    title: 'Ekspert',
    subtitle: 'Historie og teknologi',
    description:
      'Du får oversikt over viktige historiske hendelser: når det skjedde, hvem som var involvert, og hva det gikk ut på.',
  };

  const technologyExpert = {
    title: 'Ekspert',
    subtitle: 'Teknologi og fotografi',
    description:
      'Du vil kunne tid- og stedfeste forskjellige oppfinnelser og produkter som finnes i bildene. I tillegg vil du kunne bruke tekniske kjennetegn til å tidfeste bilder.',
  };

  const determineRole = () => {
    switch (type) {
      case 1:
        setRoleInfo(explorer);
        break;
      case 2:
        setRoleInfo(geographyExpert);
        break;
      case 3:
        setRoleInfo(historyExpert);
        break;
      case 4:
        setRoleInfo(explorer);
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
      <div className='flex flex-col items-center h-[400px] p-5 m-1 border rounded w-60 border-independence text-independence bg-alice-blue'>
        <h1 className='text-xl font-bold text-center'>{roleInfo.title}</h1>
        <h2 className='mb-2 text-sm italic text-center'>{roleInfo.subtitle}</h2>
        <p className='grow'>{roleInfo.description}</p>
        {currentPlayer ? (
          <Avatar
            eyes={currentPlayer.eyes}
            mouth={currentPlayer.mouth}
            color={currentPlayer.color}
            name={currentPlayer.name}
            currentPlayer={playerId === currentPlayer.id}
          />
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

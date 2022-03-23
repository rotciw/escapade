import React, { useEffect, useState } from 'react';

import { deleteField, doc, onSnapshot, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../helpers/firebase';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ICurrentGamePlayer, IGame } from '../../types';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import LobbyComponent from '../../components/lobbyComponent';
import TeamSelectionComponent from '../../components/teamSelectionComponent';
import RoleSelectionComponent from '../../components/roleSelection/roleSelectionComponent';

const LobbyView: React.FC = () => {
  const navigate = useNavigate();
  const [value, setValue] = useLocalStorage('gameCode', '');
  const [gameHostId, setGameHostId] = useLocalStorage('hostId', '');
  const [participants, setParticipants] = useState<ICurrentGamePlayer[]>([]);
  const [teamPlayers, setTeamPlayers] = useState<ICurrentGamePlayer[]>();
  const [player, setCurrentPlayer] = useState<ICurrentGamePlayer>();
  const [playerId, setPlayerId] = useLocalStorage('playerId', '');
  const [step, setStep] = useState(0);
  const [isHost, setIsHost] = useState(false);
  const [startedGame, setIsStartedGame] = useState(false);
  const [leaving, setIsLeaving] = useState(false);
  let listener: () => void;

  const subscribeToListener = () => {
    const docRef = doc(db, 'games', value);
    listener = onSnapshot(docRef, (gameDoc) => {
      const gameData = gameDoc.data() as IGame;
      if (gameData) {
        setParticipants(gameData.participants);
        if (gameHostId === gameData.hostId) {
          setIsHost(true);
        }
        if (step !== gameData.selectionStep) {
          setStep(gameData.selectionStep);
        }
        const currentPlayer = Object.values(gameData.participants).filter(
          (player) => player.id === playerId,
        )[0];
        setIsStartedGame(currentPlayer.startedGame);
        setCurrentPlayer(currentPlayer);
        setTeamPlayers(
          Object.values(gameData.participants).filter(
            // Compare to your own player
            (player) => player.teamId == currentPlayer.teamId,
          ),
        );
      } else {
        console.error('no data');
      }
    });
  };

  const handleNextStep = async () => {
    if (step === 0) {
      await updateDoc(doc(db, 'games', value), { selectionStep: 1, canJoin: false });
    } else if (step === 1) {
      await updateDoc(doc(db, 'games', value), { selectionStep: 2 });
    } else if (step === 3) {
      await updateDoc(doc(db, 'games', value), { selectionStep: 4 });
    }
  };

  const findTeamNumber = (playerNumber: number) => {
    // the number of teams is floor(participants / 4), number of 5-man teams is participants % 4
    // There should always be at least 12 players, but just in case there aren't, this function handles that too
    if (playerNumber < 12) {
      return Math.ceil(playerNumber / 5);
    }
    return Math.floor(playerNumber / 4);
  };

  const removePlayer = async () => {
    await updateDoc(doc(db, 'games', value), {
      [`participants.${playerId}`]: deleteField(),
    });
  };

  const startTime = async () => {
    const batch = writeBatch(db);
    if (teamPlayers) {
      const timeNow = Date.now();
      for (let i = 0; i < teamPlayers.length; i++) {
        batch.update(doc(db, 'games', value), {
          [`participants.${teamPlayers[i].id}.startTime`]: timeNow,
          [`participants.${teamPlayers[i].id}.startedGame`]: true,
        });
      }
      await batch.commit();
    }
  };

  useEffect(() => {
    // To start the game for everyone
    if (!isHost && step === 4 && startedGame) {
      navigate('/game');
    }
  }, [step]);

  useEffect(() => {
    subscribeToListener();
    return function onLeave() {
      listener();
      // removePlayer(); Doesn't work as intended now
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      <div className='flex flex-col items-center mt-16 justify-evenly'>
        {step === 0 && <LobbyComponent participants={participants} />}
        {step === 1 && (
          <TeamSelectionComponent
            participants={participants}
            numberOfTeams={findTeamNumber(Object.keys(participants).length)}
            isHost={isHost}
          />
        )}
        {step >= 2 && !isHost && <RoleSelectionComponent participants={participants} />}
        <div className='mt-4'>
          {isHost && (
            <button className='btn-lg' onClick={() => handleNextStep()}>
              Fortsett
            </button>
          )}
          {!isHost && step < 2 && <p>Venter på at verten starter spillet..</p>}
          {!isHost && step === 2 && <p>Venter på at alle spillere har valgt en rolle..</p>}
          {!isHost && step === 3 && (
            <button
              className='btn-lg'
              onClick={() => {
                handleNextStep();
                startTime();
              }}
            >
              Start spillet
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default LobbyView;

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
import GameProgressComponent from '~/components/gameProgressComponent';
import { PacmanLoader } from 'react-spinners';
import PopUpComponent from '~/components/PopUpComponent';

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
  const [confirmation, setConfirmation] = useState(false);
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
        if (gameHostId !== gameData.hostId) {
          // Check if is host or not since these values are not available for hosts
          setIsStartedGame(currentPlayer.startedGame);
          setTeamPlayers(
            Object.values(gameData.participants).filter(
              // Compare to your own player
              (player) => player.teamId == currentPlayer.teamId,
            ),
          );
        }
        setCurrentPlayer(currentPlayer);
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
      return Math.ceil(playerNumber / 4);
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
      <div className='flex flex-col items-center mt-4 justify-evenly'>
        {step === 0 && <LobbyComponent participants={participants} />}
        {step === 1 && (
          <TeamSelectionComponent
            participants={participants}
            numberOfTeams={findTeamNumber(Object.keys(participants).length)}
            isHost={isHost}
          />
        )}
        {step >= 2 && !isHost && <RoleSelectionComponent participants={participants} />}
        {step >= 2 && isHost && <GameProgressComponent participants={participants} />}
        <div className='mt-4'>
          {isHost && step < 2 && (
            <button className='btn-lg' onClick={() => handleNextStep()}>
              Fortsett
            </button>
          )}
          {!isHost && step < 2 && (
            <div className='flex flex-col'>
              <p className='mb-2'>Venter på at verten starter spillet</p>
              <div className='ml-20'>
                <PacmanLoader color={'#EFBCD5'} />
              </div>
            </div>
          )}
          {!isHost && step === 2 && (
            <p className='mb-2'>Venter på at alle spillere har valgt en rolle..</p>
          )}
          {!isHost && step === 3 && (
            <>
              <button
                className='btn-lg'
                onClick={() => {
                  setConfirmation(true);
                }}
              >
                Start spillet
              </button>
              <PopUpComponent isOpen={confirmation} openFunction={setConfirmation}>
                <h1 className='text-xl font-bold text-center'>Er alle klare?</h1>
                <p>Spillet starter om dere går videre.</p>
                <div className='mt-4 text-center'>
                  <button
                    className='px-4 py-2 mr-2 font-bold text-black transition-all rounded hover:bg-cameo-pink'
                    onClick={() => setConfirmation(false)}
                  >
                    Avbryt
                  </button>
                  <button
                    className='btn-sm'
                    onClick={() => {
                      handleNextStep();
                      startTime();
                    }}
                  >
                    Gå videre
                  </button>
                </div>
              </PopUpComponent>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default LobbyView;

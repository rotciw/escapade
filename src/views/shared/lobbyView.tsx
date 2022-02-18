import React, { useEffect, useState } from 'react';

import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../helpers/firebase';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ICurrentGamePlayer, IGame } from '../../types';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import LobbyComponent from '../../components/lobbyComponent';
import TeamSelectionComponent from '../../components/teamSelectionComponent';

const LobbyView: React.FC = () => {
  const navigate = useNavigate();
  const [value, setValue] = useLocalStorage('gameCode', '');
  const [gameHostId, setGameHostId] = useLocalStorage('hostId', '');
  const [participants, setParticipants] = useState<ICurrentGamePlayer[]>([]);
  const [step, setStep] = useState(0);
  const [isHost, setIsHost] = useState(false);
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
      } else {
        console.error('no data');
      }
    });
  };

  const handleNextStep = async () => {
    await updateDoc(doc(db, 'games', value), { selectionStep: 1, canJoin: false });
  };

  useEffect(() => {
    subscribeToListener();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      <div className='flex flex-col items-center mt-16 justify-evenly'>
        {step === 0 && <LobbyComponent participants={participants} />}
        {step === 1 && <TeamSelectionComponent participants={participants} numberOfTeams={2} />}
        <div className='mt-4'>
          {isHost ? (
            <button className='btn-lg' onClick={() => handleNextStep()}>
              Fortsett
            </button>
          ) : (
            <p>Vent på at verten starter spillet..</p>
          )}
        </div>
      </div>
    </>
  );
};

export default LobbyView;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { arrayRemove, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../helpers/firebase';
import { generatePlayerId } from '../../helpers/lobbyHelpers';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import CharacterCreation from '../../components/characterCreation';

const UserCreationView: React.FC = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [playerHead, setPlayerHead] = useState(1);
  const [playerBody, setPlayerBody] = useState(1);
  const [playerColor, setPlayerColor] = useState(1);
  const [value, setValue] = useLocalStorage('gameCode', '');
  const [playerId, setPlayerId] = useLocalStorage('playerId', '');

  const joinGame = async () => {
    const newPlayerId = generatePlayerId();
    setPlayerId(newPlayerId);
    await setDoc(doc(db, 'players', newPlayerId), {
      name: playerName,
      id: newPlayerId,
    });
    await updateDoc(doc(db, 'games', value), {
      [`participants.${newPlayerId}`]: {
        id: newPlayerId,
        name: playerName,
        teamId: 0,
        isReady: false,
        head: playerHead,
        body: playerBody,
        color: playerColor,
      },
    });
    navigate('/lobby');
  };

  const leaveGame = async () => {
    await updateDoc(doc(db, 'games', value), {
      participants: arrayRemove({ id: playerId, teamId: 0 }),
    });
  };

  return (
    <>
      <div className='flex flex-col items-center justify-evenly'>
        <div className='my-4 text-center'>
          <h1 className='my-12 text-6xl font-bold text-center text-alice-blue'>Escapade</h1>
          <CharacterCreation
            joinFunction={joinGame}
            nameSetter={setPlayerName}
            headSetter={setPlayerHead}
            bodySetter={setPlayerBody}
            colorSetter={setPlayerColor}
          />
        </div>
        <button
          className='btn-sm'
          onClick={() => {
            leaveGame();
            navigate('/');
          }}
        >
          Gå tilbake
        </button>
      </div>
    </>
  );
};

export default UserCreationView;

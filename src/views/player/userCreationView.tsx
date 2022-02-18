import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { arrayRemove, arrayUnion, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
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
      ready: false,
      name: playerName,
      id: newPlayerId,
      head: playerHead,
      body: playerBody,
      color: playerColor,
    });
    await updateDoc(doc(db, 'games', value), { participants: arrayUnion(newPlayerId) });
    navigate('/lobby');
  };

  const leaveGame = async () => {
    await updateDoc(doc(db, 'games', value), { participants: arrayRemove(playerId) });
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

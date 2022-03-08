import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../helpers/firebase';
import { generatePlayerId } from '../../helpers/lobbyHelpers';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import CharacterCreation from '../../components/characterCreation';
import Header from '~/components/header';

const UserCreationView: React.FC = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [playerHead, setPlayerHead] = useState(1);
  const [playerBody, setPlayerBody] = useState(1);
  const [playerColor, setPlayerColor] = useState(1);
  const [value, setValue] = useLocalStorage('gameCode', '');
  const [playerId, setPlayerId] = useLocalStorage('playerId', '');
  const [errorMsg, setErrorMsg] = useState('');

  const joinGame = async (name: string) => {
    if (name !== '') {
      const newPlayerId = generatePlayerId();
      setPlayerId(newPlayerId);
      await updateDoc(doc(db, 'games', value), {
        [`participants.${newPlayerId}`]: {
          id: newPlayerId,
          name: playerName,
          teamId: 0,
          isReady: false,
          role: 0,
          head: playerHead,
          body: playerBody,
          color: playerColor,
        },
      });
      navigate('/lobby');
    } else {
      setErrorMsg('Navnet kan ikke stå tomt.');
    }
  };

  return (
    <>
      <Header />
      <div className='flex flex-col items-center mt-8 justify-evenly'>
        <CharacterCreation
          joinFunction={joinGame}
          nameSetter={setPlayerName}
          headSetter={setPlayerHead}
          bodySetter={setPlayerBody}
          colorSetter={setPlayerColor}
          errorMsg={errorMsg}
        />
        <button
          className='mt-3 btn-sm'
          onClick={() => {
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

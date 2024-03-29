import { addDoc, collection, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../helpers/firebase';
import { generateGameCode } from '../helpers/lobbyHelpers';
import { IGame } from '../types';

const FirebaseTest: React.FC = () => {
  const [gameCode, setGameCode] = useState('');

  const writeData = async () => {
    // No id, randomly generated
    try {
      const docRef = await addDoc(collection(db, 'games'), {
        created: Date.now(),
        finished: false,
        round: 1,
        lobbyCode: 0,
        participants: ['test'],
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error', e);
    }
  };

  const writeDataWithCode = async (code: string) => {
    try {
      await setDoc(doc(db, 'games', code), {
        created: Date.now(),
        finished: false,
        round: 1,
        participants: ['test'],
      });
      console.log('Document written with ID: ', code);
    } catch (e) {
      console.error('Error', e);
    }
  };

  const readSingleGame = async () => {
    if (gameCode) {
      const docRef = doc(db, 'games', gameCode);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(docSnap.data());
      } else {
        console.log('no data');
      }
    } else {
      return;
    }
  };

  // const readMultipleGameFromCode = async (lobbyCode: number) => {
  //   const gameRef = query(collection(db, 'games'), where('lobbyCode', '==', lobbyCode));
  //   const querySnapshot = await getDocs(gameRef);
  //   querySnapshot.forEach((game) => {
  //     console.log(`${game.id} => ${game.data()}`);
  //   });
  // };

  let listener: () => void;

  const subscribeToListener = () => {
    const docRef = doc(db, 'games', gameCode);
    listener = onSnapshot(docRef, (gameDoc) => {
      const gameData = gameDoc.data() as IGame;
      if (gameData) {
        console.log('Current data: ' + gameData.round);
      } else {
        console.log('no data');
      }
    });
  };

  const detachListener = () => {
    if (listener != null) {
      listener();
    }
  };

  useEffect(() => {
    // readMultipleGameFromCode(0);
    // realTimeListener();
  }, []);

  const onInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    setGameCode(event.currentTarget.value);
  };

  return (
    <>
      <button onClick={() => writeData()}>Write data</button>
      <button onClick={() => writeDataWithCode(generateGameCode(6))}>Write data with code</button>
      <form>
        <input type='text' value={gameCode} onChange={onInputChange} />
        <button type='button' onClick={() => readSingleGame()}>
          Join
        </button>
        <button type='button' onClick={() => subscribeToListener()}>
          Listen
        </button>
        <button type='button' onClick={() => detachListener()}>
          Unsubscribe
        </button>
      </form>
    </>
  );
};

export default FirebaseTest;

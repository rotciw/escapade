import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../helpers/firebase';
import { generateGameCode } from '../helpers/lobbyHelpers';

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
    const docRef = doc(db, 'games', gameCode);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log(docSnap.data());
    } else {
      console.log('no data');
    }
  };

  const readMultipleGameFromCode = async (lobbyCode: number) => {
    const gameRef = query(collection(db, 'games'), where('lobbyCode', '==', lobbyCode));
    const querySnapshot = await getDocs(gameRef);
    querySnapshot.forEach((game) => {
      console.log(`${game.id} => ${game.data()}`);
    });
  };

  useEffect(() => {
    readMultipleGameFromCode(0);
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
      </form>
    </>
  );
};

export default FirebaseTest;

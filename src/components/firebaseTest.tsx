import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { child, get, onValue, ref } from 'firebase/database';
import { IFirebase } from '../types';

const FirebaseTest: React.FC = () => {
  const [lobby, setLobbies] = useState<IFirebase>({ lobbyId: 0, name: '', uid: '' });

  useEffect(() => {
    // GET DATA ONCE
    // const lobbyRef = ref(db);
    // get(child(lobbyRef, 'lobbies/0001/0'))
    //   .then((snapshot) => {
    //     if (snapshot.exists()) {
    //       const data = snapshot.val();
    //       setLobbies(data);
    //       console.log(snapshot.val());
    //     } else {
    //       console.log('no data');
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // LISTENER FOR UPDATING DATA
    const onValueRef = ref(db, 'lobbies/0001/0');
    onValue(onValueRef, (snapshot) => {
      const data = snapshot.val();
      setLobbies(data);
    });
  }, []);

  return (
    <>
      <div>{lobby.lobbyId}</div>
    </>
  );
};

export default FirebaseTest;

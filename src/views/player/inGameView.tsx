import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../helpers/firebase';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Header from '~/components/header';
import sanityClient from '~/sanityClient';
import { ICurrentGamePlayer, IGame, SanityMapData } from '~/types';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const InGameView: React.FC = () => {
  const navigate = useNavigate();
  const [value, setValue] = useLocalStorage('gameCode', '');
  const [playerId, setPlayerId] = useLocalStorage('playerId', '');
  const [teamPlayers, setTeamPlayers] = useState<ICurrentGamePlayer[]>();
  const [player, setCurrentPlayer] = useState<ICurrentGamePlayer>();
  const [gameData, setGameData] = useState<SanityMapData>();
  let listener: () => void;

  const subscribeToGameListener = () => {
    const docRef = doc(db, 'games', value);
    listener = onSnapshot(docRef, (gameDoc) => {
      const gameData = gameDoc.data() as IGame;
      if (gameData) {
        const currentPlayer = Object.values(gameData.participants).filter(
          (player) => player.id === playerId,
        )[0];
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

  useEffect(() => {
    subscribeToGameListener();

    sanityClient
      .fetch(
        `*[_type == "gameMaps" && title == "Tutorial"]{
        title,
        questions1,
        image1 {
          alt,
          asset -> {
          _id,
          url
          }
        },
        answer1,
        questions2,
        image2 {
          alt,
          asset -> {
          _id,
          url
          }
        },
        answer2,
      }
      `,
      )
      .then((data) => {
        setGameData(data[0]);
      });
  }, []);

  if (!gameData) return <>No data</>;

  return (
    <>
      <Header />
      {/* {player?.role === 1 || 5 ? `You're an explorer` : `You're an expert`} */}
      <div className='flex flex-row flex-wrap pb-8 mt-8 justify-evenly'>
        <div className='w-3/5 p-2 text-center rounded h-fit bg-alice-blue'>
          <Zoom>
            <img src={gameData.image1.asset.url} />
          </Zoom>
          <p className='text-black'>Klikk på bildet for å zoome!</p>
        </div>
        <div className='flex flex-col w-2/6 h-full p-4 text-black rounded bg-alice-blue'>
          {gameData.questions1.map((question, index) => {
            return (
              <div className='flex flex-col pb-4' key={index}>
                <label>{question}</label>
                <input className='input-main' type='text' placeholder='Svar til spørsmål' />
              </div>
            );
          })}
          <button className='btn-lg'>Send svar</button>
        </div>
      </div>
    </>
  );
};

export default InGameView;

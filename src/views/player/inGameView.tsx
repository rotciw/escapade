import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../helpers/firebase';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Header from '~/components/header';
import imageUrlBuilder from '@sanity/image-url';
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
  const [theme, setTheme] = useState(0);
  const [round, setRound] = useState(0);
  let listener: () => void;

  const builder = imageUrlBuilder(sanityClient);

  function urlFor(source: any) {
    return builder.image(source);
  }

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
        setTheme(gameData.theme);
      } else {
        console.error('no data');
      }
    });
  };

  useEffect(() => {
    subscribeToGameListener();
    return function unsubscribe() {
      listener();
    };
  }, []);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "gameMaps" && id == ${theme}]{
            title,
            id,
            description,
            questionSet,
          }
      `,
      )
      .then((data) => {
        setGameData(data[0]);
      });
  }, [theme]);

  if (!gameData) return <>No data</>;

  return (
    <>
      <Header />
      {/* {player?.role === 1 || 5 ? `You're an explorer` : `You're an expert`} */}
      <div className='flex flex-row flex-wrap pb-8 mt-8 justify-evenly'>
        <div className='w-3/5 p-2 text-center rounded h-fit bg-alice-blue'>
          <Zoom>
            <img src={urlFor(gameData.questionSet[round].images[0].asset).url()} />
          </Zoom>
          <p className='text-black'>Klikk på bildet for å zoome!</p>
        </div>
        <div className='flex flex-col w-2/6 h-full p-4 text-black rounded bg-alice-blue'>
          <div className='flex flex-col pb-4'>
            <label>{gameData.questionSet[round].multipleChoiceQuestion.question}</label>
            {gameData.questionSet[round].multipleChoiceQuestion.choices.map((choice, index) => {
              return (
                <div
                  key={index}
                  className='px-2 py-1 my-1 bg-white border rounded hover:bg-cameo-pink-hover border-independence hover:cursor-pointer'
                >
                  {choice.alternative}
                </div>
              );
            })}
          </div>
          <div className='flex flex-col pb-4'>
            <label>{gameData.questionSet[round].stringDateQuestion.question}</label>
            <input className='input-main' type='text' placeholder='Svar på spørsmål' />
          </div>
          <div className='flex flex-col pb-4'>
            <label>{gameData.questionSet[round].mapPointerQuestion.question}</label>
            <input className='input-main' type='text' placeholder='Svar på spørsmål' />
          </div>
          <button className='btn-lg'>Send svar</button>
        </div>
      </div>
    </>
  );
};

export default InGameView;

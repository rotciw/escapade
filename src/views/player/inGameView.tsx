import React, { useEffect, useState } from 'react';
import { doc, onSnapshot, writeBatch } from 'firebase/firestore';
import { db } from '../../helpers/firebase';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Header from '~/components/header';
import imageUrlBuilder from '@sanity/image-url';
import sanityClient from '~/sanityClient';
import { ICurrentGamePlayer, IGame, SanityMapData, TeamAnswers } from '~/types';
import 'react-medium-image-zoom/dist/styles.css';
import TimerComponent from '~/components/timerComponent';
import AnswerView from '../../components/answerComponent';
import ExpertComponent from '~/components/expertComponent';
import ExplorerComponent from '~/components/explorerComponent';

const InGameView: React.FC = () => {
  const [value, setValue] = useLocalStorage('gameCode', '');
  const [playerId, setPlayerId] = useLocalStorage('playerId', '');
  const [teamPlayers, setTeamPlayers] = useState<ICurrentGamePlayer[]>();
  const [player, setCurrentPlayer] = useState<ICurrentGamePlayer>();
  const [startTime, setStartTime] = useState<number>(0);
  const [gameData, setGameData] = useState<SanityMapData>();
  const [theme, setTheme] = useState(0);
  const [round, setRound] = useState(0);
  const [role, setRole] = useState(0);
  const [answer, setAnswer] = useState(false);
  const [teamAnswers, setTeamAnswers] = useState<TeamAnswers>({
    multipleChoiceAnswer: { answer: 0, points: 0 },
    dateStringAnswer: { answer: '1998-04-14', points: 0 },
    mapPointerAnswer: { answer: { lat: 0, lng: 0 }, points: 0 },
  });

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
        setRound(currentPlayer.round);
        setAnswer(currentPlayer.answer);
        setTeamPlayers(
          Object.values(gameData.participants).filter(
            // Compare to your own player
            (player) => player.teamId == currentPlayer.teamId,
          ),
        );
        setRole(currentPlayer.role);
        setStartTime(currentPlayer.startTime);
        setTheme(gameData.theme);
        if (currentPlayer.round === 0) {
          setTeamAnswers(currentPlayer.round1);
        }
        if (currentPlayer.round === 1) {
          setTeamAnswers(currentPlayer.round2);
        }
        if (currentPlayer.round === 2) {
          setTeamAnswers(currentPlayer.round3);
        }
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

  const resetTimer = async () => {
    const batch = writeBatch(db);
    if (teamPlayers) {
      const timeNow = Date.now();
      for (let i = 0; i < teamPlayers.length; i++) {
        batch.update(doc(db, 'games', value), {
          [`participants.${teamPlayers[i].id}.startTime`]: timeNow,
          [`participants.${teamPlayers[i].id}.round`]: round + 1,
        });
      }
      await batch.commit();
    }
  };

  const goToAnswers = async (bol: boolean) => {
    const batch = writeBatch(db);
    if (teamPlayers) {
      for (let i = 0; i < teamPlayers.length; i++) {
        batch.update(doc(db, 'games', value), {
          [`participants.${teamPlayers[i].id}.answer`]: bol,
        });
      }
      await batch.commit();
    }
  };

  const handleNextRound = async () => {
    goToAnswers(false);
    resetTimer();
  };

  if (!gameData) return <>No data</>;

  return (
    <>
      <Header />
      {!answer ? (
        <>
          <div className='w-[96vw] mx-auto'>
            <TimerComponent key={startTime} startTime={startTime} />
          </div>
          {role != 1 ? (
            <ExpertComponent role={role}></ExpertComponent>
          ) : (
            <>
              <ExplorerComponent
                teamPlayers={teamPlayers}
                startTime={startTime}
                sanityData={gameData}
                round={round}
              />
            </>
          )}
        </>
      ) : (
        <div className='text-center'>
          <AnswerView
            round={round}
            roundImg={urlFor(gameData.questionSet[round].images[0].asset).url()}
            questionSet={gameData.questionSet[round]}
            teamAnswers={teamAnswers}
          />
          <button className='mt-2 btn-lg' onClick={() => handleNextRound()}>
            Gå videre
          </button>
        </div>
      )}
    </>
  );
};

export default InGameView;

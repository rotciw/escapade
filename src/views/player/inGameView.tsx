import React, { useEffect, useState } from 'react';
import { doc, onSnapshot, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../helpers/firebase';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Header from '~/components/header';
import imageUrlBuilder from '@sanity/image-url';
import sanityClient from '~/sanityClient';
import { ICurrentGamePlayer, IGame, SanityMapData, TeamAnswers } from '~/types';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import PopUpComponent from '~/components/PopUpComponent';
import { ClickEventValue } from 'google-map-react';
import { ExternalLink, MapPin } from 'react-feather';
import TimerComponent from '~/components/timerComponent';
import AnswerView from './answerView';
import MapComponent from '~/components/mapComponent';
import { convertDate } from '~/helpers/lobbyHelpers';

const InGameView: React.FC = () => {
  const [value, setValue] = useLocalStorage('gameCode', '');
  const [playerId, setPlayerId] = useLocalStorage('playerId', '');
  const [teamPlayers, setTeamPlayers] = useState<ICurrentGamePlayer[]>();
  const [player, setCurrentPlayer] = useState<ICurrentGamePlayer>();
  const [startTime, setStartTime] = useState<number>(0);
  const [gameData, setGameData] = useState<SanityMapData>();
  const [theme, setTheme] = useState(0);
  const [round, setRound] = useState(0);
  const [dateErrorMsg, setDateErrorMsg] = useState('');
  const [chosenDate, setChosenDate] = useState('');
  const center = { lat: 50, lng: 0 };
  const [markerLatitude, setMarkerLatitude] = useState(0);
  const [markerLongitude, setMarkerLongitude] = useState(0);
  const zoom = 1;
  const [chosenChoice, setChosenChoice] = useState<number>(-1);
  const [confirmation, setConfirmation] = useState(false);
  const [answer, setAnswer] = useState(false);
  const [teamAnswers, setTeamAnswers] = useState<TeamAnswers>({
    multipleChoiceAnswer: { answer: 0, points: 0 },
    dateStringAnswer: { answer: '1998-04-14', points: 0 },
    mapPointerAnswer: { answer: { lat: 0, lng: 0 }, points: 0 },
  });
  let [isOpen, setIsOpen] = useState(false);

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

  useEffect(() => {
    setChosenChoice(-1);
    setChosenDate('');
    setMarkerLatitude(0);
    setMarkerLongitude(0);
  }, [round]);

  const handleMultipleChoice = (index: number) => {
    setChosenChoice(index);
  };

  const handleDate = (e: React.FormEvent<HTMLInputElement>) => {
    const year = parseInt(e.currentTarget.value.split('-')[0]);
    if (year > 2022) {
      setDateErrorMsg('Datoen kan ikke være i fremtiden.');
    } else {
      setDateErrorMsg('');
    }
    setChosenDate(e.currentTarget.value);
  };

  const onMarkerClick = (e: ClickEventValue) => {
    setMarkerLatitude(e.lat);
    setMarkerLongitude(e.lng);
  };

  const Marker = (lat: any, lng: any) => {
    return (
      <div className='-mx-5 -my-12'>
        <MapPin color='red' size={40} fill='white' />
      </div>
    );
  };

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
    const roundPoints = calculatePoints();
    if (teamPlayers) {
      for (let i = 0; i < teamPlayers.length; i++) {
        batch.update(doc(db, 'games', value), {
          [`participants.${teamPlayers[i].id}.answer`]: bol,
          [`participants.${teamPlayers[i].id}.round${round + 1}.multipleChoiceAnswer`]: {
            answer: chosenChoice,
            points: roundPoints.multipleChoicePoints,
          },
          [`participants.${teamPlayers[i].id}.round${round + 1}.dateStringAnswer`]: {
            answer: chosenDate,
            points: roundPoints.dateStringPoints,
          },
          [`participants.${teamPlayers[i].id}.round${round + 1}.mapPointerAnswer`]: {
            answer: {
              lat: markerLatitude,
              lng: markerLongitude,
            },
            points: roundPoints.mapPoints,
          },
        });
      }
      await batch.commit();
    }
  };

  const calculatePoints = () => {
    let multipleChoicePoints = 0;
    let dateStringPoints = 0;
    let mapPoints = 0;
    const correctChoice = gameData?.questionSet[round].multipleChoiceQuestion.choices.map(
      (choice) => choice.isCorrect,
    );
    if (correctChoice) {
      if (chosenChoice === correctChoice.indexOf(true)) {
        multipleChoicePoints = 300;
      }
    }

    const correctDate = gameData?.questionSet[round].stringDateQuestion.answer;
    if (convertDate(chosenDate) === correctDate) {
      dateStringPoints = 300;
    }
    const correctMap = gameData?.questionSet[round].mapPointerQuestion.answer;
    if (markerLatitude == correctMap?.lat && markerLongitude == correctMap.lng) {
      mapPoints = 300;
    }

    return { multipleChoicePoints, dateStringPoints, mapPoints };
  };

  const handleAnswers = async () => {
    setConfirmation(false);
    goToAnswers(true);
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
          <div className='w-[96vw] mx-auto flex flex-col justify-center'>
            <TimerComponent key={startTime} startTime={startTime} />
          </div>
          <div className='flex flex-row flex-wrap justify-around pb-8 mt-2 '>
            <div className='w-7/12 p-2 text-center rounded h-fit bg-alice-blue'>
              <Zoom>
                <img src={urlFor(gameData.questionSet[round].images[0].asset).url()} />
              </Zoom>
              <p className='italic text-black'>Klikk på bildet for å zoome!</p>
            </div>
            <div className='flex flex-col w-4/12'>
              <div className='flex flex-col p-4 px-8 pb-8 text-black rounded bg-alice-blue'>
                <div className='flex flex-row justify-between'>
                  <h1 className='mb-1 text-xl font-semibold '>Poeng: 0</h1>
                  <h1 className='mb-1 text-xl font-semibold '>Runde {round + 1}/3</h1>
                </div>
                <div className='w-full mb-2 border-t border-dotted border-independence'></div>
                <label className='mb-1 font-semibold'>
                  1. {gameData.questionSet[round].multipleChoiceQuestion.question}
                </label>
                {gameData.questionSet[round].multipleChoiceQuestion.choices.map((choice, index) => {
                  return (
                    <div
                      key={index}
                      className={`${
                        chosenChoice === index
                          ? 'bg-alice-blue-hover'
                          : 'bg-white hover:bg-alice-blue-hover'
                      } px-1 py-3 my-1 text-center transition-all  border rounded  border-independence hover:cursor-pointer`}
                      onClick={() => handleMultipleChoice(index)}
                    >
                      {choice.alternative}
                    </div>
                  );
                })}
                <div className='flex flex-col pb-2'>
                  <label className='mb-1 font-semibold'>
                    2. {gameData.questionSet[round].stringDateQuestion.question}
                  </label>
                  <input
                    className={`${
                      chosenDate && !dateErrorMsg
                        ? 'bg-alice-blue-hover'
                        : 'bg-white hover:bg-alice-blue-hover'
                    } text-center cursor-text text-independence input-main`}
                    type='date'
                    onChange={(e) => handleDate(e)}
                    value={chosenDate}
                    max='2022-04-14'
                  />
                  {dateErrorMsg ? <p className='italic text-red'>{dateErrorMsg}</p> : <p>&nbsp;</p>}
                </div>
                <div className='flex flex-col pt-0'>
                  <label className='mb-1 font-semibold'>
                    3. {gameData.questionSet[round].mapPointerQuestion.question}
                  </label>

                  {!isOpen && markerLatitude !== 0 && markerLatitude !== 0 ? (
                    <button
                      className='flex justify-center p-2 italic transition-all border rounded bg-alice-blue-hover'
                      onClick={() => setIsOpen(true)}
                    >
                      Trykk igjen for å endre sted <ExternalLink className='ml-2' />
                    </button>
                  ) : (
                    <button
                      className='flex justify-center p-2 transition-all bg-white border rounded hover:bg-alice-blue'
                      onClick={() => setIsOpen(true)}
                    >
                      Åpne kartet <ExternalLink className='ml-2' />
                    </button>
                  )}
                  <PopUpComponent isOpen={isOpen} openFunction={setIsOpen}>
                    <TimerComponent key={startTime} startTime={startTime} />
                    <h1 className='mb-1 text-lg italic font-medium text-center'>
                      Trykk og velg cirka der du tror det er.
                    </h1>
                    <div className='h-[65vh] w-[85vw]'>
                      <MapComponent center={center} onMarkerClick={onMarkerClick}>
                        {markerLatitude !== 0 && markerLongitude !== 0 && (
                          <Marker lat={markerLatitude} lng={markerLongitude} />
                        )}
                      </MapComponent>
                    </div>
                    <div className='mt-4 text-center'>
                      <button
                        className='px-4 py-2 mr-2 font-bold text-black transition-all rounded hover:bg-cameo-pink'
                        onClick={() => setIsOpen(false)}
                      >
                        Gå tilbake
                      </button>
                      <button className='btn-sm' onClick={() => setIsOpen(false)}>
                        Velg sted
                      </button>
                    </div>
                  </PopUpComponent>
                </div>
                <div className='w-full mt-4 mb-6 border-t border-dotted border-independence'></div>
                <button onClick={() => setConfirmation(true)} className='btn-lg'>
                  Send svar
                </button>
                <PopUpComponent isOpen={confirmation} openFunction={setConfirmation}>
                  <h1 className='text-xl font-bold text-center'>Er dere sikre?</h1>
                  <p>&nbsp;</p>
                  <div className='mt-4 text-center'>
                    <button
                      className='px-4 py-2 mr-2 font-bold text-black transition-all rounded hover:bg-cameo-pink'
                      onClick={() => setConfirmation(false)}
                    >
                      Avbryt
                    </button>
                    <button className='btn-sm' onClick={() => handleAnswers()}>
                      Gå videre
                    </button>
                  </div>
                </PopUpComponent>
              </div>
            </div>
          </div>
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

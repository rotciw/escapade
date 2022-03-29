import React, { useEffect, useState } from 'react';
import { doc, FieldValue, increment, writeBatch } from 'firebase/firestore';
import { db } from '../helpers/firebase';
import { useLocalStorage } from '../hooks/useLocalStorage';
import imageUrlBuilder from '@sanity/image-url';
import sanityClient from '~/sanityClient';
import { ICurrentGamePlayer, SanityMapData } from '~/types';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import PopUpComponent from '~/components/PopUpComponent';
import { ClickEventValue } from 'google-map-react';
import { ExternalLink, MapPin } from 'react-feather';
import TimerComponent from '~/components/timerComponent';
import MapComponent from '~/components/mapComponent';
import { convertDate } from '~/helpers/lobbyHelpers';
import { useTimeContext } from '~/contexts/timerContext';

interface GameViewProps {
  teamPlayers: ICurrentGamePlayer[] | undefined;
  startTime: number;
  sanityData: SanityMapData;
  round: number;
}

const ExplorerComponent: React.FC<GameViewProps> = ({
  teamPlayers,
  startTime,
  sanityData,
  round,
}) => {
  const [value, setValue] = useLocalStorage('gameCode', '');
  const [dateErrorMsg, setDateErrorMsg] = useState('');
  const [chosenDate, setChosenDate] = useState('');
  const center = { lat: 50, lng: 0 };
  const [markerLatitude, setMarkerLatitude] = useState(0);
  const [markerLongitude, setMarkerLongitude] = useState(0);
  const [chosenChoice, setChosenChoice] = useState<number>(-1);
  const [confirmation, setConfirmation] = useState(false);
  let [isOpen, setIsOpen] = useState(false);
  const { timeInSecondsLeft } = useTimeContext();
  const builder = imageUrlBuilder(sanityClient);

  function urlFor(source: any) {
    return builder.image(source);
  }

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

  const goToAnswers = async (bol: boolean) => {
    const batch = writeBatch(db);
    const roundPoints = calculatePoints();
    if (teamPlayers) {
      for (let i = 0; i < teamPlayers.length; i++) {
        batch.update(doc(db, 'games', value), {
          [`participants.${teamPlayers[i].id}.answer`]: bol,
          [`participants.${teamPlayers[i].id}.totalPoints`]: increment(
            roundPoints.multipleChoicePoints + roundPoints.mapPoints + roundPoints.dateStringPoints,
          ),
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
    // console.log(timeInSecondsLeft);
    let multipleChoicePoints = 0;
    let dateStringPoints = 0;
    let mapPoints = 0;
    const correctChoice = sanityData?.questionSet[round].multipleChoiceQuestion.choices.map(
      (choice) => choice.isCorrect,
    );
    if (correctChoice) {
      if (chosenChoice === correctChoice.indexOf(true)) {
        multipleChoicePoints = 600;
      }
    }

    const correctDate = sanityData?.questionSet[round].stringDateQuestion.answer;
    if (convertDate(chosenDate)) {
      if (convertDate(chosenDate) == correctDate) {
        dateStringPoints = 600;
      }
      const chosenDateArray = convertDate(chosenDate)!.split('/');
      const correctDateArray = correctDate.split('/');

      const sortedDateStrings = [
        `${chosenDateArray[2]}/${chosenDateArray[1]}/${chosenDateArray[0]}`,
        `${correctDateArray[2]}/${correctDateArray[1]}/${correctDateArray[0]}`,
      ].sort();

      const sortedDates = [sortedDateStrings[0].split('/'), sortedDateStrings[1].split('/')];
      const dayDifference =
        (+sortedDates[1][0] - +sortedDates[0][0]) * 365.25 +
        (+sortedDates[1][1] - +sortedDates[0][1]) * 30.42 +
        (+sortedDates[1][2] - +sortedDates[0][2]);

      // Gives full points on exact date, roughly 75% at 1 year away, 35% points at 5 years, 20% at 10 years.
      dateStringPoints = Math.round(600 / (dayDifference / 1000 + 1));
    }

    const correctMap = sanityData?.questionSet[round].mapPointerQuestion.answer;

    // markerLatitude, markerLongitude | correctLatitude, correctLongitude
    const correctLatitude = correctMap?.lat;
    const correctLongitude = correctMap?.lng;

    const earthRadius = 6371; // Given in kilometers

    const lat1 = (correctLatitude * Math.PI) / 180;
    const lon1 = (correctLongitude * Math.PI) / 180;
    const lat2 = (markerLatitude * Math.PI) / 180;
    const lon2 = (markerLongitude * Math.PI) / 180;

    // Great circle distance between guess and correct spot, given in kilometers
    const distance =
      2 *
      earthRadius *
      Math.asin(
        Math.sqrt(
          Math.pow(Math.sin((lat2 - lat1) / 2), 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon2 - lon1) / 2), 2),
        ),
      );
    if (markerLatitude == 0 && markerLongitude == 0) {
      mapPoints = 0;
    } else {
      if (distance <= 30) {
        // Full points at 30 km or closer
        mapPoints = 600;
      } else if (distance > 8000) {
        // Zero points at further than 8000 km
        mapPoints = 0;
      } else {
        // Gradual graph between the two extremes: a - b*log(distance)
        // a=965.28, b=107.4 gives roughly 75% points at 120 km distance, 50% at 500 km
        mapPoints = Math.round(965.28 - 107.4 * Math.log(distance));
      }
    }

    return { multipleChoicePoints, dateStringPoints, mapPoints };
  };

  const handleAnswers = async () => {
    setConfirmation(false);
    goToAnswers(true);
  };

  if (!sanityData) return <>No data</>;

  return (
    <>
      <div className='flex flex-row flex-wrap justify-around pb-8 mt-2 '>
        <div className='w-7/12 p-2 text-center rounded h-fit bg-alice-blue'>
          <Zoom>
            <img src={urlFor(sanityData.questionSet[round].images[0].asset).url()} />
          </Zoom>
          <p className='italic text-black'>Klikk på bildet for å vise det i fullskjerm</p>
        </div>
        <div className='flex flex-col w-4/12'>
          <div className='flex flex-col p-2 pb-8 text-black rounded sm:p-3 bg-alice-blue'>
            <div className='flex flex-row justify-center'>
              <h1 className='mb-1 text-xl font-semibold'>Runde {round + 1}/3</h1>
            </div>
            <div className='w-full mb-2 border-t border-dotted border-independence'></div>
            <label className='mb-1 font-semibold'>
              1. {sanityData.questionSet[round].multipleChoiceQuestion.question}
            </label>
            {sanityData.questionSet[round].multipleChoiceQuestion.choices.map((choice, index) => {
              return (
                <div
                  key={index}
                  className={`${
                    chosenChoice === index
                      ? 'bg-independence text-white'
                      : 'bg-white hover:bg-alice-blue-hover'
                  } px-2 py-3 my-1 text-center transition-all  border rounded  border-independence hover:cursor-pointer`}
                  onClick={() => handleMultipleChoice(index)}
                >
                  {choice.alternative}
                </div>
              );
            })}
            <div className='flex flex-col pb-2'>
              <label className='mt-2 mb-1 font-semibold'>
                2. {sanityData.questionSet[round].stringDateQuestion.question}
              </label>
              <input
                className={`${
                  chosenDate && !dateErrorMsg
                    ? 'bg-independence text-white'
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
                3. {sanityData.questionSet[round].mapPointerQuestion.question}
              </label>

              {!isOpen && markerLatitude !== 0 && markerLatitude !== 0 ? (
                <button
                  className='flex justify-center p-2 italic text-white transition-all border rounded bg-independence'
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
                  Trykk for å velge cirka der du tror det er. Trykk og dra for å bevege kartet.
                </h1>
                <div className='h-[65vh] w-[85vw]'>
                  <MapComponent center={center} onMarkerClick={onMarkerClick}>
                    {markerLatitude !== 0 && markerLongitude !== 0 && (
                      <Marker lat={markerLatitude} lng={markerLongitude} />
                    )}
                  </MapComponent>
                </div>
                <div className='mt-4 mb-2 text-center'>
                  <button
                    className='px-4 py-2 mr-2 font-bold text-black transition-all rounded border-base hover:bg-independence hover:bg-opacity-70 hover:text-white'
                    onClick={() => setIsOpen(false)}
                  >
                    Gå tilbake
                  </button>
                  <button
                    className={`${
                      markerLatitude != 0 && markerLongitude != 0 ? 'btn-sm' : 'btn-sm-disabled'
                    }`}
                    onClick={() => setIsOpen(false)}
                    disabled={markerLatitude == 0 && markerLongitude == 0}
                  >
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
  );
};

export default ExplorerComponent;

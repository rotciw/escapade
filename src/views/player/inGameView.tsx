import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../helpers/firebase';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Header from '~/components/header';
import imageUrlBuilder from '@sanity/image-url';
import sanityClient from '~/sanityClient';
import { ICurrentGamePlayer, IGame, SanityMapData } from '~/types';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import PopUpComponent from '~/components/PopUpComponent';
import GoogleMapReact, { ClickEventValue } from 'google-map-react';
import { ExternalLink, MapPin } from 'react-feather';

const InGameView: React.FC = () => {
  const [value, setValue] = useLocalStorage('gameCode', '');
  const [playerId, setPlayerId] = useLocalStorage('playerId', '');
  const [teamPlayers, setTeamPlayers] = useState<ICurrentGamePlayer[]>();
  const [player, setCurrentPlayer] = useState<ICurrentGamePlayer>();
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
        setRound(gameData.round - 1);
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

  if (!gameData) return <>No data</>;

  return (
    <>
      <Header />
      <div className='flex flex-row flex-wrap justify-around pb-8 mt-8'>
        <div className='w-7/12 p-2 text-center rounded h-fit bg-alice-blue'>
          <Zoom>
            <img src={urlFor(gameData.questionSet[round].images[0].asset).url()} />
          </Zoom>
          <p className='italic text-black'>Klikk på bildet for å zoome!</p>
        </div>
        <div className='flex flex-col w-4/12'>
          <p className='mb-1 text-lg font-semibold'>Tid igjen:</p>
          <div className='flex items-center w-full h-10 mb-4 rounded bg-alice-blue-hover align-center'>
            <div
              className='h-10 p-3 my-auto text-sm font-semibold leading-none text-center text-black rounded bg-cameo-pink'
              style={{ width: '5%' }}
            >
              09:85
            </div>
          </div>
          <div className='flex flex-col p-4 px-8 pb-8 text-black rounded bg-alice-blue'>
            <h1 className='mb-2 text-xl font-semibold '>Runde {round + 1}/3</h1>
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
                <h1 className='mb-1 text-lg italic font-medium text-center'>
                  Trykk og velg cirka der du tror det er.
                </h1>
                <div className='h-[65vh] w-[85vw]'>
                  <GoogleMapReact
                    yesIWantToUseGoogleMapApiInternals
                    bootstrapURLKeys={{ key: 'AIzaSyCBtuU2hX_fJLSczcVSSbdze-KcyFhr0IY' }}
                    defaultCenter={center}
                    defaultZoom={zoom}
                    onClick={(e) => onMarkerClick(e)}
                    options={{ fullscreenControl: false }}
                  >
                    {markerLatitude !== 0 && markerLongitude !== 0 && (
                      <Marker lat={markerLatitude} lng={markerLongitude} />
                    )}
                  </GoogleMapReact>
                </div>
              </PopUpComponent>
            </div>
            <div className='w-full mt-4 mb-6 border-t border-dotted border-independence'></div>
            <button className='btn-lg'>Send svar</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InGameView;

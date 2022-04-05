import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sanityClient from '~/sanityClient';
import { SanityMapData } from '~/types';
import Header from '../../components/header';
import { db } from '../../helpers/firebase';
import { generateGameCode, generatePlayerId } from '../../helpers/lobbyHelpers';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(sanityClient);

function urlFor(source: any) {
  return builder.image(source);
}

const CreatingGameView: React.FC = () => {
  const navigate = useNavigate();
  const [creatorGameCode, setCreatorGameCode] = useLocalStorage('gameCode', '');
  const [gameHostId, setGameHostId] = useLocalStorage('hostId', '');
  // const [showSettings, setShowSettings] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [maps, setMaps] = useState<SanityMapData[]>();

  const createGame = async () => {
    const gameCode = generateGameCode(6);
    const hostId = generatePlayerId();
    try {
      await setDoc(doc(db, 'games', gameCode), {
        created: Date.now(),
        finished: false,
        participants: [],
        theme: selectedTheme,
        canJoin: true,
        hostId: hostId,
        selectionStep: 0,
      });
      setCreatorGameCode(gameCode);
      setGameHostId(hostId);
      navigate('/lobby');
    } catch (e) {
      console.error('Error', e);
    }
  };

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "gameMaps"] | order(id){
        title,
        id,
        description,
        questionSet,
      }
      `,
      )
      .then((data) => {
        setMaps(data);
      });
  }, []);

  if (!maps) return <>No data</>;

  return (
    <>
      <Header />
      <div className='flex flex-col w-2/3 max-w-2xl m-auto items-left '>
        <h1 className='my-3 text-xl font-medium'>Velg et tema</h1>
        <div className='flex flex-wrap justify-start w-full gap-4 pr-1'>
          {maps.map((map, index) => {
            return (
              <button
                key={index}
                className={`btn-theme-choice w-28 flex-grow  ${
                  selectedTheme == index && 'bg-cameo-pink hover:bg-cameo-pink-hover'
                }`}
                onClick={() => setSelectedTheme(index)}
              >
                {map.title}
              </button>
            );
          })}
          <div className='flex-grow w-28 lg:hidden'></div>
          <div className='flex-grow w-28 lg:hidden'></div>
          <div className='flex-grow w-28 lg:hidden'></div>
          <div className='flex-grow w-28 lg:hidden'></div>
        </div>
        <h2 className='mt-8 mb-2 text-xl font-medium'>Bilder som vil vises</h2>
        <div className='flex flex-wrap justify-center w-full p-2 mb-3 bg-alice-blue'>
          {maps[selectedTheme].questionSet
            .filter((map) => map.isActive)
            .map((map, index) => {
              return (
                <div key={index} className='box-border m-2 border-base'>
                  <img className='object-cover w-48 h-32' src={urlFor(map.images[0].asset).url()} />
                </div>
              );
            })}
          {maps[selectedTheme].questionSet
            .filter((map) => !map.isActive)
            .map((map, index) => {
              return (
                <div
                  key={index}
                  className='box-border flex-grow invisible hidden w-32 h-32 m-2 lg:inline-block'
                ></div>
              );
            })}
        </div>
        {/* <div className='flex items-center'>
          <h1 className='my-4 text-2xl font-bold'>Flere innstillinger</h1>
          <ChevronDown
            size={36}
            className={`${!showSettings && '-rotate-90'} cursor-pointer duration-200`}
            onClick={() => setShowSettings(!showSettings)}
          />
        </div>
        {showSettings && (
          <div className='p-3 text-sm text-black bg-alice-blue border-base'>
            <div className='flex justify-between'>
              <div className='box-border flex flex-col w-1/2 p-4'>
                <h2 className='text-lg font-semibold'>Tid per runde</h2>
                <p className='pb-2'>Velg varigheten på hver runde</p>
                <select
                  disabled
                  name='time'
                  id='timeDropdown'
                  className='p-1 mt-auto shadow-lg w-36 h-7 border-base'
                >
                  <option>2 minutter</option>
                  <option>5 minutter</option>
                  <option selected>10 minutter</option>
                  <option>20 minutter</option>
                </select>
              </div>
              <div className='box-border w-1/2 p-4'>
                <h2 className='text-lg font-semibold'>Tilfeldige lag</h2>
                <p className='pb-2'>
                  Velg om lag skal velges tilfeldig eller være opp til spillerene
                </p>
                <input
                  type='checkbox'
                  checked
                  disabled
                  id='randomTeamsCheckbox'
                  className='mt-auto shadow-lg h-7 w-7 border-base'
                />
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='box-border w-1/2 p-4'>
                <h2 className='text-lg font-semibold'>Maksimal lagstørrelse</h2>
                <p className='pb-2'>
                  Velg størrelsen på lag, eller la det styres automatisk av spillet
                </p>
                <select
                  disabled
                  name='time'
                  id='timeDropdown'
                  className='p-1 mt-auto shadow-lg w-36 h-7 border-base'
                >
                  <option>Auto (anbefalt)</option>
                  <option>4</option>
                  <option>5</option>
                </select>
              </div>
              <div className='box-border w-1/2 p-4'>
                <h2 className='text-lg font-semibold'>Tilfeldige roller</h2>
                <p className='pb-2'>
                  Velg om spillerene kan velge rollene sine eller om de skal velges tilfeldig
                </p>
                <input
                  checked
                  disabled
                  type='checkbox'
                  id='randomRolesCheckbox'
                  className='mt-auto shadow-lg h-7 w-7 border-base'
                />
              </div>
            </div>
          </div>
        )} */}
        <div className='mt-6 text-center'>
          <button
            className='mx-4 mb-2 btn-lg w-44'
            onClick={() => {
              navigate('/');
            }}
          >
            Gå tilbake
          </button>
          <button className='mx-4 btn-lg w-44' onClick={() => createGame()}>
            Fortsett
          </button>
        </div>
      </div>
    </>
  );
};

export default CreatingGameView;

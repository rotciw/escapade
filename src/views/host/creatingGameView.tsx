import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { ChevronDown } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import { db } from '../../helpers/firebase';
import { generateGameCode, generatePlayerId } from '../../helpers/lobbyHelpers';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const CreatingGameView: React.FC = () => {
  const navigate = useNavigate();
  const [creatorGameCode, setCreatorGameCode] = useLocalStorage('gameCode', '');
  const [gameHostId, setGameHostId] = useLocalStorage('hostId', '');
  const [showSettings, setShowSettings] = useState(true);

  const createGame = async () => {
    const gameCode = generateGameCode(6);
    const hostId = generatePlayerId();
    try {
      await setDoc(doc(db, 'games', gameCode), {
        created: Date.now(),
        finished: false,
        round: 1,
        participants: [],
        theme: 0,
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

  return (
    <>
      <Header />
      <div className='flex flex-col w-2/3 max-w-2xl m-auto items-left '>
        <h1 className='my-3 text-2xl font-bold'>Velg et tema</h1>
        <div className='flex justify-between w-full pr-1'>
          <button className='btn-sq'>Intro til Escapade</button>
          <button className='btn-sq'>Revolu-sjonene</button>
          <button className='btn-sq'>1800-tallet</button>
          <button className='btn-sq'>Verdens-kriger</button>
          <button className='btn-sq'>Den Kalde Krigen</button>
        </div>
        <h2 className='mt-8'>Bilder som vil vises</h2>
        <div className='flex w-full p-2 mb-3 border-base bg-alice-blue'>
          <img
            src='https://i.imgur.com/22HFZBt.png'
            className='box-border object-cover w-1/3 m-2 border-base h-28'
          />
          <img
            src='https://i.imgur.com/22HFZBt.png'
            className='box-border object-cover w-1/3 m-2 border-base h-28'
          />
          <img
            src='https://i.imgur.com/22HFZBt.png'
            className='box-border object-cover w-1/3 m-2 border-base h-28'
          />
        </div>
        <div className='flex items-center'>
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
                  type='checkbox'
                  id='randomRolesCheckbox'
                  className='mt-auto shadow-lg h-7 w-7 border-base'
                />
              </div>
            </div>
          </div>
        )}
        <button className='m-auto mt-8 btn-lg w-44' onClick={() => createGame()}>
          Fortsett
        </button>
      </div>
    </>
  );
};

export default CreatingGameView;

import React from 'react';
import 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
import confetti from 'canvas-confetti';
import { ICurrentGamePlayer } from '~/types';
import CountUp from 'react-countup';
import Avatar from './avatar';
import { useLocalStorage } from '~/hooks/useLocalStorage';
import { Link } from 'react-router-dom';

interface PlayerResultsProps {
  teamPlayers: ICurrentGamePlayer[];
  currentPlayer: ICurrentGamePlayer;
  totalPoints: number;
  teamPlace: number;
}

const AllResultsComponent: React.FC<PlayerResultsProps> = ({
  teamPlayers,
  currentPlayer,
  totalPoints,
  teamPlace,
}) => {
  const [playerId, setPlayerId] = useLocalStorage('playerId', '');
  const duration = 5000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 10, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: any = setInterval(function () {
    let timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    let particleCount = 20 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      }),
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      }),
    );
  }, 300);

  return (
    <div className='w-[85vw] mt-8 mx-auto text-center'>
      <div className='flex flex-row justify-center mx-auto mt-6 text-black rounded bg-alice-blue'>
        <div className='px-5 py-3'>
          <h1 className='text-xl font-bold text-center'>Resultater</h1>
          <h1 className='text-lg font-semibold text-center'>Lag {currentPlayer.teamId}</h1>
          <div className='w-full my-2 border-t border-dotted border-independence'></div>
          <div className='flex flex-row flex-wrap gap-8'>
            {teamPlayers.map((player) => (
              <div key={player.id}>
                <Avatar
                  eyes={player.eyes}
                  mouth={player.mouth}
                  color={player.color}
                  name={player.name}
                  currentPlayer={playerId === player.id}
                  key={player.id}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='flex flex-row justify-center mt-6 text-black rounded bg-alice-blue'>
        <div className='p-5 mx-auto text-center w-fit'>
          <h1 className='text-xl font-bold text-center'>Dere fikk tilsammen:</h1>
          <CountUp className='font-bold text-8xl' end={totalPoints} duration={2}></CountUp>
          <h1 className='text-xl font-bold text-center'>poeng</h1>
        </div>
      </div>
      {/* <Fade delay={2500} duration={1000}>
        <div className='flex flex-row justify-center mt-6 text-black rounded bg-alice-blue'>
          <div className='p-5 mx-auto text-center w-fit'>
            <h1 className='text-xl font-bold text-center'>Som gjorde at dere kom på:</h1>
            <div className='font-bold text-8xl'>{teamPlace}.</div>
            <h1 className='text-xl font-bold text-center'>plass</h1>
          </div>
        </div>
      </Fade> */}
      <button onClick={()=> window.location.replace('https://playescapade.com')} className='mt-8 btn-lg'>
        Gå til hjemskjermen
      </button>
    </div>
  );
};

export default AllResultsComponent;

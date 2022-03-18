import React, { useEffect, useState } from 'react';
import Countdown, { calcTimeDelta } from 'react-countdown';
import { CountdownTimeDeltaFn } from 'react-countdown/dist/Countdown';

interface TimerProps {
  startTime: number;
}

const TimerComponent: React.FC<TimerProps> = ({ startTime }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const handleOnTick: CountdownTimeDeltaFn = (timeDelta) => {
    setTimeLeft(timeDelta.minutes * 60 + timeDelta.seconds);
  };

  const renderer = ({ minutes, seconds, completed }: any) => {
    // Render a countdown
    return (
      <span>
        {minutes}:{seconds < 10 ? '0' + seconds : seconds}
      </span>
    );
  };

  return (
    <>
      <p className='mb-1 text-lg font-semibold'>Tid igjen:</p>
      <div className='w-full h-10 mb-2 rounded outline-black outline bg-alice-blue-hover align-center'>
        <div
          className='flex-row h-10 p-3 my-auto text-sm font-semibold leading-none text-center text-black transition-all rounded bg-cameo-pink'
          style={{ width: `${100 - (timeLeft * 100) / 600}%` }}
        >
          <Countdown
            onMount={handleOnTick}
            onTick={handleOnTick}
            date={startTime + 600000}
            renderer={renderer}
          />
        </div>
      </div>
    </>
  );
};

export default TimerComponent;

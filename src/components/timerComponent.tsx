import React, { useState } from 'react';
import Countdown from 'react-countdown';
import { CountdownApi, CountdownTimeDeltaFn } from 'react-countdown/dist/Countdown';
import { useTimeContext } from '~/contexts/timerContext';

interface TimerProps {
  startTime: number;
  roundTime: number;
}

const TimerComponent: React.FC<TimerProps> = ({ startTime, roundTime }) => {
  const { timeInSecondsLeft, setTimeInSecondsLeft, isRoundOver, setIsRoundOver } = useTimeContext();
  const [animate, setAnimate] = useState(false);

  let countdownApi: CountdownApi | null = null;

  const handleOnTick: CountdownTimeDeltaFn = (timeDelta) => {
    const timeInSeconds = timeDelta.minutes * 60 + timeDelta.seconds;
    setTimeInSecondsLeft(timeInSeconds);
    if (isRoundOver) {
      setIsRoundOver(false);
    }
    if (timeInSeconds <= 10 && timeInSeconds > 0) {
      setAnimate(true);
    }
  };

  const handleOnComplete: CountdownTimeDeltaFn = () => {
    setAnimate(false);
    setIsRoundOver(true);
  };

  const setRef = (countdown: Countdown | null): void => {
    if (countdown) {
      countdownApi = countdown.getApi();
    }
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
      <p className='mb-1 text-lg font-semibold'>Tid igjen for denne runden:</p>
      <div className='w-full h-10 mb-2 rounded outline-independence outline outline-1 bg-alice-blue-hover align-center'>
        <div
          className='flex-row h-10 p-3 my-auto text-sm font-semibold leading-none text-center text-black transition-all rounded bg-cameo-pink'
          style={{ width: `${(timeInSecondsLeft * 100) / (roundTime * 60)}%` }}
        >
          <div className={`${animate ? 'animate-pulse-fast' : ''}`}>
            <Countdown
              onMount={handleOnTick}
              onTick={handleOnTick}
              onComplete={handleOnComplete}
              date={startTime + roundTime * 60000}
              renderer={renderer}
              ref={setRef}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TimerComponent;

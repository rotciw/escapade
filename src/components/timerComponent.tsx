import React, { useState } from 'react';
import Countdown from 'react-countdown';
import { CountdownApi, CountdownTimeDeltaFn } from 'react-countdown/dist/Countdown';
import { useTimeContext } from '~/contexts/timerContext';

interface TimerProps {
  startTime: number;
}

const TimerComponent: React.FC<TimerProps> = ({ startTime }) => {
  const { timeInSecondsLeft, setTimeInSecondsLeft } = useTimeContext();
  const [animate, setAnimate] = useState(false);

  let countdownApi: CountdownApi | null = null;

  const handleOnTick: CountdownTimeDeltaFn = (timeDelta) => {
    setTimeInSecondsLeft(timeDelta.minutes * 60 + timeDelta.seconds);
    const timeInSeconds = timeDelta.minutes * 60 + timeDelta.seconds;
    if (timeInSeconds <= 10 && timeInSeconds > 0) {
      setAnimate(true);
    } else if (timeInSeconds == 0) {
      setAnimate(false);
    }
  };

  const handlePause = (): void => {
    countdownApi && countdownApi.pause();
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
          style={{ width: `${100 - (timeInSecondsLeft * 100) / 360}%` }}
        >
          <div className={`${animate ? 'animate-pulse-fast' : ''}`}>
            <Countdown
              onMount={handleOnTick}
              onTick={handleOnTick}
              date={startTime + 360000}
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

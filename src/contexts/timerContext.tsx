import React, { createContext, useContext, useMemo, useState } from 'react';

// Works as a template for now, not being used atm!
interface TimerProviderValue {
  timeInSecondsLeft: number;
  setTimeInSecondsLeft: (val: number) => void;
  isRoundOver: boolean;
  setIsRoundOver: (val: boolean) => void;
}

interface Props {
  children: React.ReactNode;
}

export const TimeContext = createContext({} as TimerProviderValue);

export const useTimeContext = () => {
  return useContext(TimeContext);
};

export const TimeContextProvider = ({ children }: Props) => {
  const [timeInSecondsLeft, setTimeInSecondsLeft] = useState<number>(0);
  const [isRoundOver, setIsRoundOver] = useState<boolean>(false);
  const gameProvider = useMemo(
    () => ({
      timeInSecondsLeft,
      setTimeInSecondsLeft,
      isRoundOver,
      setIsRoundOver,
    }),
    [timeInSecondsLeft, setTimeInSecondsLeft, isRoundOver, setIsRoundOver],
  );

  return <TimeContext.Provider value={gameProvider}>{children}</TimeContext.Provider>;
};

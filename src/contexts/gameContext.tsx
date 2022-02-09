import React, { createContext, useContext, useMemo, useState } from 'react';

// Works as a template for now, not being used atm!
interface GameProviderValue {
  globalGameCode: string;
  setGlobalGameCode: (val: string) => void;
}

interface Props {
  children: React.ReactNode;
}

export const GameContext = createContext({} as GameProviderValue);

export const useGameContext = () => {
  return useContext(GameContext);
};

export const GameContextProvider = ({ children }: Props) => {
  const [globalGameCode, setGlobalGameCode] = useState<string>('');
  const gameProvider = useMemo(
    () => ({
      globalGameCode,
      setGlobalGameCode,
    }),
    [globalGameCode, setGlobalGameCode],
  );

  return <GameContext.Provider value={gameProvider}>{children}</GameContext.Provider>;
};

import React, { useEffect } from 'react';
import { ArrowRight, ArrowLeft, RefreshCw } from 'react-feather';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CharacterCreation: React.FC<{
  joinFunction: (playerName: string) => void;
  nameSetter: React.Dispatch<React.SetStateAction<string>>;
  eyeSetter: React.Dispatch<React.SetStateAction<number>>;
  mouthSetter: React.Dispatch<React.SetStateAction<number>>;
  colorSetter: React.Dispatch<React.SetStateAction<number>>;
  errorMsg: string;
}> = ({ joinFunction, nameSetter, eyeSetter, mouthSetter, colorSetter, errorMsg }) => {
  const [eyeNumber, setEyeNumber] = useLocalStorage('playerEyes', '1');
  const [mouthNumber, setMouthNumber] = useLocalStorage('playerMouth', '1');
  const [colorNumber, setColorNumber] = useLocalStorage('playerColor', '1');
  const [playerName, setPlayerName] = useLocalStorage('playerName', '');

  // Total number of options for heads, bodies and colors
  const totalEyes = 5;
  const totalMouths = 5;
  const totalColors = 5;

  // Helper functions that assist with wraparound numbers (ie. option nr 5 -> option nr 1)
  const findNextNumber = (currentNumber: number, maxNumber: number) => {
    return +currentNumber < maxNumber ? +currentNumber + 1 : 1;
  };

  const findPreviousNumber = (currentNumber: number, maxNumber: number) => {
    return +currentNumber > 1 ? +currentNumber - 1 : maxNumber;
  };

  const randomizeCharacter = () => {
    setEyeNumber(Math.ceil(Math.random() * totalEyes).toString());
    setMouthNumber(Math.ceil(Math.random() * totalMouths).toString());
    setColorNumber(Math.ceil(Math.random() * totalColors).toString());
  };

  const onInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    setPlayerName(event.currentTarget.value);
  };

  // Updates state of parent whenever character is changed (inc. name). Needed since parent sends data to db based on own state, not localstorage
  // Might be better to just have parent retreive data from localstorage when sending join game request
  useEffect(() => {
    nameSetter(playerName);
    eyeSetter(+eyeNumber);
    mouthSetter(+mouthNumber);
    colorSetter(+colorNumber);
  }, [
    mouthNumber,
    mouthSetter,
    colorNumber,
    colorSetter,
    eyeNumber,
    eyeSetter,
    playerName,
    nameSetter,
  ]);

  return (
    <div className='box-border flex flex-col max-w-md px-20 py-8 mx-auto text-black border border-black rounded bg-alice-blue'>
      <input
        className='p-2 text-center text-black uppercase transition-all border rounded placeholder-normal border-independence focus:shadow-sm focus:ring-magic-mint'
        type='text'
        placeholder='Skriv inn navn'
        value={playerName}
        onChange={onInputChange}
      />
      <div className='flex justify-center'>
        <div className='flex flex-col justify-end'>
          <ArrowLeft
            className='float-right icon-clickable'
            size={36}
            onClick={() => setEyeNumber(findPreviousNumber(+eyeNumber, totalEyes).toString())}
          />
          <ArrowLeft
            className='float-right icon-clickable'
            size={36}
            onClick={() => setMouthNumber(findPreviousNumber(+mouthNumber, totalMouths).toString())}
          />
          <ArrowLeft
            className='float-right icon-clickable'
            size={36}
            onClick={() => setColorNumber(findPreviousNumber(+colorNumber, totalColors).toString())}
          />
        </div>
        <div className='relative h-40 align-top w-36'>
          <img
            className='absolute select-none t-0'
            src={`./images/characters/color/${colorNumber}.svg`}
          />
          <img
            className='absolute select-none t-0'
            src={`./images/characters/eyes/${eyeNumber}.svg`}
          />
          <img
            className='absolute select-none t-0'
            src={`./images/characters/mouth/${mouthNumber}.svg`}
          />
        </div>
        <div className='flex flex-col justify-end'>
          <ArrowRight
            className='icon-clickable'
            size={36}
            onClick={() => setEyeNumber(findNextNumber(+eyeNumber, totalEyes).toString())}
          />
          <ArrowRight
            className='icon-clickable'
            size={36}
            onClick={() => setMouthNumber(findNextNumber(+mouthNumber, totalMouths).toString())}
          />
          <ArrowRight
            className='icon-clickable'
            size={36}
            onClick={() => setColorNumber(findNextNumber(+colorNumber, totalColors).toString())}
          />
        </div>
      </div>
      <div
        className='p-1 mx-auto mb-10 font-bold transition-all rounded cursor-pointer select-none hover:bg-alice-blue-hover'
        onClick={() => randomizeCharacter()}
      >
        <RefreshCw className='inline mr-3' />
        Tilfeldig
      </div>
      <button className='select-none btn-lg' onClick={() => joinFunction(playerName)}>
        Bli med
      </button>
      {errorMsg ? <p className='mt-2 text-sm'>{errorMsg} &nbsp;</p> : <></>}
    </div>
  );
};

export default CharacterCreation;

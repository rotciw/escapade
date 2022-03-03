import React, { MouseEventHandler, useEffect } from 'react';
import { ArrowRight, ArrowLeft, RefreshCw } from 'react-feather';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CharacterCreation: React.FC<{
  joinFunction: MouseEventHandler;
  nameSetter: React.Dispatch<React.SetStateAction<string>>;
  headSetter: React.Dispatch<React.SetStateAction<number>>;
  bodySetter: React.Dispatch<React.SetStateAction<number>>;
  colorSetter: React.Dispatch<React.SetStateAction<number>>;
}> = ({ joinFunction, nameSetter, headSetter, bodySetter, colorSetter }) => {
  const [headNumber, setHeadNumber] = useLocalStorage('playerHead', '1');
  const [bodyNumber, setBodyNumber] = useLocalStorage('playerBody', '1');
  const [colorNumber, setColorNumber] = useLocalStorage('playerColor', '1');
  const [playerName, setPlayerName] = useLocalStorage('playerName', '');

  // Total number of options for heads, bodies and colors
  const totalHeads = 5;
  const totalBodies = 5;
  const totalColors = 5;

  // Helper functions that assist with wraparound numbers (ie. option nr 5 -> option nr 1)
  const findNextNumber = (currentNumber: number, maxNumber: number) => {
    return +currentNumber < maxNumber ? +currentNumber + 1 : 1;
  };

  const findPreviousNumber = (currentNumber: number, maxNumber: number) => {
    return +currentNumber > 1 ? +currentNumber - 1 : maxNumber;
  };

  const randomizeCharacter = () => {
    setHeadNumber(Math.ceil(Math.random() * totalHeads).toString());
    setBodyNumber(Math.ceil(Math.random() * totalBodies).toString());
    setColorNumber(Math.ceil(Math.random() * totalColors).toString());
  };

  const onInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    setPlayerName(event.currentTarget.value);
  };

  // Updates state of parent whenever character is changed (inc. name). Needed since parent sends data to db based on own state, not localstorage
  // Might be better to just have parent retreive data from localstorage when sending join game request
  useEffect(() => {
    nameSetter(playerName);
    headSetter(+headNumber);
    bodySetter(+bodyNumber);
    colorSetter(+colorNumber);
  }, [
    bodyNumber,
    bodySetter,
    colorNumber,
    colorSetter,
    headNumber,
    headSetter,
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
      <table className='my-8'>
        <tbody>
          <tr>
            <td>
              <ArrowLeft
                className='float-right icon-clickable'
                size={36}
                onClick={() =>
                  setHeadNumber(findPreviousNumber(+headNumber, totalHeads).toString())
                }
              />
            </td>
            <td className='relative w-32 h-48 align-top' rowSpan={3}>
              <img
                className='absolute select-none t-0'
                src={`./dist/images/characters/body_bg/${colorNumber}.svg`}
              />
              <img
                className='absolute select-none t-0'
                src={`./dist/images/characters/head_bg/${colorNumber}.svg`}
              />
              <img
                className='absolute select-none t-0'
                src={`./dist/images/characters/head_fg/${headNumber}.svg`}
              />
              <img
                className='absolute select-none t-0'
                src={`./dist/images/characters/body_fg/${bodyNumber}.svg`}
              />
            </td>
            <td>
              <ArrowRight
                className='icon-clickable'
                size={36}
                onClick={() => setHeadNumber(findNextNumber(+headNumber, totalHeads).toString())}
              />
            </td>
          </tr>
          <tr>
            <td>
              <ArrowLeft
                className='float-right icon-clickable'
                size={36}
                onClick={() =>
                  setBodyNumber(findPreviousNumber(+bodyNumber, totalBodies).toString())
                }
              />
            </td>
            <td>
              <ArrowRight
                className='icon-clickable'
                size={36}
                onClick={() => setBodyNumber(findNextNumber(+bodyNumber, totalBodies).toString())}
              />
            </td>
          </tr>
          <tr>
            <td>
              <ArrowLeft
                className='float-right icon-clickable'
                size={36}
                onClick={() =>
                  setColorNumber(findPreviousNumber(+colorNumber, totalColors).toString())
                }
              />
            </td>
            <td>
              <ArrowRight
                className='icon-clickable'
                size={36}
                onClick={() => setColorNumber(findNextNumber(+colorNumber, totalColors).toString())}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div
        className='mx-auto mb-10 font-bold cursor-pointer select-none'
        onClick={() => randomizeCharacter()}
      >
        <RefreshCw className='inline mr-3' />
        Tilfeldig
      </div>
      <button className='btn-sm' onClick={(event) => joinFunction(event)}>
        Bli med
      </button>
    </div>
  );
};

export default CharacterCreation;

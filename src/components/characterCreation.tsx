import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, RefreshCw } from 'react-feather';

const CharacterCreation: React.FC = () => {
  const [headNumber, setHeadNumber] = useState(1);
  const [bodyNumber, setBodyNumber] = useState(1);
  const [colorNumber, setColorNumber] = useState(1);

  // Total number of options for heads, bodies and colors
  const totalHeads = 5;
  const totalBodies = 5;
  const totalColors = 5;

  // Onclick functions that go to the next or previous head, body or color

  const nextHead = () => {
    const nextNumber = headNumber < totalHeads ? headNumber + 1 : 1;
    setHeadNumber(nextNumber);
  };

  const previousHead = () => {
    const previousNumber = headNumber > 1 ? headNumber - 1 : totalHeads;
    setHeadNumber(previousNumber);
  };

  const nextBody = () => {
    const nextNumber = bodyNumber < totalBodies ? bodyNumber + 1 : 1;
    setBodyNumber(nextNumber);
  };

  const previousBody = () => {
    const previousNumber = bodyNumber > 1 ? bodyNumber - 1 : totalBodies;
    setBodyNumber(previousNumber);
  };

  const nextColor = () => {
    const nextNumber = colorNumber < totalColors ? colorNumber + 1 : 1;
    setColorNumber(nextNumber);
  };

  const previousColor = () => {
    const previousNumber = colorNumber > 1 ? colorNumber - 1 : totalColors;
    setColorNumber(previousNumber);
  };

  const randomizeCharacter = () => {
    // event.preventDefault
    setHeadNumber(Math.ceil(Math.random() * totalHeads));
    setBodyNumber(Math.ceil(Math.random() * totalBodies));
    setColorNumber(Math.ceil(Math.random() * totalColors));
  };

  return (
    <form className='box-border flex flex-col max-w-md px-20 py-8 mx-auto border border-black rounded bg-alice-blue'>
      <input
        className='p-1 text-xl text-center border border-black rounded'
        type='text'
        placeholder='Skriv inn navn'
      />
      <table className='my-8'>
        <tbody>
          <tr>
            <td>
              <ArrowLeft className='float-right cursor-pointer' onClick={() => previousHead()} />
            </td>
            <td className='relative w-24 h-48 align-top' rowSpan={3}>
              <img
                className='absolute select-none t-0'
                src={`../../images/characters/colors/${colorNumber}.png`}
              />
              <img
                className='absolute select-none t-0'
                src={`../../images/characters/heads/${headNumber}.png`}
              />
              <img
                className='absolute select-none t-0'
                src={`../../images/characters/bodies/${bodyNumber}.png`}
              />
            </td>
            <td>
              <ArrowRight className='cursor-pointer' onClick={() => nextHead()} />
            </td>
          </tr>
          <tr>
            <td>
              <ArrowLeft className='float-right cursor-pointer' onClick={() => previousBody()} />
            </td>
            <td>
              <ArrowRight className='cursor-pointer' onClick={() => nextBody()} />
            </td>
          </tr>
          <tr>
            <td>
              <ArrowLeft className='float-right cursor-pointer' onClick={() => previousColor()} />
            </td>
            <td>
              <ArrowRight className='cursor-pointer' onClick={() => nextColor()} />
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
      <button className='border border-black rounded bg-cameo-pink shadow-magic-mint shadow-[4px_4px_0] font-bold py-3 text-xl'>
        Bli med
      </button>
    </form>
  );
};

export default CharacterCreation;

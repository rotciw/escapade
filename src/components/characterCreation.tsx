import React from 'react';

const CharacterCreation: React.FC = () => {
  return (
    <form className='box-border flex flex-col max-w-md px-20 py-8 mx-auto border border-black rounded bg-alice-blue'>
      <input
        className='p-1 text-xl text-center border border-black rounded'
        type='text'
        placeholder='Skriv inn navn'
      />
      <table className='my-8'>
        <tr>
          <td>tl</td>
          <td className='relative w-24 h-48 align-top' rowSpan={3}>
            <img className='absolute t-0' src='../../images/characters/bodies/1.png'></img>
            <img className='absolute t-0' src='../../images/characters/heads/1.png'></img>
            <img className='absolute t-0' src='../../images/characters/clothes/1.png'></img>
          </td>
          <td>tr</td>
        </tr>
        <tr>
          <td>ml</td>
          <td>mr</td>
        </tr>
        <tr>
          <td>bl</td>
          <td>br</td>
        </tr>
      </table>
      <button className='mb-10 font-bold'>Tilfeldig</button>
      <button className='border border-black rounded bg-cameo-pink shadow-magic-mint shadow-[4px_4px_0] font-bold py-3 text-xl'>
        Bli med
      </button>
    </form>
  );
};

export default CharacterCreation;

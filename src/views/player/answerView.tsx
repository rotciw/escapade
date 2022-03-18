import React, { useEffect, useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import CountUp from 'react-countup';
import Header from '~/components/header';

import TimerComponent from '~/components/timerComponent';

interface AnswerProps {
  round: number;
}

const AnswerView: React.FC<AnswerProps> = ({ round }) => {
  return (
    <>
      <div className='flex flex-col p-5 flex-wrap text-center pb-8 mt-2 bg-alice-blue w-[80vw] mx-auto rounded text-black h-[70vh]'>
        <p className='font-semibold'>Runde: {round + 1}/3</p>
        <div className='my-2'>
          <p className='mb-2'>Poeng dere fikk denne runden</p>
          <CountUp className='text-5xl font-bold' end={2030} duration={2} />
        </div>
        <Fade delay={2200} duration={2000}>
          <div>
            <p className='text-lg font-bold'>Bra jobbet!</p> Bla ned for å se svarene for denne
            runden.
          </div>
        </Fade>
      </div>
    </>
  );
};

export default AnswerView;

import React from 'react';
import CountUp from 'react-countup';
import Zoom from 'react-medium-image-zoom';
import { MapData, QuestionSet, TeamAnswers } from '~/types';
import { MapPin } from 'react-feather';
import MapComponent from '~/components/mapComponent';
import { convertDate } from '~/helpers/lobbyHelpers';

interface AnswerProps {
  role: number;
}

const ExpertComponent: React.FC<AnswerProps> = ({ role }) => {
  return (
    <>
      <div className='overflow-y-auto flex flex-col p-5 text-center pb-8 mt-4 bg-alice-blue w-[80vw] mx-auto rounded text-black h-[65vh]'></div>
    </>
  );
};

export default ExpertComponent;

import React from 'react';
import CountUp from 'react-countup';
import Zoom from 'react-medium-image-zoom';
import { MapData, QuestionSet, TeamAnswers } from '~/types';
import { MapPin } from 'react-feather';
import MapComponent from '~/components/mapComponent';
import { convertDate } from '~/helpers/lobbyHelpers';

interface AnswerProps {
  round: number;
  roundImg: string;
  questionSet: QuestionSet;
  teamAnswers: TeamAnswers | undefined;
}

const AnswerView: React.FC<AnswerProps> = ({ round, roundImg, questionSet, teamAnswers }) => {
  const Marker = (lat: any, lng: any) => {
    return (
      <div className='-mx-5 -my-12'>
        <MapPin color='red' size={40} fill='white' />
      </div>
    );
  };

  const CorrectMarker = (lat: any, lng: any) => {
    return (
      <div className='-mx-5 -my-12'>
        <MapPin color='green' size={40} fill='white' />
      </div>
    );
  };

  const addPointsUp = () => {
    if (teamAnswers) {
      const multipleChoicePoints = teamAnswers?.multipleChoiceAnswer.points;
      const dateStringPoints = teamAnswers?.dateStringAnswer.points;
      const mapPoints = teamAnswers?.mapPointerAnswer.points;
      return multipleChoicePoints + dateStringPoints + mapPoints;
    }
    return 0;
  };

  return (
    <>
      <div className='overflow-y-auto flex flex-col p-5 text-center pb-8 mt-4 bg-alice-blue w-[80vw] mx-auto rounded text-black h-[65vh]'>
        <p className='font-semibold'>Runde: {round + 1}/3</p>
        <div className='my-2'>
          <p className='mb-2'>Poeng dere fikk denne runden</p>
          <CountUp className='text-5xl font-bold' end={addPointsUp()} duration={2} />
        </div>
        {/* <Fade delay={2200} duration={2000}> */}
        <div className='flex flex-col items-center'>
          <p className='text-lg font-bold'>Bra jobbet!</p> Bla ned for å se svarene for denne runden
          🙌
          <div className='mt-5'>
            <Zoom>
              <img src={roundImg} className='w-80' />
            </Zoom>
          </div>
          <div className='w-3/4 lg:w-1/3'>
            <div className='w-full my-2 border-t border-dotted border-independence'></div>
            <label className='mt-3 text-lg font-semibold'>
              1. {questionSet.multipleChoiceQuestion.question}
            </label>
            {questionSet.multipleChoiceQuestion.choices.map((choice, index) => {
              return (
                <div
                  key={index}
                  className={`${choice.isCorrect ? 'bg-magic-mint z-10' : ''}
                    ${
                      !choice.isCorrect && teamAnswers?.multipleChoiceAnswer.answer == index
                        ? 'bg-red bg-opacity-30'
                        : ''
                    }
                   bg-white px-2 py-2 my-1 mt-2 text-center transition-all border rounded border-independence`}
                >
                  {choice.alternative}
                </div>
              );
            })}
            <div className='flex justify-end mt-2 mb-4'>
              <p className='font-bold'>/ 300 poeng</p>
            </div>
            <div className='w-full my-2 border-t border-dotted border-independence'></div>
            <label className='mt-3 text-lg font-semibold'>
              2. {questionSet.stringDateQuestion.question}
            </label>
            <input
              className={`${
                convertDate(teamAnswers?.dateStringAnswer.answer.toString()) ==
                questionSet.stringDateQuestion.answer
                  ? 'bg-magic-mint'
                  : 'bg-red bg-opacity-30'
              } w-full mt-2 text-center cursor-text input-main`}
              type='text'
              value={convertDate(teamAnswers?.dateStringAnswer.answer.toString()) || ''}
              disabled={true}
            />
            <div className='flex justify-between mt-2 mb-4'>
              <p>
                Fasit: <b>{questionSet.stringDateQuestion.answer}</b>
              </p>
              <p className='font-bold'>/ 300 poeng</p>
            </div>
            <div className='w-full my-2 border-t border-dotted border-independence'></div>
            <label className='my-2 text-lg font-semibold'>
              3. {questionSet.mapPointerQuestion.question}
            </label>
            <div className='h-[45vh] mt-2'>
              <MapComponent
                center={{
                  lat: questionSet.mapPointerQuestion.answer.lat,
                  lng: questionSet.mapPointerQuestion.answer.lng,
                }} // To-Do: Can calculate center to be between the two markers
                zoom={1}
              >
                {!teamAnswers?.mapPointerAnswer ? (
                  <></>
                ) : (
                  <Marker
                    lat={(teamAnswers?.mapPointerAnswer.answer as MapData).lat}
                    lng={(teamAnswers?.mapPointerAnswer.answer as MapData).lng}
                  />
                )}
                <CorrectMarker
                  lat={questionSet.mapPointerQuestion.answer.lat}
                  lng={questionSet.mapPointerQuestion.answer.lng}
                />
              </MapComponent>
            </div>
            <div className='flex justify-between mt-2 mb-4'>
              <p>x km unna</p>
              <p className='font-bold'>/ 300 poeng</p>
            </div>
          </div>
        </div>
        {/* </Fade> */}
      </div>
    </>
  );
};

export default AnswerView;
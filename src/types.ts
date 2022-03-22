export interface IGame {
  created: number;
  finished: boolean;
  participants: ICurrentGamePlayer[];
  round: number;
  hostId: string;
  canJoin: boolean;
  selectionStep: number;
  theme: number;
}

export interface IPlayer {
  id: string;
  name: string;
  eyes: number;
  mouth: number;
  color: number;
}

export interface ICurrentGamePlayer {
  id: string;
  name: string;
  teamId: number;
  role: number;
  eyes: number;
  mouth: number;
  body: number;
  color: number;
  startTime: number;
  points: number;
  answer: boolean;
  round: number;
  startedGame: boolean;
  round1: TeamAnswers;
  round2: TeamAnswers;
  round3: TeamAnswers;
}

export interface ITeam {
  id: number;
  participants: ICurrentGamePlayer[];
}

export interface IRole {
  id: number;
  playerId: '';
}

export interface IRoleInfo {
  title: string;
  subtitle: string;
  description: string;
}

export interface SanityMapData {
  title: string;
  id: number;
  description: string;
  questionSet: QuestionSet[];
}

export interface QuestionSet {
  images: Image[];
  multipleChoiceQuestion: MultipleChoiceQuestion;
  stringDateQuestion: StringDateQuestion;
  mapPointerQuestion: MapPointerQuestion;
}

export interface TeamAnswers {
  multipleChoiceAnswer: AnswerDetail;
  dateStringAnswer: AnswerDetail;
  mapPointerAnswer: AnswerDetail;
}

interface AnswerDetail {
  answer: MapData | number | string;
  points: number;
}

interface MultipleChoiceQuestion {
  choices: Choice[];
  question: string;
}

interface Choice {
  alternative: string;
  isCorrect?: boolean;
}

interface StringDateQuestion {
  question: string;
  answer: string;
}

interface MapPointerQuestion {
  question: string;
  answer: MapData;
}

export interface MapData {
  lat: number;
  lng: number;
}

interface Image {
  asset: Asset;
  alt: string;
}

export type Asset = {
  url: string;
  _id: string;
};

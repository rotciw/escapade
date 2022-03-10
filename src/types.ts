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
  head: number;
  body: number;
  color: number;
}

export interface ICurrentGamePlayer {
  id: string;
  name: string;
  teamId: number;
  isReady: boolean;
  role: number;
  head: number;
  body: number;
  color: number;
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

interface QuestionSet {
  images: Image[];
  multipleChoiceQuestion: MultipleChoiceQuestion;
  stringDateQuestion: StringDateQuestion;
  mapPointerQuestion: MapPointerQuestion;
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

interface MapData {
  alt: number;
  lat: number;
  lng: number;
}

interface Image {
  asset: Asset;
  alt: string;
}

type Asset = {
  url: string;
  _id: string;
};

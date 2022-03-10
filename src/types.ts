export interface IGame {
  created: number;
  finished: boolean;
  participants: ICurrentGamePlayer[];
  round: number;
  hostId: string;
  canJoin: boolean;
  selectionStep: number;
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
  isReady: boolean;
  role: number;
  eyes: number;
  mouth: number;
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
  description: string;
  questions1: string[];
  image1: Image;
  answer1: string;
  questions2: string[];
  image2: Image;
  answer2: string;
}

interface Image {
  asset: Asset;
  alt: string;
}

type Asset = {
  url: string;
  _id: string;
};

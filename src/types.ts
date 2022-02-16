export interface IGame {
  created: number;
  finished: boolean;
  participants: IPlayer[];
  round: number;
}

export interface IPlayer {
  id: string;
  name: string;
  isReady: boolean;
}

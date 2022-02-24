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
}

export interface ICurrentGamePlayer {
  id: string;
  name: string;
  teamId: number;
  isReady: boolean;
}

export interface ITeam {
  id: number;
  participants: ICurrentGamePlayer[];
}

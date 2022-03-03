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
